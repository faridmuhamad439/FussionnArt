// ===============================================
//           KODE BERSAMA UNTUK MODAL
//         (Disimpan sebagai modal.js)
// ===============================================

// Variabel ini akan diakses oleh skrip lain (explore.js & anime.js)
let currentModalImageUrl = null; // Menyimpan URL gambar yang sedang ditampilkan di modal.

document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode setelah dokumen HTML selesai dimuat.
    // Referensi Elemen DOM Modal
    const modal = document.getElementById("image-modal"); // Mengambil elemen modal.
    // Jika tidak ada modal di halaman ini, hentikan eksekusi skrip
    if (!modal) return; // Menghentikan skrip jika elemen modal tidak ditemukan di halaman.

    const modalImg = document.getElementById("modal-image"); // Mengambil elemen gambar di dalam modal.
    const closeBtn = document.querySelector(".close"); // Mengambil tombol "tutup" modal.
    const modalLikeBtn = document.getElementById("modal-like-btn"); // Mengambil tombol "Suka" di modal.
    const modalFavoriteBtn = document.getElementById("modal-favorite-btn"); // Mengambil tombol "Favorit" di modal.
    const downloadBtn = document.getElementById("modal-download-btn"); // Mengambil tombol "Unduh" di modal.

    const loggedInUser = localStorage.getItem("loggedInUser"); // Mengambil nama pengguna yang sedang login dari local storage.

    // Fungsi Helper untuk Local Storage
    function getLikes() { return JSON.parse(localStorage.getItem(`likedImages_${loggedInUser}`) || '[]'); } // Fungsi untuk mendapatkan daftar gambar yang disukai dari local storage.
    function saveLikes(likesArray) { localStorage.setItem(`likedImages_${loggedInUser}`, JSON.stringify(likesArray)); } // Fungsi untuk menyimpan daftar gambar yang disukai ke local storage.
    function getFavorites() { return JSON.parse(localStorage.getItem(`favoritedImages_${loggedInUser}`) || '[]'); } // Fungsi untuk mendapatkan daftar gambar favorit dari local storage.
    function saveFavorites(favoritesArray) { localStorage.setItem(`favoritedImages_${loggedInUser}`, JSON.stringify(favoritesArray)); } // Fungsi untuk menyimpan daftar gambar favorit ke local storage.

    // Fungsi untuk memperbarui status tombol Suka/Favorit di dalam modal
    // Dibuat global agar bisa dipanggil dari explore.js dan anime.js
    window.updateModalButtonStates = function () { // Fungsi global untuk memperbarui tampilan tombol suka dan favorit.
        if (!currentModalImageUrl) return; // Jika tidak ada URL gambar, hentikan fungsi.
        const likes = getLikes(); // Mendapatkan daftar gambar yang disukai.
        const favorites = getFavorites(); // Mendapatkan daftar gambar favorit.

        modalLikeBtn.textContent = likes.includes(currentModalImageUrl) ? '❤️ Liked' : '🤍 Like'; // Mengubah teks tombol suka berdasarkan status.
        modalLikeBtn.classList.toggle('liked', likes.includes(currentModalImageUrl)); // Menambahkan atau menghapus kelas 'liked' untuk gaya visual.

        modalFavoriteBtn.textContent = favorites.includes(currentModalImageUrl) ? '🌟 Favorited' : '⭐ Favorite'; // Mengubah teks tombol favorit.
        modalFavoriteBtn.classList.toggle('favorited', favorites.includes(currentModalImageUrl)); // Menambahkan atau menghapus kelas 'favorited'.
    }

    // Fungsi untuk membuka modal, dibuat global
    window.openModal = function (imageUrl) { // Fungsi global untuk membuka modal dengan gambar tertentu.
        currentModalImageUrl = imageUrl; // Menyimpan URL gambar yang akan ditampilkan.
        modalImg.src = imageUrl; // Mengatur sumber gambar modal.
        modal.style.display = "flex"; // Menampilkan modal.
        window.updateModalButtonStates(); // Memperbarui status tombol suka dan favorit.
    }

    // --- Event Listeners untuk Tombol di Dalam Modal ---
    closeBtn.onclick = () => { modal.style.display = "none"; }; // Mengatur event saat tombol 'tutup' diklik.
    window.addEventListener('click', (e) => { if (e.target == modal) modal.style.display = "none"; }); // Menutup modal jika area di luar modal diklik.

    modalLikeBtn.addEventListener('click', () => { // Menambahkan event listener ke tombol "Suka".
        if (!loggedInUser) { alert("Anda harus login untuk menyukai gambar."); window.location.href = "regist.html"; return; } // Meminta login jika pengguna belum login.
        let likes = getLikes(); // Mendapatkan daftar yang disukai.
        likes.includes(currentModalImageUrl) ? likes = likes.filter(url => url !== currentModalImageUrl) : likes.push(currentModalImageUrl); // Menambahkan atau menghapus gambar dari daftar 'likes'.
        saveLikes(likes); // Menyimpan daftar yang diperbarui.
        window.updateModalButtonStates(); // Memperbarui tampilan tombol.
    });

    modalFavoriteBtn.addEventListener('click', () => { // Menambahkan event listener ke tombol "Favorit".
        if (!loggedInUser) { alert("Anda harus login untuk memfavoritkan gambar."); window.location.href = "regist.html"; return; } // Meminta login jika pengguna belum login.
        let favorites = getFavorites(); // Mendapatkan daftar favorit.
        favorites.includes(currentModalImageUrl) ? favorites = favorites.filter(url => url !== currentModalImageUrl) : favorites.push(currentModalImageUrl); // Menambahkan atau menghapus gambar dari daftar 'favorites'.
        saveFavorites(favorites); // Menyimpan daftar yang diperbarui.
        window.updateModalButtonStates(); // Memperbarui tampilan tombol.
    });

    downloadBtn.addEventListener('click', () => { alert('Gagal mengunduh file. Kemungkinan besar karena kebijakan keamanan server (CORS). Coba klik kanan dan "Simpan Gambar Sebagai...".'); }); // Menampilkan pesan peringatan saat tombol "Unduh" diklik.


}); // Menutup event listener `DOMContentLoaded`.