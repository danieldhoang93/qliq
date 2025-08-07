import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from './dynamoClient.js';

export async function getAllClicks() {
  const command = new ScanCommand({
    TableName: 'Clicks',
  });

  console.log('Fetching all clicks from DynamoDB');
  const response = await ddb.send(command);

  const total = response.Items?.reduce((sum, item) => {
    return sum + (item.amount ?? 1);
  }, 0);

  return total ?? 0;
}

export async function logClick(userId: string, timestamp: number) {
  await ddb.send(
    new PutCommand({
      TableName: 'Clicks',
      Item: {
        PK: `${userId}`,
        SK: `${timestamp}`,
        type: 'click',
        value: 1,
      },
    })
  );
}
