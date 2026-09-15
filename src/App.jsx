import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LogoutModal from './components/LogoutModals'
import InactivityModal from './components/InactivityModal'
import KontrakForm from './components/KontrakForm'
import Dashboard from './components/Dashboard'
import { getKontrak, createKontrak, updateKontrak, deleteKontrak } from './services/KontrakService'
import { uploadToSynologyLocal, deleteFromSynologyLocal } from './services/SynologyService'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import UserManagement from './components/UserManagement'
import ActivityLog from './components/ActivityLog'
import ChangePassword from './components/ChangePassword'

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('baphp_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [editId, setEditId] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showInactivityModal, setShowInactivityModal] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const [startKontrak, setStartKontrak] = useState('')
  const [endKontrak, setEndKontrak] = useState('')
  const [startBast, setStartBast] = useState('')
  const [endBast, setEndBast] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  // State untuk pengurutan No BAST (default desc agar tahun terbaru di atas)
  const [sortDirection, setSortDirection] = useState('desc')

  const navigate = useNavigate()

  const initialFormState = {
    nama_pekerjaan: '', no_bast: '', tgl_bast: '', nilai_kontrak: '',
    nama_perusahaan: '', direktur: '', nama_ppk: '', nama_pptk: '',
    no_kontrak: '', tgl_kontrak: '', no_rek_perusahaan: '',
    npwp_perusahaan: '', alamat_perusahaan: '', no_hp: '', keterangan: '', url_pdf: ''
  }

  const [formData, setFormData] = useState(initialFormState)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getKontrak()
      setDataList(data || [])
    } catch (error) {
      alert('Gagal mengambil data!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  useEffect(() => {
    if (!user) return

    let inactivityTimer

    const resetTimers = () => {
      if (showInactivityModal) return
      clearTimeout(inactivityTimer)
      setCountdown(60)

      inactivityTimer = setTimeout(() => {
        setShowInactivityModal(true)
      }, 10 * 60 * 1000)
    }

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']
    const handleActivity = () => resetTimers()

    events.forEach(event => window.addEventListener(event, handleActivity))
    resetTimers()

    return () => {
      clearTimeout(inactivityTimer)
      events.forEach(event => window.removeEventListener(event, handleActivity))
    }
  }, [user, showInactivityModal])

  useEffect(() => {
    if (!showInactivityModal) return

    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          confirmLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showInactivityModal])

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    setShowInactivityModal(false)
    setLoading(true)
    try {
      await supabase.auth.signOut()
      sessionStorage.removeItem('baphp_user')
      setUser(null)
      navigate('/')
    } catch (error) {
      alert(`Gagal logout: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTambahBaru = () => {
    setEditId(null)
    setFormData(initialFormState)
  }

  const handleEdit = (item) => {
    setEditId(item.id)
    setFormData({
      nama_pekerjaan: item.nama_pekerjaan || '',
      no_bast: item.no_bast || '',
      tgl_bast: item.tgl_bast || '',
      nilai_kontrak: item.nilai_kontrak || '',
      nama_perusahaan: item.nama_perusahaan || '',
      direktur: item.direktur || '',
      nama_ppk: item.nama_ppk || '',
      nama_pptk: item.nama_pptk || '',
      no_kontrak: item.no_kontrak || '',
      tgl_kontrak: item.tgl_kontrak || '',
      no_rek_perusahaan: item.no_rek_perusahaan || '',
      npwp_perusahaan: item.npwp_perusahaan || '',
      alamat_perusahaan: item.alamat_perusahaan || '',
      no_hp: item.no_hp || '',
      keterangan: item.keterangan || '',
      url_pdf: item.url_pdf || ''
    })
    navigate('/tambah')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi: File PDF wajib diunggah, baik saat menambah maupun mengedit data
    if (!pdfFile) {
      alert('⚠️ File PDF wajib diunggah!')
      return
    }

    setLoading(true)
    try {
      let uploadedUrl = formData.url_pdf

      if (pdfFile) {
        const namaPekerjaan = (formData.nama_pekerjaan || 'Pekerjaan').replace(/[/\\?%*:|"<>]/g, '-')
        const newFileName = `BA_${namaPekerjaan}.pdf`
        const renamedPdfFile = new File([pdfFile], newFileName, { type: pdfFile.type })

        uploadedUrl = await uploadToSynologyLocal(renamedPdfFile, formData.nama_pekerjaan, formData.url_pdf)
      }

      const payload = {
        ...formData,
        nilai_kontrak: formData.nilai_kontrak ? Number(formData.nilai_kontrak) : 0,
        tgl_kontrak: formData.tgl_kontrak || null,
        tgl_bast: formData.tgl_bast || null,
        url_pdf: uploadedUrl || null
      }

      if (editId) {
        await updateKontrak(editId, payload)

        await supabase.from('activity_logs').insert([
          {
            user_name: user?.nama_lengkap || user?.username,
            action: 'mengedit',
            job_name: formData.nama_pekerjaan
          }
        ])

        alert('Data kontrak berhasil diperbarui!')
      } else {
        await createKontrak(payload)

        await supabase.from('activity_logs').insert([
          {
            user_name: user?.nama_lengkap || user?.username,
            action: 'menambahkan',
            job_name: formData.nama_pekerjaan
          }
        ])

        alert('Data kontrak berhasil disimpan!')
      }

      setFormData(initialFormState)
      setEditId(null)
      setPdfFile(null)
      fetchData()
      navigate('/')
    } catch (error) {
      alert(`Gagal: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, urlPdf, namaPekerjaan) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    try {
      if (urlPdf) {
        await deleteFromSynologyLocal(urlPdf)
      }

      await deleteKontrak(id)

      await supabase.from('activity_logs').insert([
        {
          user_name: user?.nama_lengkap || user?.username,
          action: 'menghapus',
          job_name: namaPekerjaan
        }
      ])

      alert('Data dan file berhasil dihapus!')
      fetchData()
    } catch (error) {
      console.error('Gagal menghapus:', error.message)
      alert(`Gagal menghapus: ${error.message}`)
    }
  }

  const formatTanggal = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
  }

  const formatRupiah = (val) => {
    if (!val) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
  }

  const filteredData = dataList.filter(item => {
    const s = searchTerm.toLowerCase().trim()
    const matchesSearch = !s ||
      item.nama_perusahaan?.toLowerCase().includes(s) ||
      item.nama_pptk?.toLowerCase().includes(s) ||
      item.nama_ppk?.toLowerCase().includes(s) ||
      item.nama_pekerjaan?.toLowerCase().includes(s) ||
      item.direktur?.toLowerCase().includes(s) ||
      item.no_kontrak?.toLowerCase().includes(s) ||
      item.no_bast?.toLowerCase().includes(s)

    const tglKontrakStr = item.tgl_kontrak ? item.tgl_kontrak.substring(0, 10) : ''
    const tglBastStr = item.tgl_bast ? item.tgl_bast.substring(0, 10) : ''

    let matchesKontrakDate = true
    if (startKontrak || endKontrak) {
      if (!tglKontrakStr) {
        matchesKontrakDate = false
      } else {
        if (startKontrak && tglKontrakStr < startKontrak) matchesKontrakDate = false
        if (endKontrak && tglKontrakStr > endKontrak) matchesKontrakDate = false
      }
    }

    let matchesBastDate = true
    if (startBast || endBast) {
      if (!tglBastStr) {
        matchesBastDate = false
      } else {
        if (startBast && tglBastStr < startBast) matchesBastDate = false
        if (endBast && tglBastStr > endBast) matchesBastDate = false
      }
    }

    return matchesSearch && matchesKontrakDate && matchesBastDate
  })

  const handleSortToggle = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const extractBastInfo = (noBast) => {
    if (!noBast) return { num: 0, year: 0 }
    const numMatch = noBast.match(/^\d+/)
    const yearMatch = noBast.match(/\b(20\d{2})\b/) || noBast.match(/(\d{4})$/)
    return {
      num: numMatch ? parseInt(numMatch[0], 10) : 0,
      year: yearMatch ? parseInt(yearMatch[1] || yearMatch[0], 10) : 0
    }
  }

  const sortedFilteredData = [...filteredData].sort((a, b) => {
    const infoA = extractBastInfo(a.no_bast)
    const infoB = extractBastInfo(b.no_bast)

    if (infoA.year !== infoB.year) {
      return sortDirection === 'asc'
        ? infoA.year - infoB.year
        : infoB.year - infoA.year
    }

    return sortDirection === 'asc'
      ? infoA.num - infoB.num
      : infoB.num - infoA.num
  })

  const handleExportExcel = () => {
    if (sortedFilteredData.length === 0) {
      alert('⚠️ Tidak ada data kontrak!')
      return
    }

    const excelData = sortedFilteredData.map((item, index) => ({
      'No': index + 1,
      'Nama Pekerjaan': item.nama_pekerjaan || '-',
      'BAST (No / Tgl)': `${item.no_bast || '-'}\n${formatTanggal(item.tgl_bast)}`,
      'Nilai Kontrak': formatRupiah(item.nilai_kontrak),
      'Perusahaan': item.nama_perusahaan || '-',
      'Direktur': item.direktur || '-',
      'Nama PPK': item.nama_ppk || '-',
      'Nama PPTK': item.nama_pptk || '-',
      'Kontrak (No / Tgl)': `${item.no_kontrak || '-'}\n${formatTanggal(item.tgl_kontrak)}`,
      'No. Rekening Perusahaan': item.no_rek_perusahaan || '-',
      'NPWP & Alamat': `${item.npwp_perusahaan || '-'}\n${item.alamat_perusahaan || '-'}`,
      'No. HP': item.no_hp || '-',
      'Keterangan': item.keterangan || '-'
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)

    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        if (!worksheet[cellAddress]) continue

        if (!worksheet[cellAddress].s) {
          worksheet[cellAddress].s = {}
        }
        if (C === 2 || C === 8 || C === 10 || C === 1) {
          worksheet[cellAddress].s.alignment = { wrapText: true, vertical: 'center' }
        }
      }
    }

    const colWidths = Object.keys(excelData[0]).map(key => {
      let maxLen = key.length
      excelData.forEach(row => {
        const val = String(row[key] || '')
        const lines = val.split('\n')
        lines.forEach(line => {
          if (line.length > maxLen) {
            maxLen = line.length
          }
        })
      })
      return { wch: Math.max(maxLen + 4, 12) }
    })

    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Kontrak')
    XLSX.writeFile(workbook, `Laporan_Kontrak.xlsx`)
  }

  const handleExportPDF = () => {
    if (sortedFilteredData.length === 0) {
      alert('⚠️ Tidak ada data kontrak!')
      return
    }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [215, 330] })
    doc.setFontSize(13)
    doc.text('LAPORAN DATA KONTRAK & PEKERJAAN', 10, 12)
    autoTable(doc, {
      startY: 20,
      margin: { left: 8, right: 8 },
      head: [[
        'No', 'Nama Pekerjaan', 'BAST (No / Tgl)', 'Nilai Kontrak', 'Perusahaan',
        'Direktur', 'Nama PPK', 'Nama PPTK', 'Kontrak (No / Tgl)', 'No. Rekening', 'NPWP & Alamat', 'No. HP', 'Keterangan'
      ]],
      body: sortedFilteredData.map((item, i) => [
        i + 1,
        item.nama_pekerjaan || '-',
        `${item.no_bast || '-'}\n${formatTanggal(item.tgl_bast)}`,
        formatRupiah(item.nilai_kontrak),
        item.nama_perusahaan || '-',
        item.direktur || '-',
        item.nama_ppk || '-',
        item.nama_pptk || '-',
        `${item.no_kontrak || '-'}\n${formatTanggal(item.tgl_kontrak)}`,
        item.no_rek_perusahaan || '-',
        `${item.npwp_perusahaan || '-'}\n${item.alamat_perusahaan || '-'}`,
        item.no_hp || '-',
        item.keterangan || '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 7 },
      bodyStyles: { fontSize: 6.5 }
    })
    doc.save(`Laporan_Kontrak.pdf`)
  }

  const totalPages = Math.ceil(sortedFilteredData.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedFilteredData.slice(indexOfFirstItem, indexOfLastItem)

  const totalKontrak = sortedFilteredData.length
  const totalNilaiKontrak = sortedFilteredData.reduce((acc, curr) => acc + (Number(curr.nilai_kontrak) || 0), 0)
  const totalMitraPerusahaan = new Set(sortedFilteredData.map(item => item.nama_perusahaan).filter(Boolean)).size

  const handleResetFilter = () => {
    setSearchTerm('')
    setStartKontrak('')
    setEndKontrak('')
    setStartBast('')
    setEndBast('')
    setCurrentPage(1)
  }

  if (!user) {
    return (
      <Login onLoginSuccess={(userData) => {
        sessionStorage.setItem('baphp_user', JSON.stringify(userData))
        setUser(userData)
      }} />
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans antialiased relative">
      <Sidebar
        user={user}
        onLogoutClick={() => setShowLogoutModal(true)}
        handleTambahBaru={handleTambahBaru}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header onLogoutClick={() => setShowLogoutModal(true)} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-20 space-y-6">
          <Routes>
            <Route path="/" element={
              <Dashboard
                dataList={dataList}
                loading={loading}
                fetchData={fetchData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                startKontrak={startKontrak}
                setStartKontrak={setStartKontrak}
                endKontrak={endKontrak}
                setEndKontrak={setEndKontrak}
                startBast={startBast}
                setStartBast={setStartBast}
                endBast={endBast}
                setEndBast={setEndBast}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                handleTambahBaru={handleTambahBaru}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleExportExcel={handleExportExcel}
                handleExportPDF={handleExportPDF}
                handleResetFilter={handleResetFilter}
                formatTanggal={formatTanggal}
                formatRupiah={formatRupiah}
                currentItems={currentItems}
                filteredData={sortedFilteredData}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                totalPages={totalPages}
                totalKontrak={totalKontrak}
                totalNilaiKontrak={totalNilaiKontrak}
                totalMitraPerusahaan={totalMitraPerusahaan}
                sortDirection={sortDirection}
                handleSortToggle={handleSortToggle}
              />
            } />
            <Route path="/tambah" element={
              <KontrakForm
                editId={editId}
                formData={formData}
                handleChange={handleChange}
                setPdfFile={setPdfFile}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            } />
            <Route
              path="/users"
              element={user?.role === 'admin' ? <UserManagement /> : <Dashboard />}
            />
            <Route path="/logs" element={<ActivityLog />} />
            <Route path="/ubah-password" element={<ChangePassword user={user} />} />
          </Routes>
        </main>
      </div>

      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

      <InactivityModal
        show={showInactivityModal}
        countdown={countdown}
        onClose={() => setShowInactivityModal(false)}
        onConfirm={confirmLogout}
      />
    </div>
  )
}