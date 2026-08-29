// Konfigurasi Supabase
const SUPABASE_URL = 'https://phplxheoenpmniqvqgzb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocGx4aGVvZW5wbW5pcXZxZ3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3ODA4NTUsImV4cCI6MjA5OTM1Njg1NX0.ZJy4nyU3bFYx8eMwJcYFBIKtY1JPkb5S8Xr86sIBlog';

// Ubah nama variabel menjadi db agar tidak bentrok dengan global 'supabase' dari CDN
let db;

async function cekKoneksi() {
    const statusEl = document.getElementById('status-koneksi');
    try {
        // 1. Cek apakah library Supabase berhasil dimuat dari CDN
        if (!window.supabase) {
            throw new Error("Library Supabase gagal dimuat. Periksa koneksi internet Anda.");
        }

        // 2. Inisialisasi Supabase Client menggunakan window.supabase
        if (!db) {
            db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }

        // 3. Tes koneksi ke API Supabase
        const { data, error } = await db.from('test_connection').select('*').limit(1);

        // Jika error kode bukan karena tabel tidak ada
        if (error && error.code !== 'PGRST116' && error.code !== '42P01' && error.code !== 'PGRST205') {
            throw error;
        }


        // Jika berhasil
        statusEl.textContent = "Terhubung dengan Sukses! 🎉";
        statusEl.style.color = "#10b981";
        statusEl.style.background = "rgba(16, 185, 129, 0.1)";
    } catch (error) {
        console.error('Koneksi gagal:', error);
        statusEl.textContent = `Gagal: ${error.message || JSON.stringify(error)}`;
        statusEl.style.color = "#ef4444";
        statusEl.style.background = "rgba(239, 68, 68, 0.1)";
    }
}

// Jalankan langsung
cekKoneksi();
