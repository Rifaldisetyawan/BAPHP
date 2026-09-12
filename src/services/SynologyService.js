const BASE_URL = 'https://baphp.dinaspu.com/'

export const uploadToSynologyLocal = async (file, jobName = '') => {
  const formData = new FormData()
  formData.append('file', file)
  if (jobName) {
    formData.append('custom_name', jobName)
  }

  const uploadRes = await fetch(BASE_URL, {
    method: 'POST',
    body: formData
  })

  const uploadData = await uploadRes.json()

  if (!uploadData.success) {
    throw new Error(`Upload Synology Gagal!`)
  }

  return uploadData.data.url
}

export const deleteFromSynologyLocal = async (pdfUrlOrPath) => {
  if (!pdfUrlOrPath) return true

  let filePath = pdfUrlOrPath
  if (pdfUrlOrPath.startsWith('http')) {
    const fileName = pdfUrlOrPath.split('/').pop()
    filePath = `/volume1/Aset/BAPHP/${fileName}`
  }

  try {
    await fetch(`${BASE_URL}?action=delete&path=${encodeURIComponent(filePath)}`, {
      method: 'DELETE'
    })
  } catch (err) {
    console.error("Gagal menghapus file lama:", err)
  }

  return true
}