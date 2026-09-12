import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './login'
import Sidebar from './components/sidebar'
import Header from './components/Header'
import LogoutModal from './components/LogoutModals'
import KontrakForm from './components/KontrakForm'
import Dashboard from './components/Dashboard'
import { getKontrak, createKontrak, updateKontrak, deleteKontrak } from './services/kontrakService'
import { uploadToSynologyLocal, deleteFromSynologyLocal } from './services/SynologyService'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('baphp_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [editId, setEditId] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openDropdownId, setOpenDropdownId] = useState(null)

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
    const handleClickOutside = () => setOpenDropdownId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    setLoading(true)
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('baphp_user')
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
    setLoading(true)
    try {
      let uploadedUrl = formData.url_pdf
      if (pdfFile) {
        const namaPekerjaan = (formData.nama_pekerjaan || 'Pekerjaan').replace(/[/\\?%*:|"<>]/g, '-')
        const newFileName = `BA_${namaPekerjaan}.pdf`
        const renamedPdfFile = new File([pdfFile], newFileName, { type: pdfFile.type })
        uploadedUrl = await uploadToSynologyLocal(renamedPdfFile)
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
        alert('Data kontrak berhasil diperbarui!')
      } else {
        await createKontrak(payload)
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

  const handleDelete = async (item) => {
    if (!item) return
    if (!window.confirm(`Yakin ingin menghapus ${item.nama_pekerjaan || 'data ini'}?`)) return

    setLoading(true)
    try {
      if (item.url_pdf) await deleteFromSynologyLocal(item.url_pdf)
      await deleteKontrak(item.id)
      alert('Data berhasil dihapus!')
      fetchData()
    } catch (error) {
      alert(`Gagal: ${error.message}`)
    } finally {
      setLoading(false)
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

    let matchesDate = true
    if (startDate || endDate) {
      const itemDate = item.tgl_kontrak ? new Date(item.tgl_kontrak) : null
      if (itemDate) {
        if (startDate && itemDate < new Date(startDate)) matchesDate = false
        if (endDate && itemDate > new Date(endDate + 'T23:59:59')) matchesDate = false
      } else {
        matchesDate = false
      }
    }
    return matchesSearch && matchesDate
  })

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('⚠️ Tidak ada data kontrak!')
      return
    }
    const excelData = filteredData.map((item, index) => ({
      'No': index + 1,
      'Nama Pekerjaan': item.nama_pekerjaan || '-',
      'Nilai Kontrak (Rp)': item.nilai_kontrak || 0,
      'No. Kontrak': item.no_kontrak || '-',
      'Tgl Kontrak': item.tgl_kontrak || '-',
      'Nama PPK': item.nama_ppk || '-',
      'Nama PPTK': item.nama_pptk || '-',
      'Nama Perusahaan': item.nama_perusahaan || '-',
      'Direktur': item.direktur || '-',
      'No. HP': item.no_hp || '-',
      'NPWP Perusahaan': item.npwp_perusahaan || '-',
      'No. Rekening': item.no_rek_perusahaan || '-',
      'Alamat Perusahaan': item.alamat_perusahaan || '-',
      'No. BAST': item.no_bast || '-',
      'Tgl BAST': item.tgl_bast || '-',
      'Keterangan': item.keterangan || '-'
    }))
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Kontrak')
    XLSX.writeFile(workbook, `Laporan_Kontrak_${startDate || 'Awal'}_s.d_${endDate || 'Akhir'}.xlsx`)
  }

  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert('⚠️ Tidak ada data kontrak!')
      return
    }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [215, 330] })
    doc.setFontSize(13)
    doc.text('LAPORAN DATA KONTRAK & PEKERJAAN LENGKAP', 10, 12)
    autoTable(doc, {
      startY: 20,
      margin: { left: 8, right: 8 },
      head: [['No', 'Nama Pekerjaan', 'No. BAST', 'Tgl BAST', 'Nilai Kontrak', 'Perusahaan', 'Direktur', 'PPK', 'PPTK', 'No. Kontrak', 'Tgl Kontrak', 'No. Rek', 'NPWP', 'Alamat', 'No. HP', 'Ket.']],
      body: filteredData.map((item, i) => [
        i + 1, item.nama_pekerjaan || '-', item.no_bast || '-', formatTanggal(item.tgl_bast), formatRupiah(item.nilai_kontrak),
        item.nama_perusahaan || '-', item.direktur || '-', item.nama_ppk || '-', item.nama_pptk || '-', item.no_kontrak || '-',
        formatTanggal(item.tgl_kontrak), item.no_rek_perusahaan || '-', item.npwp_perusahaan || '-', item.alamat_perusahaan || '-', item.no_hp || '-', item.keterangan || '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 7 }
    })
    doc.save(`Laporan_Kontrak_${startDate || 'Awal'}_s.d_${endDate || 'Akhir'}.pdf`)
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalNilaiKontrak = dataList.reduce((acc, curr) => acc + (Number(curr.nilai_kontrak) || 0), 0)

  const handleResetFilter = () => {
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  if (!user) {
    return (
      <Login onLoginSuccess={(userData) => {
        localStorage.setItem('baphp_user', JSON.stringify(userData))
        setUser(userData)
      }} />
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased relative">
      <Sidebar 
        user={user} 
        onLogoutClick={() => setShowLogoutModal(true)} 
        handleTambahBaru={handleTambahBaru} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onLogoutClick={() => setShowLogoutModal(true)} />

        <main className="p-6 lg:p-8 space-y-6">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                dataList={dataList}
                loading={loading}
                fetchData={fetchData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
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
                filteredData={filteredData}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                totalPages={totalPages}
                totalNilaiKontrak={totalNilaiKontrak}
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
          </Routes>
        </main>
      </div>

      <LogoutModal 
        show={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={confirmLogout} 
      />
    </div>
  )
}