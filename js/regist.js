document.addEventListener("DOMContentLoaded", function () {

    // --- Bagian 1: Fungsi untuk Membuat Elemen ---
    // Fungsi pembantu untuk membuat input field dengan label
    function createFormField(labelText, inputId, inputType, isRequired = true) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        if (isRequired) {
            input.required = true;
        }

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        return { formGroup, input }; // Kembalikan input untuk bisa diakses nanti
    }

    // --- Bagian 2: Membuat Semua Elemen Form dengan JavaScript ---

    // Buat container utama
    const container = document.createElement('div');
    container.className = 'container';

    // === BUAT BAGIAN LOGIN ===
    const loginSection = document.createElement('div');
    loginSection.id = 'loginSection';

    const loginForm = document.createElement('form');
    loginForm.id = 'loginForm';

    const loginTitle = document.createElement('h2');
    loginTitle.textContent = 'Login';

    // Buat field username dan password untuk login
    const loginUsernameField = createFormField('Username:', 'loginUsername', 'text');
    const loginPasswordField = createFormField('Password:', 'loginPassword', 'password');
    // Tambahkan validasi min/max length
    loginUsernameField.input.minLength = 3;
    loginUsernameField.input.maxLength = 10;
    loginPasswordField.input.minLength = 3;
    loginPasswordField.input.maxLength = 10;

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.className = 'login';
    loginButton.textContent = 'Masuk';

    const pSwitchToRegister = document.createElement('p');
    pSwitchToRegister.className = 'switch-form';
    pSwitchToRegister.textContent = 'Belum punya akun? ';

    const showRegisterLink = document.createElement('a');
    showRegisterLink.id = 'showRegisterLink';
    showRegisterLink.textContent = 'Daftar di sini';
    pSwitchToRegister.appendChild(showRegisterLink);

    // Gabungkan semua elemen login
    loginForm.appendChild(loginTitle);
    loginForm.appendChild(loginUsernameField.formGroup);
    loginForm.appendChild(loginPasswordField.formGroup);
    loginForm.appendChild(loginButton);
    loginSection.appendChild(loginForm);
    loginSection.appendChild(pSwitchToRegister);

    // === BUAT BAGIAN REGISTRASI ===
    const registerSection = document.createElement('div');
    registerSection.id = 'registerSection';
    registerSection.className = 'hidden'; // Awalnya disembunyikan

    const registerForm = document.createElement('form');
    registerForm.id = 'registerForm';

    const registerTitle = document.createElement('h2');
    registerTitle.textContent = 'Registrasi';

    // Buat field username dan password untuk registrasi
    const regUsernameField = createFormField('Username Baru:', 'regUsername', 'text');
    const regPasswordField = createFormField('Password Baru:', 'regPassword', 'password');
     // Tambahkan validasi min/max length
    regUsernameField.input.minLength = 3;
    regUsernameField.input.maxLength = 10;
    regPasswordField.input.minLength = 3;
    regPasswordField.input.maxLength = 10;

    const registerButton = document.createElement('button');
    registerButton.type = 'submit';
    registerButton.className = 'login';
    registerButton.textContent = 'Daftar';

    const pSwitchToLogin = document.createElement('p');
    pSwitchToLogin.className = 'switch-form';
    pSwitchToLogin.textContent = 'Sudah punya akun? ';

    const showLoginLink = document.createElement('a');
    showLoginLink.id = 'showLoginLink';
    showLoginLink.textContent = 'Masuk di sini';
    pSwitchToLogin.appendChild(showLoginLink);

    // Gabungkan semua elemen registrasi
    registerForm.appendChild(registerTitle);
    registerForm.appendChild(regUsernameField.formGroup);
    registerForm.appendChild(regPasswordField.formGroup);
    registerForm.appendChild(registerButton);
    registerSection.appendChild(registerForm);
    registerSection.appendChild(pSwitchToLogin);


    // --- Bagian 3: Tambahkan Event Listeners (Logika dari regist.js lama) ---

    // Logika untuk beralih antar form
    showRegisterLink.addEventListener("click", function (e) {
        e.preventDefault();
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
        registerSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });

    // Logika untuk form registrasi
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // Akses nilai langsung dari elemen input yang sudah kita simpan
        const username = regUsernameField.input.value;
        const password = regPasswordField.input.value;

        if (localStorage.getItem(username)) {
            alert("Username sudah terdaftar! Silakan gunakan username lain.");
        } else {
            localStorage.setItem(username, JSON.stringify({ password: password }));
            alert("Registrasi berhasil! Silakan login.");
            registerForm.reset();
            // Otomatis pindah ke form login
            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        }
    });

    // Logika untuk form login
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = loginUsernameField.input.value;
        const password = loginPasswordField.input.value;
        const userDataString = localStorage.getItem(username);

        if (!userDataString) {
            alert("Username tidak ditemukan.");
        } else {
            const user = JSON.parse(userDataString);
            if (user.password !== password) {
                alert("Password salah.");
            } else {
                alert("Login berhasil!");
                localStorage.setItem("loggedInUser", username);
                window.location.href = "../html/home.html";
            }
        }
    });


    // --- Bagian 4: Masukkan Form yang Sudah Dibuat ke dalam Halaman HTML ---

    // Gabungkan bagian login dan registrasi ke container utama
    container.appendChild(loginSection);
    container.appendChild(registerSection);

    // Cari wadah di HTML dan masukkan container ke dalamnya
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        formContainer.appendChild(container);
    } else {
        // Jika tidak ada wadah, tambahkan langsung ke body sebagai fallback
        document.body.appendChild(container);
    }
});