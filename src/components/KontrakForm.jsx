import { Link } from 'react-router-dom'

export default function KontrakForm({
  editId,
  formData,
  handleChange,
  setPdfFile,
  handleSubmit,
  loading
}) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {editId ? 'Edit Data Kontrak' : 'Input Data Kontrak & BAST Baru'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {editId ? 'Ubah rincian formulir di bawah ini lalu simpan perubahan.' : 'Lengkapi formulir di bawah ini untuk menambahkan arsip pekerjaan baru.'}
          </p>
        </div>
        <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 font-medium px-3 py-1.5 rounded-lg border border-slate-200">
          ✕ Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">1. Informasi Pekerjaan & Kontrak</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pekerjaan *</label>
              <input required type="text" name="nama_pekerjaan" value={formData.nama_pekerjaan} onChange={handleChange} placeholder="Contoh: Pengadaan Perangkat IT" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nilai Kontrak (Rp)</label>
              <input type="number" name="nilai_kontrak" value={formData.nilai_kontrak} onChange={handleChange} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">No. Kontrak</label>
              <input type="text" name="no_kontrak" value={formData.no_kontrak} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tgl. Kontrak</label>
              <input type="date" name="tgl_kontrak" value={formData.tgl_kontrak} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama PPK</label>
              <input type="text" name="nama_ppk" value={formData.nama_ppk} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama PPTK</label>
              <input type="text" name="nama_pptk" value={formData.nama_pptk} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">2. Informasi Perusahaan Pelaksana</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Perusahaan</label>
              <input type="text" name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Direktur / Penanggung Jawab</label>
              <input type="text" name="direktur" value={formData.direktur} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">No. HP / Kontak</label>
              <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">NPWP Perusahaan</label>
              <input type="text" name="npwp_perusahaan" value={formData.npwp_perusahaan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">No. Rekening Perusahaan</label>
              <input type="text" name="no_rek_perusahaan" value={formData.no_rek_perusahaan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Perusahaan</label>
              <input type="text" name="alamat_perusahaan" value={formData.alamat_perusahaan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider">3. Serah Terima & Dokumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">No. BAST</label>
              <input type="text" name="no_bast" value={formData.no_bast} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tgl. BAST</label>
              <input type="date" name="tgl_bast" value={formData.tgl_bast} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Upload File (PDF) {!editId && <span className="text-red-500">*</span>}
              </label>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setPdfFile(e.target.files[0])} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 cursor-pointer" 
                required={!editId} 
              />
              {editId && (
                <p className="text-[10px] text-slate-400 mt-1">
                  *Kosongkan jika tidak ingin mengubah file PDF yang sudah ada.
                </p>
              )}
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Keterangan</label>
              <input type="text" name="keterangan" value={formData.keterangan} onChange={handleChange} placeholder="Catatan tambahan..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Link to="/" className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Batal
          </Link>
          <button disabled={loading} type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50">
            {loading ? 'Menyimpan...' : editId ? 'Perbarui Kontrak' : 'Simpan Kontrak'}
          </button>
        </div>
      </form>
    </section>
  )
}