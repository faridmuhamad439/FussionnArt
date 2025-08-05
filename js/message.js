// Ambil elemen target
const section = document.getElementById('sec');
const messageContainer = document.createElement('div');
messageContainer.id = "yaya";

// Buat elemen h2
const h2 = document.createElement('h2');
h2.textContent = 'Send Your Message';

// Buat form
const form = document.createElement('form');
// Mencegah form melakukan reload halaman saat disubmit
form.addEventListener('submit', function(event) {
    event.preventDefault();
});

// ===== Name =====
const labelName = document.createElement('label');
labelName.htmlFor = 'name'; // Praktik terbaik untuk aksesibilitas
labelName.textContent = 'Name :';

const inputName = document.createElement('input');
inputName.type = 'text';
inputName.id = 'name';
inputName.placeholder = 'Type Your Name';
// Menambahkan properti validasi
inputName.minLength = 3;
inputName.maxLength = 50;

// ===== Email =====
const labelEmail = document.createElement('label');
labelEmail.htmlFor = 'email';
labelEmail.textContent = 'Email :';

const inputEmail = document.createElement('input');
inputEmail.type = 'email';
inputEmail.id = 'email';
inputEmail.placeholder = 'Type Your Email';

// ===== Message =====
const labelMsg = document.createElement('label');
labelMsg.htmlFor = 'message';
labelMsg.textContent = 'Message :';

const textarea = document.createElement('textarea');
textarea.id = 'message'; // Beri id agar label berfungsi
textarea.rows = 5;
textarea.placeholder = 'Send Your Message';
// Menambahkan properti validasi
textarea.minLength = 10;
textarea.maxLength = 500;

// ===== Submit Button =====
const buttonm = document.createElement('button');
buttonm.type = 'submit';
buttonm.textContent = 'Submit';

// ===== Elemen untuk Pesan Error =====
// Kita buat elemen ini sekali saja dan akan kita gunakan nanti
const nameError = document.createElement('div');
nameError.className = 'error-message';

const msgError = document.createElement('div');
msgError.className = 'error-message';


// ----- LOGIKA VALIDASI DI SINI -----
buttonm.addEventListener('click', function (event) {
    // PENTING: Mencegah form dari perilaku default (misalnya, mengirim data dan refresh)
    event.preventDefault(); 
    
    // Reset pesan error setiap kali tombol diklik
    nameError.textContent = '';
    msgError.textContent = '';
    let isValid = true;

    // Ambil nilai input dan hapus spasi di awal/akhir
    const nameValue = inputName.value.trim();
    const messageValue = textarea.value.trim();
    
    // 1. Validasi Nama
    if (nameValue.length < inputName.minLength) {
        nameError.textContent = `Name must be at least ${inputName.minLength} characters.`;
        isValid = false;
    } else if (nameValue.length > inputName.maxLength) {
        nameError.textContent = `Name must be no more than ${inputName.maxLength} characters.`;
        isValid = false;
    }
    
    // 2. Validasi Pesan
    if (messageValue.length < textarea.minLength) {
        msgError.textContent = `Message must be at least ${textarea.minLength} characters.`;
        isValid = false;
    } else if (messageValue.length > textarea.maxLength) {
        msgError.textContent = `Message must be no more than ${textarea.maxLength} characters.`;
        isValid = false;
    }

    // Jika semua validasi lolos (isValid tetap true)
    if (isValid) {
        alert('TERIMA KASIH. PESAN ANDA SUDAH TERKIRIM!');
        // Opsional: kosongkan form setelah berhasil terkirim
        form.reset(); 
    }
});

// Gabungkan ke form
form.appendChild(labelName);
form.appendChild(inputName);
form.appendChild(nameError); // Tambahkan elemen error di bawah input nama

form.appendChild(labelEmail);
form.appendChild(inputEmail);

form.appendChild(labelMsg);
form.appendChild(textarea);
form.appendChild(msgError); // Tambahkan elemen error di bawah textarea

form.appendChild(buttonm);

// Gabungkan ke dalam container
messageContainer.appendChild(h2);
messageContainer.appendChild(form);
section.appendChild(messageContainer);