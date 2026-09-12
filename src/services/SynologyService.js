const SYNO_USER = 'Aset'
const SYNO_PASS = 'dinasPU@3'
const DEST_PATH = '/Aset/BAPHP'

export const uploadToSynologyLocal = async (file) => {
  // 1. Auth Login via Proxy
  const authUrl = `/syno-api/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${encodeURIComponent(SYNO_USER)}&passwd=${encodeURIComponent(SYNO_PASS)}&session=FileStation&format=sid`
  
  const authRes = await fetch(authUrl)
  const authData = await authRes.json()

  if (!authData.success) {
    throw new Error(`Login Synology Gagal! Kode Error: ${authData.error?.code}`)
  }

  const sid = authData.data.sid

  // 2. Gunakan file.name secara langsung (nama file sudah diformat dari App.jsx)
  const fileName = file.name

  const formData = new FormData()
  formData.append('api', 'SYNO.FileStation.Upload')
  formData.append('version', '2')
  formData.append('method', 'upload')
  formData.append('path', DEST_PATH)
  formData.append('create_parents', 'true')
  formData.append('overwrite', 'true') // 👈 Tambahkan ini agar file lama tertimpa otomatis dan error 414 teratasi
  formData.append('file', file, fileName)
  formData.append('_sid', sid)

  const uploadRes = await fetch('/syno-api/webapi/entry.cgi', {
    method: 'POST',
    body: formData
  })

  const uploadData = await uploadRes.json()

  if (!uploadData.success) {
    throw new Error(`Upload Synology Gagal! Kode Error: ${uploadData.error?.code}`)
  }

  // 3. Kembalikan Direct Link Synology untuk disimpan ke Database Supabase
  const fullFilePath = `${DEST_PATH}/${fileName}`
  const downloadUrl = `https://10-40-9-2.datapu.direct.quickconnect.to:5001/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(fullFilePath)}&mode=open&_sid=${sid}`

  return downloadUrl
}

export const deleteFromSynologyLocal = async (pdfUrlOrPath) => {
  if (!pdfUrlOrPath) return

  let path = pdfUrlOrPath
  if (pdfUrlOrPath.startsWith('http')) {
    const url = new URL(pdfUrlOrPath)
    path = url.searchParams.get('path') || pdfUrlOrPath
  }

  const authUrl = `/syno-api/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${encodeURIComponent(SYNO_USER)}&passwd=${encodeURIComponent(SYNO_PASS)}&session=FileStation&format=sid`
  
  const authRes = await fetch(authUrl)
  const authData = await authRes.json()

  if (!authData.success) {
    throw new Error(`Login Synology Gagal! Kode Error: ${authData.error?.code}`)
  }

  const sid = authData.data.sid

  const deleteUrl = `/syno-api/webapi/entry.cgi?api=SYNO.FileStation.Delete&version=2&method=delete&path=${encodeURIComponent(JSON.stringify([path]))}&_sid=${sid}`

  const deleteRes = await fetch(deleteUrl)
  const deleteData = await deleteRes.json()

  if (!deleteData.success) {
    throw new Error(`Gagal menghapus file di Synology! Kode Error: ${deleteData.error?.code}`)
  }

  return true
}