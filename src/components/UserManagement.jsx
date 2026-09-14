import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null) // Menyimpan ID data yang sedang diedit
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    role: 'user'
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('username', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Gagal memuat user:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEditClick = (usr) => {
    setEditId(usr.id) // Simpan ID unik user
    setFormData({
      username: usr.username || '',
      password: '', // Kosongkan password saat edit agar opsional
      nama_lengkap: usr.nama_lengkap || '',
      role: usr.role || 'user'
    })
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setFormData({ username: '', password: '', nama_lengkap: '', role: 'user' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      if (editId) {
        // Logika Update berdasarkan ID
        const updatePayload = {
          username: formData.username,
          nama_lengkap: formData.nama_lengkap,
          role: formData.role
        }
        
        // Password hanya diperbarui jika diisi
        if (formData.password.trim() !== '') {
          updatePayload.password = formData.password
        }

        const { error } = await supabase
          .from('users')
          .update(updatePayload)
          .eq('id', editId)

        if (error) throw error

        setMessage({ text: 'Data user berhasil diperbarui!', type: 'success' })
      } else {
        // Logika Tambah User Baru
        if (!formData.password) {
          throw new Error('Password wajib diisi untuk user baru.')
        }

        const { error } = await supabase.from('users').insert([
          {
            username: formData.username,
            password: formData.password,
            nama_lengkap: formData.nama_lengkap,
            role: formData.role
          }
        ])

        if (error) throw error

        setMessage({ text: 'User baru berhasil ditambahkan dan password telah dienkripsi!', type: 'success' })
      }

      handleCancelEdit()
      fetchUsers()
    } catch (error) {
      setMessage({ text: `Gagal: ${error.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return
    
    setLoading(true)
    try {
      const { error } = await supabase.from('users').delete().eq('id', id)
      if (error) throw error
      
      fetchUsers()
      setMessage({ text: 'User berhasil dihapus.', type: 'success' })
    } catch (error) {
      setMessage({ text: `Gagal menghapus: ${error.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen User</h1>
      </div>

      {/* Form Tambah/Edit User */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">
            {editId ? `Edit User: ${formData.username}` : 'Tambah User Baru'}
          </h2>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Batal Edit
            </button>
          )}
        </div>

        {message.text && (
          <div className={`p-3 rounded-xl text-xs font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs items-end">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Username login"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Password {editId && <span className="text-slate-400 font-normal">(Kosongkan jika tetap)</span>}
            </label>
            <input
              type="password"
              name="password"
              required={!editId}
              value={formData.password}
              onChange={handleChange}
              placeholder={editId ? 'Isi untuk ganti password' : 'Password'}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              required
              value={formData.nama_lengkap}
              onChange={handleChange}
              placeholder="Nama lengkap user"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="lg:col-span-4 pt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : editId ? 'Perbarui User' : 'Simpan User Baru'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel Daftar User */}
      <section className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Daftar Pengguna</h2>
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50"
          >
            🔄 {loading ? 'Memuat...' : 'Refresh'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((usr, idx) => (
                  <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{usr.username}</td>
                    <td className="py-3.5 px-4 text-slate-700">{usr.nama_lengkap}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        usr.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(usr)}
                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-all"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(usr.id)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-medium transition-all"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}