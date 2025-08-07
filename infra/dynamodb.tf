resource "aws_dynamodb_table" "click_logs" {
  name           = "Clicks"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "PK"
  range_key      = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Project     = "qliq"
  }
}
