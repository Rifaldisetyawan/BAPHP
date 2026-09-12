const BASE_URL = 'http://10.40.9.2:8085/api.php'

export const uploadToSynologyLocal = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const uploadRes = await fetch(BASE_URL, {
    method: 'POST',
    body: formData
  })

  const uploadData = await uploadRes.json()

  if (!uploadData.success) {
    throw new Error(`Upload Synology Gagal!`)
  }

  // Mengembalikan URL langsung dari hasil penyimpanan PHP
  return uploadData.data.url
}

export const deleteFromSynologyLocal = async (pdfUrlOrPath) => {
  if (!pdfUrlOrPath) return true
  // Karena file dikelola langsung via PHP, proses hapus dapat ditangani atau diabaikan jika menggunakan timestamp unik
  return true
}