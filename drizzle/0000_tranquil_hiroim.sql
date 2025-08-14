-- ==========================================
-- Base tables
-- ==========================================

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

-- Teams (per-server)
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (server_id, name)
);

-- User-to-Server (many servers per user)
CREATE TABLE IF NOT EXISTS user_server_memberships (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, server_id)
);

-- User-to-Team (many teams per user; teams scoped to a server)
-- Note: We keep server_id for convenient querying and to enable a consistency check.
CREATE TABLE IF NOT EXISTS user_team_memberships (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Allow many teams, even in the same server; prevent duplicates of the same team:
  UNIQUE (user_id, team_id)
);

-- Chat Messages
-- server_id is always set; team_id is NULL for server-wide chat, NOT NULL for team chat.
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  server_id INT NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- Indices
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_teams_server_id ON teams(server_id);

CREATE INDEX IF NOT EXISTS idx_usm_user_id ON user_server_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_usm_server_id ON user_server_memberships(server_id);

-- Helpful for “all teams this user has in this server”
CREATE INDEX IF NOT EXISTS idx_utm_user_server ON user_team_memberships(user_id, server_id);
CREATE INDEX IF NOT EXISTS idx_utm_team_id ON user_team_memberships(team_id);

-- Fast pagination:
-- Latest server chat (team_id IS NULL) per server
CREATE INDEX IF NOT EXISTS idx_chat_server_created_desc
  ON chat_messages(server_id, created_at DESC, id DESC)
  WHERE team_id IS NULL;

-- Latest team chat (team_id IS NOT NULL) per team
CREATE INDEX IF NOT EXISTS idx_chat_team_created_desc
  ON chat_messages(team_id, created_at DESC, id DESC)
  WHERE team_id IS NOT NULL;

-- ==========================================
-- Remove channels (requested)
-- ==========================================
DROP TABLE IF EXISTS server_channels;

-- ==========================================
-- (Optional) Consistency check:
-- Ensure chat_messages.team_id (if present) belongs to chat_messages.server_id
-- and user_team_memberships.server_id matches the team's server_id.
-- ==========================================

CREATE OR REPLACE FUNCTION enforce_team_server_consistency() RETURNS trigger AS $$
BEGIN
  IF TG_TABLE_NAME = 'chat_messages' THEN
    IF NEW.team_id IS NOT NULL THEN
      PERFORM 1 FROM teams t WHERE t.id = NEW.team_id AND t.server_id = NEW.server_id;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'team % does not belong to server %', NEW.team_id, NEW.server_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_TABLE_NAME = 'user_team_memberships' THEN
    PERFORM 1 FROM teams t WHERE t.id = NEW.team_id AND t.server_id = NEW.server_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'user_team_memberships.server_id (%) must match team.server_id for team %',
        NEW.server_id, NEW.team_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chat_messages_consistency ON chat_messages;
CREATE TRIGGER trg_chat_messages_consistency
  BEFORE INSERT OR UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION enforce_team_server_consistency();

DROP TRIGGER IF EXISTS trg_user_team_memberships_consistency ON user_team_memberships;
CREATE TRIGGER trg_user_team_memberships_consistency
  BEFORE INSERT OR UPDATE ON user_team_memberships
  FOR EACH ROW EXECUTE FUNCTION enforce_team_server_consistency();
