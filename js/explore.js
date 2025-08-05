document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode di dalam fungsi ini setelah seluruh dokumen HTML selesai dimuat.

    let allImageData = []; // Variabel untuk menyimpan semua data gambar yang diekstrak dari API.
    let activeOrientationFilter = 'all'; // Variabel untuk melacak filter orientasi gambar yang sedang aktif (misalnya 'potrait', 'square', 'likes').
    let currentSearchTerm = ''; // Variabel untuk menyimpan kata kunci pencarian yang sedang aktif.
    let currentPage = 1; // Variabel untuk melacak halaman yang sedang ditampilkan, dimulai dari 1.
    const imagesPerPage = 30; // Konstanta yang menentukan jumlah gambar yang akan ditampilkan per halaman.

    const grid = document.getElementById('explore-character-grid'); // Mengambil elemen grid tempat gambar akan ditampilkan.
    const filterButtonsContainer = document.getElementById('orientation-filter-buttons'); // Mengambil wadah untuk tombol filter orientasi, like, dan favorit.
    const paginationContainer = document.getElementById('pagination-container'); // Mengambil wadah untuk elemen paginasi.
    const prevButton = document.getElementById('prev-button'); // Mengambil tombol "sebelumnya".
    const nextButton = document.getElementById('next-button'); // Mengambil tombol "berikutnya".
    const pageInfo = document.getElementById('page-info'); // Mengambil elemen untuk menampilkan informasi halaman.

    function initPage() { // Mendefinisikan fungsi utama untuk memulai pemuatan data.
        displayMessage('Memuat gambar, mohon tunggu...'); // Menampilkan pesan saat data sedang dimuat.
        fetch("https://api-galeri-anime.onrender.com/api/anime") // Melakukan permintaan ke API untuk mendapatkan semua data anime.
            .then(response => response.json()) // Mengubah respons menjadi objek JSON.
            .then(data => { // Menerima data JSON dari API.
                processApiData(data); // Memproses data API untuk mengekstrak gambar yang relevan.
                displayImages(); // Menampilkan gambar yang sudah diproses.
            })
            .catch(error => { // Menangkap dan mengelola kesalahan jika permintaan API gagal.
                displayMessage(`Gagal memuat data: ${error.message}`, true); // Menampilkan pesan kesalahan.
            });
    }

    function displayImages() { // Mendefinisikan fungsi untuk menampilkan gambar berdasarkan filter dan pencarian.
        clearGrid(); // Membersihkan grid dari gambar-gambar sebelumnya.
        let filteredImages = allImageData; // Membuat salinan array gambar untuk disaring.

        if (currentSearchTerm) { // Memeriksa apakah ada kata kunci pencarian.
            const searchTerm = currentSearchTerm.toLowerCase(); // Mengubah kata kunci pencarian menjadi huruf kecil.
            filteredImages = filteredImages.filter(image => // Menyaring gambar yang judul anime atau nama karakternya cocok dengan kata kunci.
                image.animeTitle.toLowerCase().includes(searchTerm) ||
                image.characterName.toLowerCase().includes(searchTerm)
            );
        }

        const loggedInUser = localStorage.getItem("loggedInUser"); // Mendapatkan nama pengguna yang sedang masuk dari localStorage.
        if (activeOrientationFilter === 'likes') { // Memeriksa apakah filter 'likes' sedang aktif.
            const likes = JSON.parse(localStorage.getItem(`likedImages_${loggedInUser}`) || '[]'); // Mengambil daftar gambar yang disukai dari localStorage.
            filteredImages = filteredImages.filter(image => likes.includes(image.imageUrl)); // Menyaring gambar untuk hanya menampilkan yang ada di daftar 'likes'.
        } else if (activeOrientationFilter === 'favorites') { // Memeriksa apakah filter 'favorites' sedang aktif.
            const favorites = JSON.parse(localStorage.getItem(`favoritedImages_${loggedInUser}`) || '[]'); // Mengambil daftar gambar favorit dari localStorage.
            filteredImages = filteredImages.filter(image => favorites.includes(image.imageUrl)); // Menyaring gambar untuk hanya menampilkan yang ada di daftar 'favorites'.
        } else if (activeOrientationFilter !== 'all') { // Memeriksa apakah filter orientasi (selain 'all', 'likes', 'favorites') sedang aktif.
            filteredImages = filteredImages.filter(image => image.orientation === activeOrientationFilter); // Menyaring gambar berdasarkan orientasi.
        }

        setupPagination({ // Memanggil fungsi paginasi (dari file lain) untuk mengatur navigasi halaman.
            container: paginationContainer, // Wadah untuk tombol paginasi.
            prevButton: prevButton, // Tombol "sebelumnya".
            nextButton: nextButton, // Tombol "berikutnya".
            pageInfo: pageInfo, // Elemen untuk menampilkan nomor halaman.
            currentPage: currentPage, // Halaman saat ini.
            totalItems: filteredImages.length, // Total gambar yang tersedia setelah difilter.
            itemsPerPage: imagesPerPage, // Jumlah gambar per halaman.
            onPageChange: (newPage) => { // Fungsi callback yang dijalankan saat pengguna berpindah halaman.
                currentPage = newPage; // Memperbarui halaman saat ini.
                displayImages(); // Memanggil kembali `displayImages` untuk menampilkan halaman baru.
            }
        });

        const startIndex = (currentPage - 1) * imagesPerPage; // Menghitung indeks awal gambar untuk halaman saat ini.
        const paginatedImages = filteredImages.slice(startIndex, startIndex + imagesPerPage); // Mengambil subset gambar untuk halaman saat ini.

        if (paginatedImages.length === 0) { // Jika tidak ada gambar yang ditemukan setelah paginasi.
            displayMessage('Tidak ada gambar yang cocok dengan kriteria Anda.'); // Menampilkan pesan bahwa tidak ada gambar yang cocok.
            return; // Hentikan eksekusi fungsi.
        }

        paginatedImages.forEach(image => { // Melakukan perulangan untuk setiap gambar di halaman saat ini.
            const item = document.createElement('div'); // Membuat elemen div sebagai wadah untuk setiap gambar.
            item.className = 'character-item'; // Menambahkan kelas CSS.
            const img = document.createElement('img'); // Membuat elemen img.
            img.src = image.imageUrl; // Mengatur URL gambar.
            img.alt = image.characterName; // Mengatur teks alternatif.
            img.loading = 'lazy'; // Mengaktifkan lazy loading untuk performa.
            const infoDiv = document.createElement('div'); // Membuat div untuk informasi gambar.
            infoDiv.className = 'item-info'; // Menambahkan kelas CSS.
            const charNameDiv = document.createElement('div'); // Membuat div untuk nama karakter.
            charNameDiv.className = 'info-char'; // Menambahkan kelas CSS.
            charNameDiv.textContent = image.characterName; // Mengisi div dengan nama karakter.
            const animeNameDiv = document.createElement('div'); // Membuat div untuk nama anime.
            animeNameDiv.className = 'info-anime'; // Menambahkan kelas CSS.
            animeNameDiv.textContent = image.animeTitle; // Mengisi div dengan judul anime.
            infoDiv.appendChild(charNameDiv); // Menambahkan nama karakter ke infoDiv.
            infoDiv.appendChild(animeNameDiv); // Menambahkan judul anime ke infoDiv.
            item.appendChild(img); // Menambahkan gambar ke item.
            item.appendChild(infoDiv); // Menambahkan infoDiv ke item.
            item.addEventListener('click', () => { // Menambahkan event listener saat item gambar diklik.
                if (window.openModal) { // Memeriksa apakah fungsi `openModal` tersedia di lingkup global.
                    window.openModal(image.imageUrl); // Jika ada, panggil fungsi untuk membuka modal dengan gambar yang diklik.
                }
            });
            grid.appendChild(item); // Menambahkan item gambar ke grid.
        });
    }

    filterButtonsContainer.addEventListener('click', (e) => { // Menambahkan event listener ke wadah tombol filter.
        if (e.target.matches('button[data-filter]')) { // Memeriksa apakah elemen yang diklik adalah tombol filter.
            currentPage = 1; // Mengatur ulang halaman ke 1 saat filter baru dipilih.
            activeOrientationFilter = e.target.dataset.filter; // Mengatur filter orientasi yang aktif berdasarkan atribut `data-filter`.
            filterButtonsContainer.querySelector('.active')?.classList.remove('active'); // Menghapus kelas 'active' dari tombol yang sebelumnya aktif.
            e.target.classList.add('active'); // Menambahkan kelas 'active' ke tombol yang baru diklik.
            displayImages(); // Memanggil fungsi `displayImages` untuk menampilkan gambar dengan filter baru.
        }
    });

    // ===============================================
    // PERUBAHAN: Menggunakan modul search.js
    // ===============================================
    // Panggil fungsi dari search.js, berikan ID input dan fungsi callback-nya.
    initializeSearch('explore-search-input', (searchTerm) => { // Memanggil fungsi `initializeSearch` untuk mengelola input pencarian.
        // Logika ini akan dijalankan setiap kali pengguna mengetik di explore.html.
        currentPage = 1; // Mengatur ulang halaman ke 1 setiap kali ada pencarian baru.
        currentSearchTerm = searchTerm; // Menyimpan kata kunci pencarian baru.
        displayImages(); // Memanggil fungsi untuk menampilkan gambar yang sudah disaring.
    });

    function processApiData(apiData) { // Mendefinisikan fungsi pembantu untuk memproses data API.
        const processedData = []; // Array sementara untuk menyimpan data gambar yang telah diproses.
        const filteredAnime = apiData.filter(anime => anime.id >= 1 && anime.id <= 11); // Menyaring data anime berdasarkan ID tertentu.
        filteredAnime.forEach(anime => { // Melakukan perulangan pada setiap anime yang sudah disaring.
            if (!anime.data) return; // Jika tidak ada data karakter, lewati.
            anime.data.forEach(character => { // Melakukan perulangan pada setiap karakter dari anime tersebut.
                if (!character.characterImage) return; // Jika tidak ada gambar karakter, lewati.
                const addImage = (url, orientation) => { // Fungsi pembantu untuk menambahkan objek gambar ke array.
                    if (url) processedData.push({ imageUrl: url, orientation, characterName: character.characterName, animeTitle: anime.title });
                };
                character.characterImage.potrait?.forEach(url => addImage(url, 'potrait')); // Menambahkan semua gambar potrait.
                character.characterImage.square?.forEach(url => addImage(url, 'square')); // Menambahkan semua gambar square.
                character.characterImage.landScape?.forEach(url => addImage(url, 'landScape')); // Menambahkan semua gambar landscape.
            });
        });
        allImageData = processedData; // Mengisi array utama dengan data gambar yang sudah diproses.
    }
    function clearGrid() { // Mendefinisikan fungsi pembantu untuk menghapus semua anak elemen dari grid.
        while (grid.firstChild) { // Selama grid memiliki anak.
            grid.removeChild(grid.firstChild); // Hapus anak pertamanya.
        }
    }
    function displayMessage(message, isError = false) { // Mendefinisikan fungsi pembantu untuk menampilkan pesan di grid.
        clearGrid(); // Membersihkan grid.
        const p = document.createElement('p'); // Membuat elemen paragraf.
        p.textContent = message; // Mengatur teks pesan.
        if (isError) p.style.color = 'red'; // Jika pesan error, ubah warna teks menjadi merah.
        grid.appendChild(p); // Menambahkan paragraf ke grid.
    }

    initPage(); // Memanggil fungsi `initPage` untuk memulai semua proses saat skrip dimuat.
}); // Mengakhiri event listener `DOMContentLoaded`.