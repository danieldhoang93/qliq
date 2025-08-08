# rds-init.tf
resource "null_resource" "init_db_schema" {
  depends_on = [aws_db_instance.postgres]

  provisioner "local-exec" {
    # PowerShell script via heredoc
    command     = <<-PS
      $env:PGPASSWORD = "${var.db_password}"
      psql `
        -h ${aws_db_instance.postgres.address} `
        -U ${aws_db_instance.postgres.username} `
        -d ${var.db_name} `
        -f schema.sql
    PS
    interpreter = ["PowerShell", "-Command"]
  }
}
