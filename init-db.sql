CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY,
  app_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN DEFAULT false,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_api_key_api_key ON api_keys(api_key);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  app_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  url TEXT,
  referrer TEXT,
  device TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_app_id ON events(app_id);
