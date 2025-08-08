# ✅ Security group for RDS
resource "aws_security_group" "qliq_db" {
  name        = "qliq-db-sg"
  description = "Allow PostgreSQL access"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # 🚨 OPEN TO WORLD — secure this for production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "qliq-db-sg"
  }
}

# ✅ Subnet group for RDS
resource "aws_db_subnet_group" "qliq" {
  name       = "qliq-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "qliq-db-subnet-group"
  }
}

# ✅ RDS Instance
resource "aws_db_instance" "postgres" {
  identifier             = "qliq-db"
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  max_allocated_storage  = 100
  storage_type           = "gp3"
  db_name                = var.db_name
  username               = "postgres"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.qliq.name
  vpc_security_group_ids = [aws_security_group.qliq_db.id]
  skip_final_snapshot    = true
  publicly_accessible    = true
  deletion_protection    = false

  tags = {
    Environment = var.environment
    Project     = "qliq"
  }
}

# ✅ Outputs
output "rds_endpoint" {
  description = "The endpoint of the RDS PostgreSQL instance"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "PostgreSQL port"
  value       = aws_db_instance.postgres.port
}

output "rds_username" {
  description = "Username for the RDS instance"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}

output "rds_db_name" {
  description = "Initial database name"
  value       = var.db_name
}

output "rds_sg_id" { value = aws_security_group.qliq_db.id }
output "rds_subnet_grp" { value = aws_db_subnet_group.qliq.name }