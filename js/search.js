/** // Komentar JSDoc untuk menjelaskan fungsi.
 * Menginisialisasi fungsionalitas pencarian pada sebuah input.
 * @param {string} inputId - ID dari elemen input pencarian (misal: 'explore-search-input').
 * @param {function(string): void} callback - Fungsi yang akan dipanggil setiap kali ada input,
 * dengan membawa nilai dari input sebagai parameternya.
 */
function initializeSearch(inputId, callback) { // Mendefinisikan fungsi `initializeSearch` yang menerima ID input dan fungsi callback.

    // 1. Dapatkan elemen input berdasarkan ID yang diberikan.
    const searchInput = document.getElementById(inputId); // Mengambil elemen input dari DOM menggunakan ID yang diberikan.

    // 2. Pastikan elemennya ada sebelum melanjutkan.
    if (!searchInput) { // Memeriksa apakah elemen input berhasil ditemukan.
        console.error(`Elemen input dengan ID "${inputId}" tidak ditemukan.`); // Jika tidak, cetak pesan error ke konsol.
        return; // Hentikan eksekusi fungsi.
    }

    // 3. Dapatkan elemen form terdekat yang membungkus input.
    const searchForm = searchInput.closest('form'); // Mencari elemen form terdekat yang menjadi "induk" dari input.

    // 4. Tambahkan event listener 'input' untuk pencarian real-time.
    // Event ini akan aktif setiap kali pengguna mengetik sesuatu.
    searchInput.addEventListener('input', () => { // Menambahkan event listener yang akan dipicu setiap kali nilai input berubah (ketika pengguna mengetik).
        // Ambil nilai dari input, hapus spasi di awal/akhir, dan jadikan huruf kecil.
        const searchTerm = searchInput.value.trim(); // Mengambil nilai input, menghapus spasi di awal/akhir, dan menyimpannya.

        // Panggil fungsi 'callback' yang diberikan dari halaman lain (explore.js atau home.js)
        // dan kirimkan kata kunci pencariannya.
        callback(searchTerm); // Memanggil fungsi callback yang diberikan sebagai argumen, dengan `searchTerm` sebagai parameternya.
    });

    // 5. Jika input ada di dalam form, cegah form dari me-reload halaman.
    if (searchForm) { // Memeriksa apakah elemen form berhasil ditemukan.
        searchForm.addEventListener('submit', (e) => { // Menambahkan event listener untuk saat form di-submit.
            e.preventDefault(); // Mencegah aksi default form, yaitu me-reload halaman.
        });
    }
} // Akhir dari fungsi `initializeSearch`.