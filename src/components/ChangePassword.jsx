import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ChangePassword({ user }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert('⚠️ Konfirmasi password baru tidak cocok!')
      return
    }

    if (!user?.username && !user?.id) {
      alert('⚠️ Data pengguna tidak valid. Silakan login ulang.')
      return
    }

    setLoading(true)
    try {
      // Update password langsung ke tabel 'users' di database
      let query = supabase.from('users').update({ password: newPassword })

      if (user?.id) {
        query = query.eq('id', user.id)
      } else {
        query = query.eq('username', user.username)
      }

      const { error } = await query

      if (error) throw error

      alert('✅ Password berhasil diperbarui!')
      setNewPassword('')
      setConfirmPassword('')
      
      // Redirect otomatis kembali ke dashboard
      navigate('/')
    } catch (error) {
      alert(`❌ Gagal memperbarui password: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Ubah Password</h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        {/* TAMPILAN USERNAME AKUN */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Username / Akun Aktif</label>
          <input
            type="text"
            value={user?.username || user?.nama_lengkap || '-'}
            disabled
            className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 cursor-not-allowed select-none font-medium"
          />
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
            <input
              type="password"
              placeholder="Masukan Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}