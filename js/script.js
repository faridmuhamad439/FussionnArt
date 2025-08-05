// --- Skrip untuk Hamburger Menu (asumsi dari script.js Anda) ---
const hamburger = document.getElementById("hamburger"); // Mengambil elemen tombol hamburger.
const navMenu = document.getElementById("navMenu"); // Mengambil elemen menu navigasi.
if (hamburger && navMenu) { // Memeriksa apakah kedua elemen tersebut ada di halaman.
    hamburger.addEventListener("click", () => { // Menambahkan event listener ke tombol hamburger.
        // Contoh logika sederhana, sesuaikan dengan implementasi Anda
        navMenu.classList.toggle("active"); // Mengalihkan (menambahkan/menghapus) kelas CSS "active" pada menu, yang akan menampilkan atau menyembunyikannya.
    });
}
//LOG OUT
// Menunggu semua elemen HTML dimuat
document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode setelah halaman HTML selesai dimuat.
    // 1. Cari elemen link Log Out berdasarkan ID yang kita buat
    const logoutButton = document.getElementById("logout-button"); // Mengambil elemen tombol logout.

    // 2. Pastikan elemen tersebut ada di halaman sebelum menambahkan aksi
    if (logoutButton) { // Memeriksa apakah tombol logout ditemukan.

        // 3. Tambahkan "pendengar" yang akan aktif saat link di-klik
        logoutButton.addEventListener('click', function (event) { // Menambahkan event listener saat tombol diklik.

            // 4. Mencegah link dari aksi default-nya (pindah halaman) untuk sementara
            event.preventDefault(); // Mencegah browser melakukan navigasi default.

            // 5. Tampilkan pesan konfirmasi (opsional, tapi disarankan)
            const confirmation = confirm("Apakah Anda yakin ingin keluar?"); // Menampilkan kotak dialog konfirmasi.

            // 6. Jika pengguna mengklik "OK" (true)
            if (confirmation) { // Jika konfirmasi berhasil.

                // 7. Hapus data sesi login dari penyimpanan browser
                localStorage.removeItem("loggedInUser"); // Menghapus item `loggedInUser` dari local storage.

                // 8. Beri notifikasi bahwa logout berhasil
                alert("Anda telah berhasil log out."); // Menampilkan pesan bahwa logout berhasil.

                // 9. Arahkan pengguna ke halaman index.html
                window.location.href = "../index.html"; // Mengarahkan pengguna kembali ke halaman utama.
            }
            // Jika pengguna mengklik "Cancel", tidak terjadi apa-apa
        });
    }
});
// back
// Menunggu semua elemen HTML dimuat
document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode setelah halaman HTML selesai dimuat.

    // 1. Cari elemen tombol kembali berdasarkan ID-nya
    const backButton = document.getElementById("back-button"); // Mengambil elemen tombol kembali.

    // 2. Pastikan tombolnya ada di halaman ini
    if (backButton) { // Memeriksa apakah tombol kembali ada.

        // 3. Tambahkan "pendengar" yang akan aktif saat tombol di-klik
        backButton.addEventListener('click', () => { // Menambahkan event listener saat tombol diklik.

            // 4. Perintahkan browser untuk kembali ke halaman sebelumnya
            history.back(); // Menggunakan API History untuk kembali ke halaman sebelumnya.
        });
    }
});
// --- Skrip untuk Memuat Pratinjau Galeri ---
document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode setelah halaman HTML selesai dimuat.
    const showcaseContainer = document.getElementById('image-showcase'); // Mengambil wadah untuk pratinjau gambar.

    if (showcaseContainer) { // Memeriksa apakah wadah pratinjau ada di halaman.
        fetch("https://api-galeri-anime.onrender.com/api/anime") // Melakukan permintaan API.
            .then(response => { // Menerima respons.
                if (!response.ok) throw new Error('Network response was not ok'); // Jika respons tidak OK, lemparkan error.
                return response.json(); // Mengubah respons menjadi JSON.
            })
            .then(data => { // Menerima data JSON.
                const previewImages = []; // Array kosong untuk menyimpan URL gambar pratinjau.
                // Ambil beberapa gambar acak untuk pratinjau
                data.slice(0, 6).forEach(anime => { // Melakukan perulangan pada 6 anime pertama.
                    if (anime.data && anime.data.length > 0) { // Memeriksa apakah data karakter tersedia.
                        const character = anime.data[0]; // Mengambil karakter pertama dari anime.
                        if (character.characterImage?.potrait?.[0]) { // Memeriksa apakah ada gambar potrait pertama.
                            previewImages.push(character.characterImage.potrait[0]); // Jika ada, tambahkan URL-nya ke array pratinjau.
                        } else if (character.characterImage?.landScape?.[0]) { // Jika tidak ada potrait, periksa apakah ada gambar landscape.
                            previewImages.push(character.characterImage.landScape[0]); // Jika ada, tambahkan URL-nya.
                        }
                    }
                });

                // Tampilkan gambar ke showcase
                previewImages.slice(0, 12).forEach(url => { // Melakukan perulangan pada maksimal 12 gambar pratinjau.
                    const item = document.createElement('div'); // Membuat elemen div untuk setiap item.
                    item.className = 'showcase-item'; // Menambahkan kelas CSS.
                    const img = document.createElement('img'); // Membuat elemen gambar.
                    img.src = url; // Mengatur sumber URL gambar.
                    img.loading = 'lazy'; // Mengaktifkan lazy loading.
                    item.appendChild(img); // Menambahkan gambar ke item.
                    showcaseContainer.appendChild(item); // Menambahkan item ke wadah pratinjau.
                });
            })
            .catch(error => { // Menangkap dan mengelola error.
                console.error('Error fetching gallery preview:', error); // Mencetak error ke konsol.
                showcaseContainer.textContent = 'Gagal memuat pratinjau galeri.'; // Menampilkan pesan error di wadah.
            });
    }
});

// theme
document.addEventListener('DOMContentLoaded', () => { // Menjalankan kode setelah halaman HTML selesai dimuat.

    const body = document.body; // Mengambil elemen body dari dokumen.
    // Theme Switcher Logic
    const themeMenu = document.getElementById('theme-menu'); // Mengambil menu tema.
    const themeSwitches = document.querySelectorAll('.theme-switch'); // Mengambil semua tombol pengubah tema.

    const setTheme = (theme) => { // Fungsi untuk mengatur tema.
        if (theme === 'light') { // Jika tema yang dipilih adalah 'light'.
            body.classList.add('light-theme'); // Menambahkan kelas 'light-theme' ke body.
        } else { // Jika tema yang dipilih bukan 'light' (misalnya 'dark').
            body.classList.remove('light-theme'); // Menghapus kelas 'light-theme' dari body.
        }
        localStorage.setItem('theme', theme); // Menyimpan tema yang dipilih di local storage.
    };

    themeSwitches.forEach(button => { // Melakukan perulangan pada setiap tombol tema.
        button.addEventListener('click', (e) => { // Menambahkan event listener saat tombol diklik.
            e.preventDefault(); // Mencegah aksi default.
            const selectedTheme = button.getAttribute('data-theme'); // Mendapatkan nilai tema dari atribut `data-theme`.
            setTheme(selectedTheme); // Memanggil fungsi untuk mengatur tema.
        });
    });

    // Mobile Dropdown Menus Toggle
    const setupMobileDropdown = (menuElement) => { // Fungsi untuk mengatur perilaku dropdown pada tampilan seluler.
        if (menuElement) { // Memeriksa apakah elemen menu ada.
            const menuLink = menuElement.querySelector('a'); // Mengambil link di dalam menu.
            menuLink.addEventListener('click', (e) => { // Menambahkan event listener saat link diklik.
                if (window.getComputedStyle(hamburger).display === 'block') { // Memeriksa apakah tombol hamburger terlihat (menandakan tampilan seluler).
                    e.preventDefault(); // Mencegah aksi default (misalnya, navigasi).
                    menuElement.classList.toggle('active'); // Mengalihkan kelas 'active' untuk menampilkan/menyembunyikan dropdown.
                }
            });
        }
    };
    setupMobileDropdown(themeMenu); // Menerapkan fungsi dropdown ke menu tema.

    // On page load, apply saved settings
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Mengambil tema yang tersimpan dari local storage, default-nya 'dark'.

    setTheme(savedTheme); // Menerapkan tema yang tersimpan saat halaman dimuat.

}); // Akhir dari event listener `DOMContentLoaded`.