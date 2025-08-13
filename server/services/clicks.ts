import { PutCommand, QueryCommand, QueryCommandInput, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from './dynamoClient.js';

async function sumQuery(input: QueryCommandInput) {
  let total = 0,
    startKey: Record<string, any> | undefined;
  do {
    const resp = await ddb.send(new QueryCommand({ ...input, ExclusiveStartKey: startKey }));
    for (const it of resp.Items ?? []) total += Number((it as any).amount ?? 1);
    startKey = resp.LastEvaluatedKey;
  } while (startKey);
  return total;
}

// server total
export function totalForServer(serverId: string | number) {
  return sumQuery({
    TableName: 'Clicks',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: { ':pk': `SERVER#${serverId}` },
    ProjectionExpression: 'amount',
  });
}

// team total
export function totalForTeam(serverId: string | number, teamId: string | number) {
  return sumQuery({
    TableName: 'Clicks',
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `SERVER#${serverId}`,
      ':sk': `TEAM#${teamId}`,
    },
    ProjectionExpression: 'amount',
  });
}

// user total (all servers/teams)
export function totalForUser(userId: string | number) {
  return sumQuery({
    TableName: 'Clicks',
    IndexName: 'UserIndex',
    KeyConditionExpression: 'GSI1PK = :u',
    ExpressionAttributeValues: { ':u': `USER#${userId}` },
    ProjectionExpression: 'amount',
  });
}

// user total for a server
export function totalForUserInServer(userId: string | number, serverId: string | number) {
  return sumQuery({
    TableName: 'Clicks',
    IndexName: 'UserIndex',
    KeyConditionExpression: 'GSI1PK = :u AND begins_with(GSI1SK, :p)',
    ExpressionAttributeValues: {
      ':u': `USER#${userId}`,
      ':p': `SERVER#${serverId}`,
    },
    ProjectionExpression: 'amount',
  });
}

// user total for a team in a server
export function totalForUserInTeam(
  userId: string | number,
  serverId: string | number,
  teamId: string | number
) {
  return sumQuery({
    TableName: 'Clicks',
    IndexName: 'UserIndex',
    KeyConditionExpression: 'GSI1PK = :u AND begins_with(GSI1SK, :p)',
    ExpressionAttributeValues: {
      ':u': `USER#${userId}`,
      ':p': `SERVER#${serverId}#TEAM#${teamId}`,
    },
    ProjectionExpression: 'amount',
  });
}

export async function logClick(
  userId: number,
  serverId: number,
  teamId: number | null,
  amount: number
) {
  const ts = Date.now().toString().padStart(13, '0');
  const defauiltTeamId = teamId ?? 0; // 0 means user has not clicked for a team

  await ddb.send(
    new PutCommand({
      TableName: 'Clicks',
      Item: {
        PK: `SERVER#${serverId}`,
        SK: `TEAM#${defauiltTeamId}#TS#${ts}#USER#${userId}#${crypto.randomUUID()}`,
        GSI1PK: `USER#${userId}`,
        GSI1SK: `SERVER#${serverId}#TEAM#${defauiltTeamId}#TS#${ts}`,
        serverId: String(serverId),
        teamId: String(defauiltTeamId),
        userId: String(userId),
        amount,
      },
    })
  );
}
