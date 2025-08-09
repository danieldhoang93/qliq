-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Servers
CREATE TABLE IF NOT EXISTS servers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Channels (per-server)
CREATE TABLE IF NOT EXISTS server_channels (
  id SERIAL PRIMARY KEY,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE (server_id, name)
);

-- Teams (per-server)
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (server_id, name)
);

-- User-to-Server
CREATE TABLE IF NOT EXISTS user_server_memberships (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, server_id)
);

-- User-to-Team (one per server)
CREATE TABLE IF NOT EXISTS user_team_memberships (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, server_id)
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  server_id INT REFERENCES servers(id) ON DELETE SET NULL,
  team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_server_channels_server_id ON server_channels(server_id);
CREATE INDEX IF NOT EXISTS idx_teams_server_id ON teams(server_id);
CREATE INDEX IF NOT EXISTS idx_usm_user_id ON user_server_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_usm_server_id ON user_server_memberships(server_id);
CREATE INDEX IF NOT EXISTS idx_utm_user_server ON user_team_memberships(user_id, server_id);
CREATE INDEX IF NOT EXISTS idx_chat_server_created ON chat_messages(server_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_team_created ON chat_messages(team_id, created_at DESC);
