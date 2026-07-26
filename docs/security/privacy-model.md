# Privacy and security model

## Sensitive data

Serial numbers, receipt contents, private documents, precise storage information, and private notes are never public-build fields. Serial numbers are optional and default to not stored.

## Storage modes

- Not stored: no value exists.
- Device only: encrypted client-side and never submitted to Supabase.
- Cloud encrypted: client/application encryption produces ciphertext and nonce; the database stores no plaintext.

The database stores ciphertext, nonce, and key version only. Encryption keys must not be stored beside the ciphertext or written to analytics and logs.

## RLS

Build, snapshot, Armory, and sensitive-field rows are owner-scoped with Row Level Security. Public snapshots have a separate read policy and a separate schema.

## Publication

Publication is allowlist-based. The server constructs a sanitized projection from build tables and never clones or redacts an Armory row.

## Logging restrictions

Audit metadata must be explicitly safe. Never log serial numbers, receipt bodies, private notes, document URLs, encryption keys, or decrypted values.

## Threats addressed in the foundation

- cross-account row access;
- accidental public exposure through shared tables;
- silent historical mutation;
- client-forged admin authority;
- sensitive data leakage through logs;
- overconfident compatibility caused by incomplete data.
