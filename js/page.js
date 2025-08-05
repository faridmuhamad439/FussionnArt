function setupPagination(options) { // Mendefinisikan fungsi bernama `setupPagination` yang menerima satu objek `options`.
    const { // Menggunakan destructuring untuk mengekstrak properti dari objek `options`.
        container, // Elemen DOM yang menjadi wadah untuk paginasi.
        prevButton, // Tombol "sebelumnya".
        nextButton, // Tombol "berikutnya".
        pageInfo, // Elemen untuk menampilkan informasi halaman (contoh: "Halaman 1 dari 5").
        currentPage, // Nomor halaman saat ini.
        totalItems, // Total keseluruhan item yang akan dibagi menjadi beberapa halaman.
        itemsPerPage, // Jumlah item yang ditampilkan per halaman.
        onPageChange // Fungsi callback yang akan dipanggil saat halaman berubah.
    } = options;

    if (!container || !prevButton || !nextButton || !pageInfo) { // Melakukan validasi untuk memastikan semua elemen DOM yang dibutuhkan ada.
        return; // Jika ada yang tidak ada, hentikan eksekusi fungsi.
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage); // Menghitung total halaman yang diperlukan. `Math.ceil` memastikan halaman yang tidak penuh dihitung sebagai satu halaman penuh.

    if (totalPages > 1) { // Memeriksa apakah ada lebih dari satu halaman. Jika tidak, paginasi tidak diperlukan.
        container.style.display = 'flex'; // Menampilkan wadah paginasi.
        pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`; // Mengatur teks yang menampilkan informasi halaman saat ini.
        prevButton.disabled = currentPage === 1; // Menonaktifkan tombol "sebelumnya" jika pengguna berada di halaman pertama.
        nextButton.disabled = currentPage === totalPages; // Menonaktifkan tombol "berikutnya" jika pengguna berada di halaman terakhir.

        prevButton.onclick = () => { // Menambahkan event listener ke tombol "sebelumnya" saat diklik.
            if (currentPage > 1) onPageChange(currentPage - 1); // Jika bukan halaman pertama, panggil fungsi `onPageChange` dengan nomor halaman sebelumnya.
        };
        nextButton.onclick = () => { // Menambahkan event listener ke tombol "berikutnya" saat diklik.
            if (currentPage < totalPages) onPageChange(currentPage + 1); // Jika bukan halaman terakhir, panggil fungsi `onPageChange` dengan nomor halaman berikutnya.
        };
    } else {
        container.style.display = 'none'; // Jika hanya ada satu halaman atau kurang, sembunyikan wadah paginasi.
    }
} // Akhir dari fungsi `setupPagination`.