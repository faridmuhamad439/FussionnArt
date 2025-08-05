document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode di dalam fungsi ini setelah seluruh dokumen HTML selesai dimuat.

    // --- Elemen & Variabel Utama ---
    const characterGrid = document.getElementById('character-grid'); // Mengambil elemen grid tempat gambar akan ditampilkan.
    const animeTitle = document.getElementById('anime-title'); // Mengambil elemen untuk menampilkan judul anime.
    let currentAnimeData = null; // Variabel untuk menyimpan data anime yang sedang aktif.

    // --- Variabel BARU untuk paginasi ---
    let currentPage = 1; // Variabel untuk melacak halaman yang sedang ditampilkan, dimulai dari 1.
    const imagesPerPage = 30; // Konstanta yang menentukan jumlah gambar per halaman.

    // --- Referensi DOM BARU untuk paginasi ---
    const paginationContainer = document.getElementById('pagination-container'); // Mengambil wadah untuk elemen paginasi.
    const prevButton = document.getElementById('prev-button'); // Mengambil tombol "sebelumnya".
    const nextButton = document.getElementById('next-button'); // Mengambil tombol "berikutnya".
    const pageInfo = document.getElementById('page-info'); // Mengambil elemen untuk menampilkan informasi halaman.

    // --- Fungsi Helper ---
    const getAnimeId = () => '11'; // Fungsi helper untuk mendapatkan ID anime, dalam hal ini selalu 11.
    const clearCharacterGrid = () => { // Fungsi helper untuk membersihkan isi dari grid.
        while (characterGrid.firstChild) { // Melakukan perulangan selama grid memiliki anak elemen.
            characterGrid.removeChild(characterGrid.firstChild); // Menghapus anak elemen pertama.
        }
    };

    // Fungsi untuk menambahkan gambar ke grid
    function addImageToGrid(url) { // Fungsi untuk membuat dan menambahkan elemen gambar ke grid.
        const item = document.createElement('div'); // Membuat elemen div untuk setiap item.
        item.className = 'character-item'; // Menambahkan kelas CSS.
        const img = document.createElement('img'); // Membuat elemen gambar.
        img.src = url; // Mengatur sumber URL gambar.
        img.alt = 'Anime character image'; // Mengatur teks alternatif.
        img.loading = 'lazy'; // Mengaktifkan lazy loading untuk performa.

        // Tambahkan event listener modal di sini
        item.addEventListener('click', () => { // Menambahkan event listener saat item gambar diklik.
            window.openModal(url); // Memanggil fungsi `openModal` yang ada di lingkup global (dari `modal.js`).
        });

        item.appendChild(img); // Menambahkan gambar ke dalam item div.
        characterGrid.appendChild(item); // Menambahkan item div ke dalam grid.
    }

    // --- Fungsi Utama ---

    // Modifikasi fungsi display untuk mendukung paginasi
    function updateDisplay() { // Fungsi utama untuk menampilkan gambar, kini dengan paginasi.
        if (!currentAnimeData) return; // Jika data anime belum dimuat, hentikan fungsi.
        clearCharacterGrid(); // Membersihkan grid dari gambar-gambar sebelumnya.

        // 1. Kumpulkan semua URL gambar potrait
        const portraitImages = []; // Array untuk menyimpan semua URL gambar potrait.
        currentAnimeData.data.forEach(character => { // Melakukan perulangan pada setiap karakter dalam data anime.
            if (character.characterImage && character.characterImage.potrait) { // Memeriksa apakah ada gambar potrait.
                character.characterImage.potrait.forEach(url => portraitImages.push(url)); // Menambahkan setiap URL potrait ke array.
            }
        });

        // 2. Panggil fungsi paginasi dari page.js
        setupPagination({ // Memanggil fungsi `setupPagination` (dari file lain) untuk mengatur paginasi.
            container: paginationContainer, // Wadah untuk tombol paginasi.
            prevButton: prevButton, // Tombol "sebelumnya".
            nextButton: nextButton, // Tombol "berikutnya".
            pageInfo: pageInfo, // Elemen untuk menampilkan nomor halaman.
            currentPage: currentPage, // Halaman saat ini.
            totalItems: portraitImages.length, // Total gambar yang tersedia.
            itemsPerPage: imagesPerPage, // Jumlah gambar per halaman.
            onPageChange: (newPage) => { // Fungsi callback yang akan dijalankan saat halaman berubah.
                currentPage = newPage; // Memperbarui nomor halaman saat ini.
                updateDisplay(); // Panggil ulang fungsi ini untuk menampilkan halaman baru.
            }
        });

        // 3. Potong array gambar sesuai halaman saat ini
        const startIndex = (currentPage - 1) * imagesPerPage; // Menghitung indeks awal gambar untuk halaman saat ini.
        const paginatedImages = portraitImages.slice(startIndex, startIndex + imagesPerPage); // Mengambil subset gambar untuk halaman saat ini.

        // 4. Tampilkan gambar untuk halaman ini
        paginatedImages.forEach(url => addImageToGrid(url)); // Melakukan perulangan untuk setiap gambar di halaman ini dan menampilkannya.
    }

    // Fungsi untuk memuat data dari API
    function loadCharacterImages() { // Fungsi untuk memuat data anime dari API.
        const animeId = getAnimeId(); // Mendapatkan ID anime (11).
        fetch("https://api-galeri-anime.onrender.com/api/anime") // Melakukan permintaan API.
            .then(response => { // Menerima respons.
                if (!response.ok) throw new Error('Gagal memuat data dari API'); // Jika respons tidak OK, lemparkan error.
                return response.json(); // Mengubah respons menjadi JSON.
            })
            .then(result => { // Menerima data JSON.
                const anime = result.find(a => a.id == animeId); // Mencari objek anime dengan ID yang cocok.
                if (!anime) throw new Error('Anime dengan ID ' + animeId + ' tidak ditemukan'); // Jika anime tidak ditemukan, lemparkan error.

                currentAnimeData = anime; // Menyimpan data anime yang ditemukan ke variabel global.
                animeTitle.textContent = `${anime.title} Gallery`; // Menampilkan judul anime.
                updateDisplay(); // Memanggil fungsi untuk menampilkan gambar.
            })
            .catch(error => { // Menangkap dan mengelola error.
                const errorDiv = document.createElement('div'); // Membuat elemen div untuk pesan error.
                errorDiv.className = 'error'; // Menambahkan kelas CSS.
                errorDiv.style.color = 'red'; // Mengatur warna teks.
                errorDiv.style.textAlign = 'center'; // Mengatur perataan teks.
                errorDiv.textContent = error.message; // Mengatur teks pesan error.
                clearCharacterGrid(); // Membersihkan grid.
                characterGrid.appendChild(errorDiv); // Menambahkan pesan error ke grid.
            });
    }

    // Hapus kode modal lama dari sini
    // const modal = document.getElementById("image-modal");
    // ... dan semua event listener terkaitnya ...

    // --- Navigasi Hamburger ---
    const hamburger = document.getElementById('hamburger'); // Mengambil tombol hamburger.
    const navMenu = document.getElementById('navMenu'); // Mengambil menu navigasi.
    if (hamburger && navMenu) { // Memastikan elemen-elemen ada.
        hamburger.addEventListener('click', () => { // Menambahkan event listener saat tombol hamburger diklik.
            navMenu.classList.toggle('active'); // Menambahkan atau menghapus kelas 'active' untuk menampilkan/menyembunyikan menu.
        });
    }

    // Inisialisasi saat halaman dimuat
    loadCharacterImages(); // Memanggil fungsi untuk memulai proses.
}); // Akhir dari event listener `DOMContentLoaded`.