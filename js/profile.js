// ===============================================
//  JAVASCRIPT UNTUK HALAMAN PROFIL
// ===============================================

// BAGIAN 1: Referensi Elemen & Variabel Global
const loggedInUser = localStorage.getItem("loggedInUser"); // Mengambil nama pengguna yang sedang login dari local storage.
let allImageData = []; // Array kosong untuk menyimpan semua data gambar dari API.

const profileContent = document.getElementById('profile-content'); // Mengambil elemen wadah untuk konten profil.
const loginPrompt = document.getElementById('login-prompt'); // Mengambil elemen untuk menampilkan pesan login.
const profileUsername = document.getElementById('profile-username'); // Mengambil elemen untuk menampilkan nama pengguna.
const profileHandle = document.getElementById('profile-handle'); // Mengambil elemen untuk menampilkan handle pengguna (misalnya, @nama).
const profileTabs = document.getElementById('profile-tabs'); // Mengambil wadah untuk tombol tab (Disukai, Favorit).
const grid = document.getElementById('profile-grid'); // Mengambil elemen grid tempat gambar akan ditampilkan.

// BAGIAN 2: Fungsi-fungsi Helper (Sama seperti di halaman explore)
function getLikes() { // Fungsi untuk mendapatkan daftar gambar yang disukai dari local storage.
    if (!loggedInUser) return []; // Jika tidak ada pengguna yang login, kembalikan array kosong.
    const key = `likedImages_${loggedInUser}`; // Membuat kunci unik untuk local storage berdasarkan nama pengguna.
    const likes = localStorage.getItem(key); // Mengambil data yang disimpan dengan kunci tersebut.
    return likes ? JSON.parse(likes) : []; // Mengurai data JSON atau mengembalikan array kosong jika tidak ada data.
}

function getFavorites() { // Fungsi untuk mendapatkan daftar gambar favorit dari local storage.
    if (!loggedInUser) return []; // Jika tidak ada pengguna yang login, kembalikan array kosong.
    const key = `favoritedImages_${loggedInUser}`; // Membuat kunci unik untuk local storage.
    const favorites = localStorage.getItem(key); // Mengambil data yang disimpan dengan kunci tersebut.
    return favorites ? JSON.parse(favorites) : []; // Mengurai data JSON atau mengembalikan array kosong.
}

// BAGIAN 3: Fungsi Utama untuk Menampilkan Gambar

// Fungsi untuk mengambil dan memproses data API menjadi daftar gambar
function fetchAndProcessImages() { // Fungsi untuk mengambil dan memproses semua gambar dari API.
    // Kita fetch ulang data agar punya informasi lengkap (judul anime, dll) untuk setiap gambar
    return fetch("https://api-galeri-anime.onrender.com/api/anime") // Melakukan permintaan ke API.
        .then(response => response.json()) // Mengubah respons menjadi JSON.
        .then(data => { // Menerima data JSON dari API.
            const processedData = []; // Array sementara untuk menyimpan data gambar yang telah diproses.
            const filteredAnime = data.filter(anime => anime.id >= 1 && anime.id <= 11); // Menyaring anime berdasarkan ID tertentu.
            filteredAnime.forEach(anime => { // Melakukan perulangan pada setiap anime yang sudah disaring.
                if (anime.data) { // Memeriksa apakah ada data karakter.
                    anime.data.forEach(character => { // Melakukan perulangan pada setiap karakter.
                        if (character.characterImage) { // Memeriksa apakah ada gambar karakter.
                            const addImage = (url, orientation) => { // Fungsi pembantu untuk menambahkan gambar ke array.
                                if (url) processedData.push({ imageUrl: url, orientation, characterName: character.characterName, animeTitle: anime.title });
                            };
                            character.characterImage.potrait?.forEach(url => addImage(url, 'potrait')); // Menambahkan gambar potrait.
                            character.characterImage.square?.forEach(url => addImage(url, 'square')); // Menambahkan gambar square.
                            character.characterImage.landScape?.forEach(url => addImage(url, 'landScape')); // Menambahkan gambar landscape.
                        }
                    });
                }
            });
            allImageData = processedData; // Menyimpan data gambar yang sudah diproses ke variabel global.
        });
}

// Fungsi untuk menampilkan gambar berdasarkan daftar URL tanpa menggunakan innerHTML
function renderGrid(imageUrlList, emptyMessage) { // Fungsi untuk menampilkan gambar di grid.
    // Cara modern dan direkomendasikan untuk membersihkan semua isi elemen
    grid.replaceChildren(); // Menghapus semua anak elemen dari grid dengan cara modern.

    /* * Alternatif cara klasik untuk membersihkan isi elemen:
     * while (grid.firstChild) {
     *     grid.removeChild(grid.firstChild);
     * }
    */

    // Filter data gambar lengkap berdasarkan daftar URL yang kita punya
    const imagesToDisplay = allImageData.filter(imgData => imageUrlList.includes(imgData.imageUrl)); // Menyaring `allImageData` untuk hanya menampilkan gambar yang ada di `imageUrlList`.

    if (imagesToDisplay.length === 0) { // Jika tidak ada gambar yang akan ditampilkan.
        // 1. Buat elemen <p> baru
        const messageElement = document.createElement('p'); // Membuat elemen paragraf baru.

        // 2. Isi teksnya dengan aman menggunakan textContent
        messageElement.textContent = emptyMessage; // Menetapkan teks pesan kosong.

        // 3. Tambahkan elemen <p> tersebut ke dalam grid
        grid.appendChild(messageElement); // Menambahkan pesan ke grid.
        return; // Menghentikan fungsi.
    }

    imagesToDisplay.forEach(image => { // Melakukan perulangan untuk setiap gambar yang akan ditampilkan.
        const item = document.createElement('div'); // Membuat elemen div untuk setiap item.
        item.className = 'character-item'; // Menambahkan kelas CSS.

        const img = document.createElement('img'); // Membuat elemen gambar.
        img.src = image.imageUrl; // Mengatur sumber gambar.
        img.alt = `${image.characterName} dari ${image.animeTitle}`; // Mengatur teks alternatif.
        img.loading = 'lazy'; // Mengaktifkan lazy loading.

        item.appendChild(img); // Menambahkan gambar ke item.
        grid.appendChild(item); // Menambahkan item ke grid.
    });
}

// BAGIAN 4: Logika Inisialisasi Halaman
document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode setelah dokumen dimuat.
    // Cek apakah ada pengguna yang login
    if (!loggedInUser) { // Memeriksa apakah `loggedInUser` kosong atau null.
        // Jika tidak, sembunyikan konten profil dan tampilkan pesan login
        profileContent.style.display = 'none'; // Menyembunyikan konten profil.
        loginPrompt.style.display = 'block'; // Menampilkan pesan untuk login.
        return; // Menghentikan eksekusi skrip selanjutnya.
    }

    // Jika ada yang login, lanjutkan
    // 1. Tampilkan nama pengguna di profil
    profileUsername.textContent = loggedInUser; // Mengatur teks elemen nama pengguna.
    profileHandle.textContent = `@${loggedInUser}`; // Mengatur teks elemen handle pengguna.

    // 2. Ambil data gambar dari API, lalu tampilkan tab default (Disukai)
    grid.textContent = "Memuat gambar..."; // Menampilkan pesan "Memuat gambar..." di grid.
    fetchAndProcessImages().then(() => { // Memanggil fungsi untuk mengambil dan memproses data, lalu menjalankan `.then` setelahnya.
        // Setelah semua data gambar siap, tampilkan gambar yang disukai
        renderGrid(getLikes(), "Anda belum menyukai gambar apapun."); // Menampilkan gambar yang disukai.
    }).catch(error => { // Menangkap error jika ada masalah saat mengambil data.
        grid.textContent = `style="color:red;">Gagal memuat data gambar.` // Menampilkan pesan error.
    });

    // 3. Tambahkan event listener untuk tab
    profileTabs.addEventListener('click', (event) => { // Menambahkan event listener ke wadah tab.
        if (event.target.matches('.tab-btn')) { // Memeriksa apakah elemen yang diklik adalah tombol tab.
            const tab = event.target.dataset.tab; // Mendapatkan nilai atribut `data-tab`.

            // Hapus class 'active' dari tab sebelumnya
            profileTabs.querySelector('.active').classList.remove('active'); // Menghapus kelas 'active' dari tab yang sedang aktif.
            // Tambahkan class 'active' ke tab yang diklik
            event.target.classList.add('active'); // Menambahkan kelas 'active' ke tab yang baru diklik.

            if (tab === 'liked') { // Memeriksa tab mana yang diklik.
                renderGrid(getLikes(), "Anda belum menyukai gambar apapun."); // Menampilkan gambar yang disukai.
            } else if (tab === 'favorites') { // Jika tab favorit yang diklik.
                renderGrid(getFavorites(), "Anda belum memfavoritkan gambar apapun."); // Menampilkan gambar yang difavoritkan.
            }
        }
    });
});