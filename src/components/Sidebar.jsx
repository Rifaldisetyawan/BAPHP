import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ user, onLogoutClick, handleTambahBaru }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
            B
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">BAPHP<span className="text-indigo-600">.</span></span>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-2 mb-2">General</p>
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${location.pathname === '/' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            to="/tambah"
            onClick={handleTambahBaru}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${location.pathname === '/tambah' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span>📝</span> Tambah Kontrak
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/users"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${location.pathname === '/users' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>👥</span> Manajemen User
            </Link>
          )}
          <Link
            to="/logs"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${location.pathname === '/logs' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span>📜</span> Log Aktivitas
          </Link>
          {user?.role !== 'admin' && (
            <Link
              to="/ubah-password"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${location.pathname === '/ubah-password' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span>🔒</span> Ubah Password
            </Link>
          )}

        </div>

      </div>

      <div className="space-y-3">
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
            {user?.nama_lengkap ? user.nama_lengkap.substring(0, 2).toUpperCase() : user?.username?.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {user?.nama_lengkap || user?.username}
            </p>
            <p className="text-[10px] text-slate-400 capitalize truncate">
              Role: {user?.role || 'Admin'}
            </p>
          </div>
        </div>
        <button
          onClick={onLogoutClick}
          className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-all border border-red-200/60"
        >
          Keluar (Logout)
        </button>
      </div>
    </aside>
  )
}