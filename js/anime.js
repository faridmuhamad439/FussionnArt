document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode di dalam fungsi ini setelah seluruh dokumen HTML selesai dimuat.

    let allRawImages = []; // Variabel untuk menyimpan semua gambar mentah yang diambil dari API.
    let characterList = []; // Variabel untuk menyimpan daftar nama karakter unik.
    let activeCharacterFilter = 'all'; // Variabel untuk melacak filter karakter yang sedang aktif, 'all' secara default.
    let activeOrientationFilter = 'all'; // Variabel untuk melacak filter orientasi gambar (potrait, square, landscape), 'all' secara default.
    let currentPage = 1; // Variabel untuk melacak halaman yang sedang ditampilkan, mulai dari halaman 1.
    const imagesPerPage = 30; // Konstanta yang menentukan jumlah gambar per halaman.

    // Definisikan semua referensi DOM di sini
    const grid = document.getElementById('character-grid'); // Mengambil elemen grid tempat gambar akan ditampilkan.
    const animeTitleHeader = document.getElementById('anime-title'); // Mengambil elemen untuk menampilkan judul anime.
    const characterFiltersContainer = document.getElementById('character-filter-buttons'); // Mengambil wadah untuk tombol filter karakter.
    const orientationFiltersContainer = document.getElementById('orientation-filter-buttons'); // Mengambil wadah untuk tombol filter orientasi.
    const paginationContainer = document.getElementById('pagination-container'); // Mengambil wadah untuk elemen paginasi.
    const prevButton = document.getElementById('prev-button'); // Mengambil tombol "sebelumnya".
    const nextButton = document.getElementById('next-button'); // Mengambil tombol "berikutnya".
    const pageInfo = document.getElementById('page-info'); // Mengambil elemen untuk menampilkan informasi halaman.

    function initializePage() { // Mendefinisikan fungsi utama untuk memulai aplikasi.
        displayMessage('Memuat galeri...'); // Menampilkan pesan "Memuat galeri..." saat halaman pertama kali dibuka.
        const params = new URLSearchParams(window.location.search); // Membuat objek untuk mengurai parameter URL.
        const animeId = params.get('animeId'); // Mengambil nilai parameter 'animeId' dari URL.
        if (!animeId) { // Memeriksa apakah 'animeId' tidak ditemukan di URL.
            displayMessage("ID Anime tidak ditemukan.", true); // Jika tidak ada, tampilkan pesan error.
            return; // Hentikan eksekusi fungsi.
        }

        fetch(`https://api-galeri-anime.onrender.com/api/anime/${animeId}`) // Melakukan permintaan ke API dengan 'animeId'.
            .then(response => response.json()) // Mengubah respons menjadi objek JSON.
            .then(anime => { // Menerima data anime yang sudah dalam format JSON.
                processApiData(anime); // Memproses data anime untuk mengekstrak gambar dan karakter.
                createCharacterFilterButtons(); // Membuat tombol filter karakter berdasarkan data yang diproses.
                displayFilteredImages(); // Menampilkan gambar yang difilter dan diberi paginasi.
            })
            .catch(error => { // Menangkap error jika ada masalah saat mengambil data dari API.
                displayMessage(error.message, true); // Menampilkan pesan error.
            });
    } // Akhir dari fungsi `initializePage`.

    function displayFilteredImages() { // Mendefinisikan fungsi untuk menampilkan gambar berdasarkan filter dan halaman.
        clearElement(grid); // Membersihkan semua konten di dalam grid sebelum menambahkan gambar baru.
        let imagesToDisplay = allRawImages; // Menginisialisasi array gambar yang akan ditampilkan dengan semua gambar mentah.

        if (activeCharacterFilter !== 'all') { // Memeriksa apakah filter karakter aktif.
            imagesToDisplay = imagesToDisplay.filter(img => img.characterName === activeCharacterFilter); // Jika ya, saring gambar berdasarkan karakter.
        }
        if (activeOrientationFilter !== 'all') { // Memeriksa apakah filter orientasi aktif.
            imagesToDisplay = imagesToDisplay.filter(img => img.orientation === activeOrientationFilter); // Jika ya, saring gambar berdasarkan orientasi.
        }

        // Panggil fungsi dari page.js dengan semua elemen yang dibutuhkan
        setupPagination({ // Memanggil fungsi paginasi dengan objek konfigurasi.
            container: paginationContainer, // Wadah untuk paginasi.
            prevButton: prevButton, // Tombol "sebelumnya".
            nextButton: nextButton, // Tombol "berikutnya".
            pageInfo: pageInfo, // Elemen informasi halaman.
            currentPage: currentPage, // Halaman saat ini.
            totalItems: imagesToDisplay.length, // Total gambar yang akan ditampilkan.
            itemsPerPage: imagesPerPage, // Jumlah gambar per halaman.
            onPageChange: (newPage) => { // Fungsi yang dijalankan saat halaman berubah.
                currentPage = newPage; // Memperbarui nomor halaman.
                displayFilteredImages(); // Panggil fungsi ini lagi untuk menampilkan halaman baru.
            }
        });

        const startIndex = (currentPage - 1) * imagesPerPage; // Menghitung indeks awal gambar untuk halaman saat ini.
        const paginatedImages = imagesToDisplay.slice(startIndex, startIndex + imagesPerPage); // Mengambil subset gambar untuk halaman saat ini.

        if (paginatedImages.length === 0) { // Jika tidak ada gambar yang tersisa setelah difilter dan diberi paginasi.
            displayMessage('Tidak ada gambar yang cocok.'); // Tampilkan pesan bahwa tidak ada gambar yang cocok.
            return; // Hentikan eksekusi fungsi.
        }

        paginatedImages.forEach(image => { // Melakukan perulangan untuk setiap gambar di halaman saat ini.
            const item = document.createElement('div'); // Membuat elemen div untuk setiap item gambar.
            item.className = 'character-item'; // Menambahkan kelas CSS.
            const img = document.createElement('img'); // Membuat elemen img.
            img.src = image.imageUrl; // Mengatur URL sumber gambar.
            img.alt = image.characterName; // Mengatur teks alternatif.
            img.loading = 'lazy'; // Mengaktifkan lazy loading untuk performa.
            const infoDiv = document.createElement('div'); // Membuat elemen div untuk informasi gambar.
            infoDiv.className = 'item-info'; // Menambahkan kelas CSS.
            const charNameDiv = document.createElement('div'); // Membuat elemen div untuk nama karakter.
            charNameDiv.className = 'info-char'; // Menambahkan kelas CSS.
            charNameDiv.textContent = image.characterName; // Menampilkan nama karakter.
            infoDiv.appendChild(charNameDiv); // Menambahkan nama karakter ke div info.
            item.appendChild(img); // Menambahkan gambar ke item.
            item.appendChild(infoDiv); // Menambahkan info gambar ke item.
            item.addEventListener('click', () => { // Menambahkan event listener saat item gambar diklik.
                window.openModal(image.imageUrl); // Membuka modal (kotak dialog) dengan gambar yang diklik.
            });
            grid.appendChild(item); // Menambahkan item gambar yang sudah lengkap ke grid.
        });
    } // Akhir dari fungsi `displayFilteredImages`.

    characterFiltersContainer.addEventListener('click', (e) => { // Menambahkan event listener ke wadah filter karakter.
        if (e.target.matches('.filter-btn')) { // Memeriksa apakah elemen yang diklik adalah tombol filter.
            currentPage = 1; // Mengatur ulang halaman ke 1 setiap kali filter baru dipilih.
            activeCharacterFilter = e.target.dataset.filter; // Mengatur filter karakter yang aktif.
            characterFiltersContainer.querySelector('.active')?.classList.remove('active'); // Menghapus kelas 'active' dari tombol yang sebelumnya aktif.
            e.target.classList.add('active'); // Menambahkan kelas 'active' ke tombol yang baru diklik.
            displayFilteredImages(); // Memanggil fungsi untuk menampilkan gambar dengan filter baru.
        }
    });

    orientationFiltersContainer.addEventListener('click', (e) => { // Menambahkan event listener ke wadah filter orientasi.
        if (e.target.matches('.filter-btn')) { // Memeriksa apakah elemen yang diklik adalah tombol filter.
            currentPage = 1; // Mengatur ulang halaman ke 1 setiap kali filter baru dipilih.
            activeOrientationFilter = e.target.dataset.filter; // Mengatur filter orientasi yang aktif.
            orientationFiltersContainer.querySelector('.active')?.classList.remove('active'); // Menghapus kelas 'active' dari tombol yang sebelumnya aktif.
            e.target.classList.add('active'); // Menambahkan kelas 'active' ke tombol yang baru diklik.
            displayFilteredImages(); // Memanggil fungsi untuk menampilkan gambar dengan filter baru.
        }
    });

    // --- Kode Helper (tidak berubah) ---
    function processApiData(anime) { // Mendefinisikan fungsi pembantu untuk memproses data API.
        animeTitleHeader.textContent = anime.title; // Mengatur judul anime di header.
        const processedImages = []; // Array sementara untuk menyimpan gambar yang diproses.
        const characterSet = new Set(); // Menggunakan Set untuk menyimpan nama karakter unik.
        anime.data?.forEach(character => { // Melakukan perulangan pada setiap karakter dari data API.
            characterSet.add(character.characterName); // Menambahkan nama karakter ke Set.
            const addImage = (url, orientation) => { // Fungsi pembantu untuk menambahkan gambar ke array yang diproses.
                if (url) processedImages.push({ imageUrl: url, characterName: character.characterName, orientation: orientation, });
            };
            character.characterImage?.potrait?.forEach(url => addImage(url, 'potrait')); // Menambahkan gambar potrait jika ada.
            character.characterImage?.square?.forEach(url => addImage(url, 'square')); // Menambahkan gambar square jika ada.
            character.characterImage?.landScape?.forEach(url => addImage(url, 'landScape')); // Menambahkan gambar landscape jika ada.
        });
        allRawImages = processedImages; // Mengisi array utama dengan gambar yang sudah diproses.
        characterList = ['all', ...characterSet]; // Mengisi daftar karakter dengan 'all' dan karakter-karakter unik.
    }
    function createCharacterFilterButtons() { // Mendefinisikan fungsi untuk membuat tombol filter karakter.
        clearElement(characterFiltersContainer); // Membersihkan wadah tombol filter.
        characterList.forEach(characterName => { // Melakukan perulangan pada setiap nama karakter.
            const button = document.createElement('button'); // Membuat elemen tombol.
            button.className = 'filter-btn'; // Menambahkan kelas CSS.
            button.dataset.filter = characterName; // Mengatur atribut data-filter.
            button.textContent = (characterName === 'all') ? 'Semua Karakter' : characterName; // Mengatur teks tombol.
            if (characterName === activeCharacterFilter) button.classList.add('active'); // Jika karakter adalah filter aktif, tambahkan kelas 'active'.
            characterFiltersContainer.appendChild(button); // Menambahkan tombol ke wadahnya.
        });
    }
    function clearElement(element) { // Mendefinisikan fungsi pembantu untuk membersihkan konten elemen.
        while (element.firstChild) { // Selama elemen memiliki anak.
            element.removeChild(element.firstChild); // Hapus anak pertama.
        }
    }
    function displayMessage(message, isError = false) { // Mendefinisikan fungsi pembantu untuk menampilkan pesan di grid.
        clearElement(grid); // Membersihkan grid.
        const p = document.createElement('p'); // Membuat elemen paragraf.
        p.textContent = message; // Mengatur teks pesan.
        if (isError) p.style.color = 'red'; // Jika itu pesan error, ubah warna teks menjadi merah.
        grid.appendChild(p); // Menambahkan paragraf ke grid.
    }
    initializePage(); // Memanggil fungsi `initializePage` untuk memulai semua proses.
}); // Akhir dari event listener.