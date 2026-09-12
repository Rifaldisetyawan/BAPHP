export default function Header({ onLogoutClick }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="text-sm font-semibold text-slate-700">
        Sistem Kelola Kontrak & Pekerjaan
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-slate-400 hidden sm:block">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <button
          onClick={onLogoutClick}
          className="md:hidden px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200"
        >
          Logout
        </button>
      </div>
    </header>
  )
}