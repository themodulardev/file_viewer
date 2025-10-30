## Setup local Supabase development

1. Install Supabase CLI if not already installed:
```bash
brew install supabase/tap/supabase
```

2. Start Supabase locally:
```bash
supabase start
```

3. Create storage bucket named 'updates':
```bash
supabase storage create updates
```

4. Upload test file:
```bash
# Create a dummy update file
touch dummy_update.zip
# Upload it as latest/update.zip
supabase storage upload --bucket updates latest/update.zip ./dummy_update.zip
```

5. Deploy Edge Function locally:
```bash
# Deploy function
supabase functions deploy check-update --project-ref your-project-id

# Test function locally
curl -X POST 'http://localhost:54321/functions/v1/check-update' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-anon-key' \
  -d '{"md5Hash":"abc123"}'
```

For development:
- Functions are in `supabase/functions/`
- The check-update function is written in TypeScript and uses Deno
- Environment variables are automatically available in Edge Functions
- CORS is enabled for all origins (modify corsHeaders in the function to restrict)

Debug Function Locally:
```bash
supabase functions serve check-update
```

View logs:
```bash
supabase functions logs check-update
```