USE store_rating_db;

INSERT INTO users (name, email, password_hash, role, address)
VALUES (
  'System Admin',
  'admin@example.com',
  '$2b$12$o0gtpYBI.k01STCCivw2JeDtCVknsozSi4dUxvzuHidqIADGHuVeu',
  'admin',
  NULL
)
ON DUPLICATE KEY UPDATE id = id;
