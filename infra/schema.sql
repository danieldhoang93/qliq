-- schema.sql

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Servers
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

-- Channels
CREATE TABLE IF NOT EXISTS server_channels (
  id UUID PRIMARY KEY,
  server_id UUID REFERENCES servers(id),
  name TEXT NOT NULL
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY,
  server_id UUID REFERENCES servers(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User-to-Server Relationship
CREATE TABLE IF NOT EXISTS user_server_memberships (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  server_id UUID REFERENCES servers(id),
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- User-to-Team (one per server)
CREATE TABLE IF NOT EXISTS user_team_memberships (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  server_id UUID REFERENCES servers(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, server_id)
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY,
  server_id UUID REFERENCES servers(id),
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
