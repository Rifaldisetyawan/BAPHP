import { supabase } from '../supabaseClient'

const TABLE_NAME = 'kontrak_pekerjaan'

// 1. READ: Ambil Semua Data Kontrak
export async function getKontrak() {
  const { data, error } = await supabase
    .from(TABLE_NAME) // sesuaikan dengan nama tabel di supabase Anda
    .select('*')
    .order('id', { ascending: true }) // Gunakan true agar data baru berada di bawah

  if (error) throw error
  return data
}

// 2. CREATE: Tambah Data Kontrak Baru
export const createKontrak = async (payload) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([payload])
    .select()

  if (error) {
    console.error('Error creating data:', error.message)
    throw error
  }
  return data
}

// 3. UPDATE: Edit Data Kontrak Berdasarkan ID
export const updateKontrak = async (id, payload) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating data:', error.message)
    throw error
  }
  return data
}

// 4. DELETE: Hapus Data Kontrak Berdasarkan ID
export const deleteKontrak = async (idOrObject) => {
  // Ekstrak ID secara otomatis jika yang masuk tidak sengaja berupa objek atau event React
  let actualId = idOrObject;
  if (typeof idOrObject === 'object' && idOrObject !== null) {
    actualId = idOrObject.id || idOrObject.currentTarget?.getAttribute('data-id');
  }

  if (!actualId) {
    throw new Error("ID kontrak tidak valid atau kosong.");
  }

  // Lanjutkan eksekusi hapus ke Supabase menggunakan ID murni
  const { error } = await supabase
    .from('kontrak_pekerjaan') // Sesuaikan dengan nama tabel Supabase Anda
    .delete()
    .eq('id', Number(actualId));

  if (error) {
    throw error;
  }
  
  return true;
}
