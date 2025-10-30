// Disable TS checking here because this file runs on Deno in the edge runtime
// and the local TypeScript server doesn't have Deno/Supabase remote types.
// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
declare const Deno: any

// CORS headers for the Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  md5Hash: string
}

// Handle OPTIONS preflight request
const handleOptions = () => {
  return new Response(null, {
    headers: corsHeaders,
    status: 204, // No content needed for OPTIONS
  })
}

// Handle the actual request
const handleRequest = async (req: Request) => {
  try {
    const body: RequestBody = await req.json()
    const { md5Hash } = body
    if (!md5Hash) {
      return new Response(
        JSON.stringify({ error: 'md5Hash is required in request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Dynamically import the Supabase client at runtime so the local TS
    // resolver doesn't attempt to fetch remote types during static analysis.
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.31.0')
    // Initialize Supabase client using runtime env vars (provided by the edge runtime)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const bucket = 'updates'
    const objectKey = `${md5Hash}.zip`

    // Check if object exists by listing (could be optimized with a metadata table)
    const { data: listData, error: listError } = await supabaseClient
      .storage
      .from(bucket)
      .list('', { limit: 1000 })
    
    if (listError) {
      console.error('Storage list error:', listError)
      return new Response(
        JSON.stringify({ error: 'Storage list error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const exists = Array.isArray(listData) && listData.some(item => item.name === objectKey)

    if (exists) {
      return new Response(
        JSON.stringify({ message: 'File already up-to-date' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If not found, return signed URL for latest/update.zip
    const updateFileKey = 'latest/update.zip'
    const expiresIn = 300 // 5 minutes
    const { data: signedData, error: signedError } = await supabaseClient
      .storage
      .from(bucket)
      .createSignedUrl(updateFileKey, expiresIn)

    if (signedError || !signedData?.signedUrl) {
      console.error('Create signed URL error:', signedError)
      return new Response(
        JSON.stringify({ error: 'Could not create signed URL' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Update available',
        downloadUrl: signedData.signedUrl
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Use Deno's serve() handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  return handleRequest(req)
})