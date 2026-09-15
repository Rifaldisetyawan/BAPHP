import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
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

  // Filter log berdasarkan nama pekerjaan (job_name), nama pengguna, atau aksi
  const filteredLogs = logs.filter(log => {
    const s = searchTerm.toLowerCase().trim()
    return (
      !s ||
      log.job_name?.toLowerCase().includes(s) ||
      log.user_name?.toLowerCase().includes(s) ||
      log.action?.toLowerCase().includes(s)
    )
  })

  // Kalkulasi pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Log Aktivitas</h1>
        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          🔄 {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Cari berdasarkan Nama Pekerjaan, Pengguna, atau Aksi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset ke halaman 1 saat melakukan pencarian
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TABEL LOG AKTIVITAS */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Aksi</th>
                <th className="py-3.5 px-4">Nama Pekerjaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400">
                    Tidak ada log aktivitas ditemukan.
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">
                      {log.created_at ? new Date(log.created_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{log.user_name || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        log.action === 'menambahkan' ? 'bg-emerald-50 text-emerald-700' :
                        log.action === 'mengedit' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{log.job_name || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-800">{filteredLogs.length > 0 ? indexOfFirstItem + 1 : 0}</span> sampai{' '}
            <span className="font-semibold text-slate-800">{Math.min(indexOfLastItem, filteredLogs.length)}</span> dari{' '}
            <span className="font-semibold text-slate-800">{filteredLogs.length}</span> data
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ◀ Prev
            </button>
            <span className="px-3 py-1.5 font-semibold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}