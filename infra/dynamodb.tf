resource "aws_dynamodb_table" "click_logs" {
  name         = "Clicks"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  # Additional attributes to allow projections (non-key)
  attribute {
    name = "serverId"
    type = "S"
  }

  attribute {
    name = "teamId"
    type = "S"
  }

  attribute {
    name = "channelId"
    type = "S"
  }

  # Optional Global Secondary Indexes (to allow querying by server/team/channel)
  global_secondary_index {
    name            = "ServerIndex"
    hash_key        = "serverId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "TeamIndex"
    hash_key        = "teamId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "ChannelIndex"
    hash_key        = "channelId"
    projection_type = "ALL"
  }

  tags = {
    Environment = "dev"
    Project     = "qliq"
  }
}
