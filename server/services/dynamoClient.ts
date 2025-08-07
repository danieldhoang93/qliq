

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = 'us-west-2'; // Change if you're using a different region

const baseClient = new DynamoDBClient({ region: REGION });
export const ddb = DynamoDBDocumentClient.from(baseClient);
