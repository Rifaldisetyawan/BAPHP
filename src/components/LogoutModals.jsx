export default function LogoutModal({ show, onClose, onConfirm }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-150">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl font-bold border border-red-100 shadow-inner">
          ⚠️
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Konfirmasi Keluar</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Anda yakin ingin keluar dari sesi sistem BAPHP ini? Pastikan semua pekerjaan Anda telah tersimpan.
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-red-200"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  )
}