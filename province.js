document.addEventListener('DOMContentLoaded', function () {
    // Memuat daftar provinsi saat halaman dimuat
    loadProvinceList();

    // Menambahkan event listener untuk form tambah provinsi
    const addProvinceForm = document.getElementById('addProvinceForm');
    addProvinceForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addProvince();
    });

    // Menambahkan event listener untuk daftar provinsi (untuk menghandle delete)
    const provinceTableBody = document.getElementById('provinceTableBody');
    provinceTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('deleteBtn')) {
            const provinceId = event.target.getAttribute('data-id');
            deleteProvince(provinceId);
        }
    });
});

// Fungsi untuk Memuat Daftar Provinsi
function loadProvinceList() {
    fetch('https://be.indoculturalfinder.my.id/api/provinces')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                displayProvinceList(data.provinces);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Fungsi untuk Menampilkan Daftar Provinsi dalam Tabel
function displayProvinceList(provinces) {
    const provinceTableBody = document.getElementById('provinceTableBody');
    provinceTableBody.innerHTML = '';

    const itemsPerPage = 10;
    let currentPage = 1;

    const renderPage = (pageNumber) => {
        provinceTableBody.innerHTML = '';

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const displayedProvinces = provinces.slice(startIndex, endIndex);

        displayedProvinces.forEach((province, index) => {
            const row = provinceTableBody.insertRow();
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${province.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm deleteBtn" data-id="${province.id}">Hapus</button>
                    <button class="btn btn-warning btn-sm editBtn" data-id="${province.id}">Edit</button>
                </td>
            `;
        });
    };

    const totalPages = Math.ceil(provinces.length / itemsPerPage);

    // Initial rendering
    renderPage(currentPage);

    // Event listener for next page
    const nextProvincePage = document.getElementById('nextProvincePage');
    nextProvincePage.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Event listener for previous page
    const prevProvincePage = document.getElementById('prevProvincePage');
    prevProvincePage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    // Event listener for Edit button
    provinceTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('editBtn')) {
            const provinceId = event.target.getAttribute('data-id');
            openEditProvinceModal(provinceId);
        }
    });
}

function openEditProvinceModal(provinceId) {
    const editForm = document.getElementById('editProvinceForm');

    // Dapatkan data provinsi berdasarkan ID dari endpoint atau penyimpanan lokal
    fetch(`https://be.indoculturalfinder.my.id/api/provinces/${provinceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                // Isi formulir edit dengan data provinsi yang diterima
                const province = data.provinces;
                editForm.innerHTML = `
                    <input type="hidden" name="provinceId" value="${province.id}">
                    <div class="mb-3">
                        <label for="editProvinceName" class="form-label">Nama Provinsi</label>
                        <input type="text" class="form-control" name="editProvinceName" value="${province.name}">
                    </div>
                    <div class="mb-3">
                        <button type="submit" class="btn btn-primary">Perbarui</button>
                    </div>
                `;

                // Tambahkan event listener untuk form edit
                editForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    updateProvinceData(this);
                });
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));

    // Buka modal edit
    $('#editProvinceModal').modal('show');
}


function updateProvinceData(form) {
    const formData = new FormData(form);

    fetch(`https://be.indoculturalfinder.my.id/api/provinces/${formData.get('provinceId')}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.get('editProvinceName') }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            alert('Data berhasil diperbarui!');
            // Refresh daftar provinsi setelah mengupdate
            loadProvinceList();
            // Tutup modal
            $('#editProvinceModal').modal('hide');
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}


// Fungsi untuk Menambah Provinsi Baru
function addProvince() {
    const provinceName = document.getElementById('provinceName').value;

    fetch('https://be.indoculturalfinder.my.id/api/provinces', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: provinceName }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            // Refresh daftar provinsi setelah menambahkan baru
            alert('Data berhasil ditambahkan!');
            loadProvinceList();
            // Bersihkan input setelah submit
            document.getElementById('provinceName').value = '';
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Fungsi untuk Menghapus Provinsi
function deleteProvince(provinceId) {
    // Show a confirmation dialog
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus data?');

    if (confirmDelete) {
        fetch(`https://be.indoculturalfinder.my.id/api/provinces/${provinceId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert('Data berhasil dihapus!');
                // Refresh daftar provinsi setelah menghapus
                loadProvinceList();
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}
