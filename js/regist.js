document.addEventListener("DOMContentLoaded", function () { // Menjalankan semua kode di dalamnya setelah halaman HTML selesai dimuat.

    // --- Bagian 1: Referensi ke semua elemen penting ---
    const loginSection = document.getElementById("loginSection"); // Mengambil elemen bagian login.
    const registerSection = document.getElementById("registerSection"); // Mengambil elemen bagian registrasi.
    const loginForm = document.getElementById("loginForm"); // Mengambil elemen form login.
    const registerForm = document.getElementById("registerForm"); // Mengambil elemen form registrasi.
    const showRegisterLink = document.getElementById("showRegisterLink"); // Mengambil link untuk beralih ke form registrasi.
    const showLoginLink = document.getElementById("showLoginLink"); // Mengambil link untuk beralih ke form login.

    // --- Bagian 2: Logika untuk beralih antar form ---
    showRegisterLink.addEventListener("click", function (e) { // Menambahkan event listener saat link "Daftar" diklik.
        e.preventDefault(); // Mencegah link berpindah halaman.
        loginSection.classList.add("hidden"); // Menambahkan kelas CSS "hidden" untuk menyembunyikan form login.
        registerSection.classList.remove("hidden"); // Menghapus kelas "hidden" untuk menampilkan form registrasi.
    });

    showLoginLink.addEventListener("click", function (e) { // Menambahkan event listener saat link "Masuk" diklik.
        e.preventDefault(); // Mencegah link berpindah halaman.
        registerSection.classList.add("hidden"); // Menyembunyikan form registrasi.
        loginSection.classList.remove("hidden"); // Menampilkan form login.
    });

    // --- Bagian 3: Logika untuk form registrasi ---
    registerForm.addEventListener("submit", function (e) { // Menambahkan event listener saat form registrasi di-submit.
        e.preventDefault(); // Mencegah form melakukan pengiriman data default (reload halaman).
        const username = document.getElementById("regUsername").value; // Mengambil nilai dari input username registrasi.
        const password = document.getElementById("regPassword").value; // Mengambil nilai dari input password registrasi.

        if (localStorage.getItem(username)) { // Memeriksa apakah username sudah ada di local storage.
            alert("Username sudah terdaftar! Silakan gunakan username lain."); // Jika sudah ada, tampilkan pesan peringatan.
        } else {
            localStorage.setItem(username, JSON.stringify({ password: password })); // Jika belum, simpan data pengguna (username sebagai kunci, password sebagai nilai objek JSON) di local storage.
            alert("Registrasi berhasil! Silakan login."); // Tampilkan pesan sukses.
            registerForm.reset(); // Mengosongkan input form registrasi.
            // Otomatis pindah ke form login setelah berhasil daftar
            registerSection.classList.add("hidden"); // Sembunyikan form registrasi.
            loginSection.classList.remove("hidden"); // Tampilkan form login.
        }
    });

    // --- Bagian 4: Logika untuk form login ---
    loginForm.addEventListener("submit", function (e) { // Menambahkan event listener saat form login di-submit.
        e.preventDefault(); // Mencegah form melakukan pengiriman data default.
        const username = document.getElementById("loginUsername").value; // Mengambil nilai dari input username login.
        const password = document.getElementById("loginPassword").value; // Mengambil nilai dari input password login.
        const userDataString = localStorage.getItem(username); // Mengambil data pengguna dari local storage berdasarkan username.

        if (!userDataString) { // Memeriksa apakah data pengguna tidak ditemukan.
            alert("Username tidak ditemukan."); // Jika tidak ada, tampilkan pesan peringatan.
        } else {
            const user = JSON.parse(userDataString); // Mengurai data JSON yang disimpan di local storage.
            if (user.password !== password) { // Memeriksa apakah password yang dimasukkan tidak cocok.
                alert("Password salah."); // Jika tidak cocok, tampilkan pesan peringatan.
            } else {
                alert("Login berhasil!"); // Tampilkan pesan sukses.
                localStorage.setItem("loggedInUser", username); // Menyimpan username sebagai pengguna yang sedang login.
                // Arahkan ke halaman utama setelah berhasil login
                window.location.href = "/html/home.html"; // Mengarahkan pengguna ke halaman utama.
            }
        }
    });
}); // Mengakhiri event listener `DOMContentLoaded`.