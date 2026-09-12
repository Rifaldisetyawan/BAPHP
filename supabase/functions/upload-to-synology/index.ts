const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(JSON.stringify({ error: 'File PDF wajib diunggah' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const baseUrl = Deno.env.get('SYNOLOGY_BASE_URL')
    const username = Deno.env.get('SYNOLOGY_USER')
    const password = Deno.env.get('SYNOLOGY_PASSWORD')
    const destPath = Deno.env.get('SYNOLOGY_DEST_PATH') || '/volume1/Arsip/kontrak_pdf'

    if (!baseUrl || !username || !password) {
      throw new Error('Kredensial Synology di Supabase Secrets belum lengkap!')
    }

    // 1. Auth Login
    const authUrl = `${baseUrl}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${encodeURIComponent(username)}&passwd=${encodeURIComponent(password)}&session=FileStation&format=sid`
    const authRes = await fetch(authUrl)
    const authData = await authRes.json()

    if (!authData.success) {
      throw new Error(`Login Synology Gagal! Code: ${authData.error?.code}`)
    }

    const sid = authData.data.sid

    // 2. Upload File
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

    const synoFormData = new FormData()
    synoFormData.append('api', 'SYNO.FileStation.Upload')
    synoFormData.append('version', '2')
    synoFormData.append('method', 'upload')
    synoFormData.append('path', destPath)
    synoFormData.append('create_parents', 'true')
    synoFormData.append('file', file, fileName)
    synoFormData.append('_sid', sid)

    const uploadRes = await fetch(`${baseUrl}/webapi/entry.cgi`, {
      method: 'POST',
      body: synoFormData,
    })

    const uploadData = await uploadRes.json()

    if (!uploadData.success) {
      throw new Error(`Upload Synology Gagal! Code: ${uploadData.error?.code}`)
    }

    const fullFilePath = `${destPath}/${fileName}`
    const downloadUrl = `${baseUrl}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(fullFilePath)}&mode=open&_sid=${sid}`

    return new Response(JSON.stringify({ url_pdf: downloadUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Edge Function Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})