export default function InactivityModal({ show, countdown, onConfirm, onClose }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3 text-amber-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Peringatan Sesi Inaktif</h3>
        </div>
        <p className="text-sm text-slate-600">
          Anda sudah tidak melakukan aktivitas selama 10 menit. Sesi Anda akan otomatis berakhir dalam <span className="font-semibold text-amber-600">{countdown} detik</span> jika tidak ada respons.
        </p>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Keluar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            Tetap Masuk
          </button>
        </div>
      </div>
    </div>
  )
}