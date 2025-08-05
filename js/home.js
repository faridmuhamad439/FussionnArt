const localVideoPaths = [ // Deklarasi array yang berisi path ke file video lokal.
    "https://files.catbox.moe/mr9dep.mp4",
    "https://files.catbox.moe/1oimch.mp4",
    "https://files.catbox.moe/fiqlt9.mp4",
    "https://files.catbox.moe/ehlybc.mp4",
    "https://files.catbox.moe/97id8p.mp4",
    "https://files.catbox.moe/i7zxsb.mp4",
    "https://files.catbox.moe/58hps0.mp4",
    "https://files.catbox.moe/wvz31n.mp4",// Path contoh ke video.
    "https://files.catbox.moe/16meg3.mp4",
    "https://files.catbox.moe/vfhm47.mp4",
];

let currentVideoIndex = 0; // Variabel untuk melacak indeks video yang sedang diputar. Dimulai dari 0.
let autoAdvanceTimer; // Variabel untuk menyimpan referensi timer yang akan otomatis memutar video berikutnya.

// Referensi elemen DOM
const mainVideo = document.getElementById('main-video'); // Mengambil elemen video utama dari HTML.
const prevBtn = document.getElementById('prev-video-btn'); // Mengambil tombol "sebelumnya" untuk video.
const nextBtn = document.getElementById('next-video-btn'); // Mengambil tombol "berikutnya" untuk video.

function updateVideoPlayer(index) { // Fungsi untuk memperbarui pemutar video ke video pada indeks tertentu.
    if (localVideoPaths.length === 0) return; // Jika tidak ada video dalam daftar, hentikan fungsi.
    clearTimeout(autoAdvanceTimer); // Menghapus timer sebelumnya agar tidak tumpang tindih.
    mainVideo.src = localVideoPaths[index]; // Mengatur sumber (src) video.
    mainVideo.load(); // Memuat ulang video.
    mainVideo.play().catch(e => console.error("Gagal memutar video:", e)); // Memutar video, menangani error jika gagal.
    autoAdvanceTimer = setTimeout(() => { // Mengatur timer baru untuk otomatis berpindah video.
        goToNextVideo(); // Memanggil fungsi untuk berpindah ke video berikutnya setelah 30 detik.
    }, 23000); // Durasi timer dalam milidetik (23000ms = 23 detik).
}

function goToNextVideo() { // Fungsi untuk pindah ke video berikutnya.
    currentVideoIndex = (currentVideoIndex + 1) % localVideoPaths.length; // Menghitung indeks video berikutnya secara melingkar.
    updateVideoPlayer(currentVideoIndex); // Memperbarui pemutar video.
}

function goToPrevVideo() { // Fungsi untuk pindah ke video sebelumnya.
    currentVideoIndex = (currentVideoIndex - 1 + localVideoPaths.length) % localVideoPaths.length; // Menghitung indeks video sebelumnya secara melingkar.
    updateVideoPlayer(currentVideoIndex); // Memperbarui pemutar video.
}

if (prevBtn && nextBtn) { // Memeriksa apakah tombol-tombol navigasi video ada di halaman.
    prevBtn.addEventListener('click', goToPrevVideo); // Menambahkan event listener ke tombol "sebelumnya".
    nextBtn.addEventListener('click', goToNextVideo); // Menambahkan event listener ke tombol "berikutnya".
}

// ISI
const animeGallery = document.getElementById('anime-gallery'); // Mengambil elemen galeri anime dari HTML.
let allAnimeData = []; // Array untuk menyimpan semua data anime yang diambil dari API.

function loadAnimeData() { // Fungsi untuk mengambil data anime dari API.
    fetch("https://api-galeri-anime.onrender.com/api/anime") // Melakukan permintaan ke API.
        .then(response => { // Menerima respons dari server.
            if (!response.ok) { // Memeriksa apakah respons berhasil (status 200).
                throw new Error('Gagal mengambil data dari server.'); // Jika gagal, lemparkan error.
            }
            return response.json(); // Jika berhasil, ubah respons menjadi JSON.
        })
        .then(result => { // Menerima data JSON.
            const filteredAnime = result.filter(anime => anime.id >= 1 && anime.id <= 11); // Menyaring anime berdasarkan ID dari 1 hingga 11.
            allAnimeData = filteredAnime; // Menyimpan data anime yang sudah disaring.
            showAnime(allAnimeData); // Menampilkan data anime yang sudah disaring di galeri.
        })
        .catch(error => { // Menangkap dan mengelola error.
            if (animeGallery) { // Memeriksa apakah elemen galeri ada.
                const p = document.createElement('p'); // Membuat elemen paragraf.
                p.textContent = error.message; // Menetapkan teks pesan error.
                p.style.color = 'red'; // Mengatur warna teks menjadi merah.
                p.style.textAlign = 'center'; // Menetapkan perataan teks ke tengah.
                animeGallery.appendChild(p); // Menambahkan paragraf ke galeri.
            }
        });
}

function showAnime(animeList) { // Fungsi untuk membuat dan menampilkan kartu anime.
    if (!animeGallery) return; // Jika elemen galeri tidak ada, hentikan fungsi.
    while (animeGallery.firstChild) animeGallery.removeChild(animeGallery.firstChild); // Membersihkan galeri dari konten sebelumnya.

    if (animeList.length === 0) { // Jika daftar anime kosong.
        const p = document.createElement('p'); // Membuat elemen paragraf.
        p.textContent = 'Anime tidak ditemukan.'; // Menetapkan teks.
        p.style.textAlign = 'center'; // Perataan teks ke tengah.
        animeGallery.appendChild(p); // Menambahkan paragraf ke galeri.
        return; // Hentikan fungsi.
    }

    animeList.forEach(anime => { // Melakukan perulangan untuk setiap item di daftar anime.
        const card = document.createElement('div'); // Membuat elemen div untuk kartu anime.
        card.className = 'landscape-card'; // Menambahkan kelas CSS.
        const img = document.createElement('img'); // Membuat elemen gambar.
        img.className = 'landscape-image'; // Menambahkan kelas CSS.
        img.src = anime.imageCover; // Mengatur sumber gambar (cover anime).
        img.alt = anime.title; // Mengatur teks alternatif.
        img.loading = 'lazy'; // Mengaktifkan lazy loading.
        const overlay = document.createElement('div'); // Membuat elemen div untuk overlay.
        overlay.className = 'card-overlay'; // Menambahkan kelas CSS.
        const title = document.createElement('div'); // Membuat elemen div untuk judul anime.
        title.className = 'card-title'; // Menambahkan kelas CSS.
        title.textContent = anime.title; // Mengatur teks judul.
        const idBadge = document.createElement('div'); // Membuat elemen div untuk badge ID.
        idBadge.className = 'card-id'; // Menambahkan kelas CSS.
        idBadge.textContent = anime.id; // Menampilkan ID anime.
        overlay.appendChild(title); // Menambahkan judul ke overlay.
        card.appendChild(img); // Menambahkan gambar ke kartu.
        card.appendChild(overlay); // Menambahkan overlay ke kartu.
        card.appendChild(idBadge); // Menambahkan badge ID ke kartu.
        card.addEventListener('click', () => { // Menambahkan event listener saat kartu diklik.
            if (anime.id == 11) { // Memeriksa jika ID anime adalah 11.
                window.location.href = `quote.html?id=${anime.id}`; // Jika ya, arahkan ke halaman `quote.html`.
            } else {
                window.location.href = `anime.html?animeId=${anime.id}`; // Jika tidak, arahkan ke halaman `anime.html`.
            }
        });
        animeGallery.appendChild(card); // Menambahkan kartu yang sudah selesai ke galeri.
    });
}

// --- Inisialisasi Halaman ---
document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode di dalam fungsi ini setelah dokumen dimuat.
    // Jalankan video slider jika elemennya ada
    if (mainVideo) { // Memeriksa apakah elemen video ada.
        if (localVideoPaths.length > 0) { // Memeriksa apakah ada video dalam daftar.
            updateVideoPlayer(currentVideoIndex); // Jika ya, mulai memutar video pertama.
        } else {
            console.log("Tidak ada video dalam daftar putar."); // Jika tidak, cetak pesan ke konsol.
        }
    }

    // Jalankan galeri anime jika elemennya ada
    if (animeGallery) { // Memeriksa apakah elemen galeri ada.
        loadAnimeData(); // Jika ya, muat data anime.
    }

    // ===============================================
    // search.js
    // ===============================================
    // Panggil fungsi dari search.js, berikan ID input dan fungsi callback-nya.
    initializeSearch('search-input', (searchTerm) => { // Memanggil fungsi `initializeSearch` untuk mengelola input pencarian.
        // Logika ini (dari `performSearch` lama) akan dijalankan setiap kali pengguna mengetik.
        const searchResult = allAnimeData.filter(anime => // Menyaring data anime.
            anime.title.toLowerCase().includes(searchTerm.toLowerCase()) // Mencocokkan judul anime dengan kata kunci pencarian.
        );
        showAnime(searchResult); // Menampilkan hasil pencarian.
    });
}); // Mengakhiri event listener `DOMContentLoaded`.