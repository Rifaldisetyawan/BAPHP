import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Gagal memuat log:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  // Logika Pagination (Maksimal 10 item per halaman)
  const totalPages = Math.ceil(logs.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem)

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Log Aktivitas Pengguna</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Aktivitas</th>
                <th className="py-3 px-4">Nama Pekerjaan</th>
                <th className="py-3 px-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">Memuat data...</td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">Belum ada aktivitas tercatat.</td>
                </tr>
              ) : (
                currentLogs.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{indexOfFirstItem + index + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.user_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        log.action === 'menambahkan' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'mengedit' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{log.job_name || '-'}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kontrol Navigasi Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200">
          <span className="text-sm text-slate-500">
            Menampilkan {currentLogs.length > 0 ? indexOfFirstItem + 1 : 0} - {indexOfFirstItem + currentLogs.length} dari {logs.length} data
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <span className="text-sm font-medium text-slate-700 px-2">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}