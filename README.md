# Omkar Fileviewer

A Supabase Edge Function that checks for file updates by MD5 hash and returns signed download URLs.

## Setup

1. Install the Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Start Supabase locally:
```bash
supabase start
```

3. Set up the storage bucket:
```bash
# Create the updates bucket
curl -X POST \
  'http://localhost:54321/storage/v1/bucket' \
  -H "Authorization: Bearer $(supabase status -o json | jq -r '.api.serviceRoleKey')" \
  -H 'Content-Type: application/json' \
  -d '{"name":"updates","public":false}'

# Upload test update file
echo "test" > dummy_update.zip
curl -X POST \
  'http://localhost:54321/storage/v1/object/updates/latest/update.zip' \
  -H "Authorization: Bearer $(supabase status -o json | jq -r '.api.serviceRoleKey')" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @dummy_update.zip
```

## Development

The project uses a Supabase Edge Function (in `supabase/functions/check-update/`) to:
1. Check if a file with a given MD5 hash exists in storage
2. If not found, return a signed URL to download the latest update

To run locally:
```bash
npm start
# or
supabase functions serve check-update
```

Test the function:
```bash
# Test with a non-existent hash (should return signed URL to latest/update.zip)
curl -X POST \
  'http://localhost:54321/functions/v1/check-update' \
  -H "Authorization: Bearer $(supabase status -o json | jq -r '.api.serviceRoleKey')" \
  -H 'Content-Type: application/json' \
  -d '{"md5Hash":"abc123"}'
```

## Deploy

```bash
npm run deploy
# or
supabase functions deploy check-update
```

## Structure

```
supabase/
  ├── functions/
  │   └── check-update/    # Edge Function implementation
  │       └── index.ts
  ├── config.json          # Project configuration
  └── README.md           # Additional Supabase-specific docs
```
