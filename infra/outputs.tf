# RDS Outputs

output "db_instance_endpoint" {
  description = "DNS address of the RDS PostgreSQL instance"
  value       = aws_db_instance.postgres.address
}

output "db_instance_port" {
  description = "Port RDS PostgreSQL is listening on"
  value       = aws_db_instance.postgres.port
}

output "db_instance_name" {
  description = "Name of the default database"
  value       = var.db_name
}

output "db_username" {
  description = "Database admin username"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}

# DynamoDB Outputs
output "clicks_table_name" {
  description = "Name of the DynamoDB Click Logs table"
  value       = aws_dynamodb_table.clicks.name
}

output "clicks_table_arn" {
  description = "ARN of the DynamoDB Click Logs table"
  value       = aws_dynamodb_table.clicks.arn
}

output "db_subnet_group" {
  value = aws_db_subnet_group.qliq.name
}

# Security group IDs
output "db_security_group_id" {
  value = aws_security_group.qliq_db.id
}
