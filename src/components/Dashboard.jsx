import { Link } from 'react-router-dom'

export default function Dashboard({
  dataList,
  loading,
  fetchData,
  searchTerm,
  setSearchTerm,
  startKontrak,
  setStartKontrak,
  endKontrak,
  setEndKontrak,
  startBast,
  setStartBast,
  endBast,
  setEndBast,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  openDropdownId,
  setOpenDropdownId,
  handleTambahBaru,
  handleEdit,
  handleDelete,
  handleExportExcel,
  handleExportPDF,
  handleResetFilter,
  formatTanggal,
  formatRupiah,
  currentItems,
  filteredData,
  indexOfFirstItem,
  indexOfLastItem,
  totalPages,
  totalKontrak,
  totalNilaiKontrak,
  totalMitraPerusahaan
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Kontrak</h1>
        <Link to="/tambah" onClick={handleTambahBaru} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all">
          + Tambah Kontrak
        </Link>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500">Total Kontrak</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalKontrak}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500">Total Nilai</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatRupiah(totalNilaiKontrak)}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500">Mitra Perusahaan</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalMitraPerusahaan}
          </p>
        </div>
      </div>

      {/* TABLE CARD CONTAINER */}
      <section className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900">Daftar Kontrak & Pekerjaan</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                🔄 {loading ? 'Memuat...' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                📊 Excel
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                📄 PDF
              </button>
              {(startKontrak || endKontrak || startBast || endBast || searchTerm) && (
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-all border border-indigo-200"
                >
                  ✕ Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari berdasarkan Nama Perusahaan, Nama PPTK, Nama PPK, Nama Pekerjaan, No. Kontrak, dll..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* DUAL DATE FILTERS & ENTRIES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1 text-xs items-center">
            {/* Filter Tanggal Kontrak */}
            <div className="lg:col-span-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 whitespace-nowrap">Tgl Kontrak:</span>
                <input
                  type="date"
                  value={startKontrak}
                  onChange={(e) => { setStartKontrak(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-400">s/d</span>
                <input
                  type="date"
                  value={endKontrak}
                  onChange={(e) => { setEndKontrak(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Filter Tanggal BAST */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 whitespace-nowrap">Tgl BAST:</span>
                <input
                  type="date"
                  value={startBast}
                  onChange={(e) => { setStartBast(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-400">s/d</span>
                <input
                  type="date"
                  value={endBast}
                  onChange={(e) => { setEndBast(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Entries Dropdown */}
            <div className="lg:col-span-4 flex items-center justify-end gap-2">
              <span className="text-slate-500 font-medium">Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-500">entri</span>
            </div>
          </div>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Nama Pekerjaan</th>
                <th className="py-3.5 px-4">BAST (No / Tgl)</th>
                <th className="py-3.5 px-4">Nilai Kontrak</th>
                <th className="py-3.5 px-4">Perusahaan</th>
                <th className="py-3.5 px-4">Direktur</th>
                <th className="py-3.5 px-4">Nama PPK</th>
                <th className="py-3.5 px-4">Nama PPTK</th>
                <th className="py-3.5 px-4">Kontrak (No / Tgl)</th>
                <th className="py-3.5 px-4">No. Rekening Perusahaan</th>
                <th className="py-3.5 px-4">NPWP & Alamat</th>
                <th className="py-3.5 px-4">No. HP</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4">PDF</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="15" className="text-center py-12 text-slate-400">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{indexOfFirstItem + idx + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{item.nama_pekerjaan}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.no_bast || '-'}</div>
                      <div className="text-[11px] text-slate-400">{formatTanggal(item.tgl_bast)}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">{formatRupiah(item.nilai_kontrak)}</td>
                    <td className="py-3.5 px-4 font-medium text-indigo-900">{item.nama_perusahaan || '-'}</td>
                    <td className="py-3.5 px-4">{item.direktur || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-800">{item.nama_ppk || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-800">{item.nama_pptk || '-'}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.no_kontrak || '-'}</div>
                      <div className="text-[11px] text-slate-400">{formatTanggal(item.tgl_kontrak)}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{item.no_rek_perusahaan || '-'}</td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-mono text-slate-700">{item.npwp_perusahaan || '-'}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.alamat_perusahaan || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.no_hp || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{item.keterangan || '-'}</td>
                    <td className="py-3.5 px-4">
                      {item.url_pdf ? (
                        <a href={item.url_pdf} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold">
                          📄 Lihat PDF
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                        }}
                        className="w-7 h-7 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-600 font-bold text-base transition-all mx-auto"
                      >
                        ⋮
                      </button>

                      {openDropdownId === item.id && (
                        <div className="absolute right-4 top-10 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-left">
                          <button
                            onClick={() => handleEdit(item)}
                            className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-slate-50 flex items-center gap-2 font-medium"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-800">{filteredData.length > 0 ? indexOfFirstItem + 1 : 0}</span> sampai{' '}
            <span className="font-semibold text-slate-800">{Math.min(indexOfLastItem, filteredData.length)}</span> dari{' '}
            <span className="font-semibold text-slate-800">{filteredData.length}</span> data
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
      </section>
    </div>
  )
}