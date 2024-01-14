// Fungsi untuk memeriksa apakah pengguna telah login (token ada dan valid)
function isAuthenticated() {
    const token = getCookie('token'); // Ganti 'token' dengan nama cookie yang sesuai

    // Lakukan validasi token (contoh validasi sederhana)
    if (token) {
        // Lakukan validasi lebih lanjut jika diperlukan
        return true;
    }

    return false;
}

// Fungsi untuk mendapatkan nilai dari cookie berdasarkan nama
function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const [cookieName, cookieValue] = cookie.split('=');

        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

// Contoh penggunaan pada halaman tertentu
if (!isAuthenticated()) {
    // Redirect atau tampilkan pesan kesalahan jika pengguna belum login
    window.location.href = 'index.html'; // Ganti dengan halaman login yang sesuai
}

// Fungsi untuk menghapus token dari cookie
function clearAuthToken() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// Fungsi untuk logout
function logout() {
    // Hapus token dari cookie
    clearAuthToken();

    // Redirect ke halaman login
    window.location.href = 'index.html'; // Ganti dengan halaman login yang sesuai
}

// Menambahkan event listener pada button logout
document.getElementById('logoutBtn').addEventListener('click', logout);