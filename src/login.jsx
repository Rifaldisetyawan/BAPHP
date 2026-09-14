import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.rpc('login_user', {
        p_username: username,
        p_password: password
      })

      if (error) throw error

      if (data && data.length > 0) {
        const loggedInUser = data[0]
        console.log('Login berhasil:', loggedInUser)
        
        // Panggil fungsi dari App.jsx agar sesi tersimpan dan otomatis masuk ke dashboard
        if (onLoginSuccess) {
          onLoginSuccess(loggedInUser)
        }
      } else {
        setErrorMsg('Username atau password salah!')
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error.message)
      setErrorMsg(`Login gagal: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200 mx-auto">
            B
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Login BAPHP</h1>
          <p className="text-xs text-slate-400">Masukkan username dan password</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}