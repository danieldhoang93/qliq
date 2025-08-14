BEGIN;

-- 1) Drop channels (if present)
DROP TABLE IF EXISTS server_channels;

-- 2) user_team_memberships: allow many teams per user (unique on user_id, team_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_team_memberships_user_id_server_id_key'
  ) THEN
    ALTER TABLE user_team_memberships
      DROP CONSTRAINT user_team_memberships_user_id_server_id_key;
  END IF;
EXCEPTION WHEN undefined_object THEN
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'user_team_memberships'::regclass
      AND conname = 'user_team_memberships_user_id_team_id_key'
  ) THEN
    ALTER TABLE user_team_memberships
      ADD CONSTRAINT user_team_memberships_user_id_team_id_key UNIQUE (user_id, team_id);
  END IF;
END $$;

-- 3) chat_messages: require server_id, keep team_id nullable (server-wide vs team)
ALTER TABLE chat_messages
  ALTER COLUMN server_id SET NOT NULL;

-- 4) Replace broad chat indexes with fast partial DESC indexes
DROP INDEX IF EXISTS idx_chat_server_created;
DROP INDEX IF EXISTS idx_chat_team_created;

CREATE INDEX IF NOT EXISTS idx_chat_server_created_desc
  ON chat_messages (server_id, created_at DESC, id DESC)
  WHERE team_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_chat_team_created_desc
  ON chat_messages (team_id, created_at DESC, id DESC)
  WHERE team_id IS NOT NULL;

-- 5) Optional: integrity trigger — team must belong to the same server
CREATE OR REPLACE FUNCTION enforce_team_server_consistency() RETURNS trigger AS $$
BEGIN
  IF NEW.team_id IS NOT NULL THEN
    PERFORM 1 FROM teams t WHERE t.id = NEW.team_id AND t.server_id = NEW.server_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'team % does not belong to server %', NEW.team_id, NEW.server_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chat_messages_consistency ON chat_messages;
CREATE TRIGGER trg_chat_messages_consistency
  BEFORE INSERT OR UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION enforce_team_server_consistency();

COMMIT;
