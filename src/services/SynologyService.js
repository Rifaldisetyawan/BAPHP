export const BASE_URL = 'http://10.40.9.2:8085/api.php'

export const uploadToSynologyLocal = async (file, jobName = '', oldUrl = '') => {
  const formData = new FormData()
  formData.append('file', file)
  if (jobName) {
    formData.append('custom_name', jobName)
  }
  if (oldUrl) {
    formData.append('old_url', oldUrl)
  }

  try {
    const uploadRes = await fetch(BASE_URL, {
      method: 'POST',
      body: formData
    })

    const uploadData = await uploadRes.json()

    if (!uploadData.success) {
      throw new Error(uploadData.error || `Upload Synology Gagal!`)
    }

    return uploadData.data.url
  } catch (err) {
    console.error("Error saat upload ke NAS:", err)
    throw err
  }
}

export const deleteFromSynologyLocal = async (pdfUrlOrPath) => {
  if (!pdfUrlOrPath) return true

  let fileName = ""
  if (typeof pdfUrlOrPath === 'object' && pdfUrlOrPath !== null) {
    fileName = pdfUrlOrPath.url_pdf || pdfUrlOrPath.url || pdfUrlOrPath.file || pdfUrlOrPath.path || ''
  } else if (typeof pdfUrlOrPath === 'string') {
    fileName = pdfUrlOrPath
  }

  if (!fileName || fileName === 'undefined' || fileName === 'null') return true

  if (fileName.startsWith('http')) {
    fileName = fileName.split('/').pop()
  }

  try {
    const response = await fetch(`${BASE_URL}?action=delete&filename=${encodeURIComponent(fileName)}`)
    const result = await response.json()
    console.log("Respon Hapus NAS:", result)

    if (!result.success) {
      console.warn("Gagal menghapus file fisik di NAS:", result.error);
    } else {
      console.log("File fisik berhasil dihapus dari NAS");
    }
  } catch (err) {
    console.error("Gagal koneksi ke NAS:", err)
  }

  return true
}