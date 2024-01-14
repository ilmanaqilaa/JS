// File: admin.js
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

const itemsPerPage = 10;
let currentPage = 1;
let totalPages = 0; 

function fetchData() {
    fetch('https://be.indoculturalfinder.my.id/api/cultures')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const totalItems = data.Cultures.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                displayData(data.Cultures.slice(0, itemsPerPage));
                attachDeleteEventListeners();
                attachDetailEventListeners();
                attachEditEventListeners();
                createPagination(totalPages);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function attachDetailEventListeners() {
    const detailButtons = document.querySelectorAll('.btn-detail');
    detailButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const cultureId = this.getAttribute('data-id');
            openDetailModal(cultureId);
        });
    });
}

function openDetailModal(cultureId) {
    fetch(`https://be.indoculturalfinder.my.id/api/cultures/${cultureId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const culture = data.cultures;
                const detailContent = document.getElementById('detailContent');
                detailContent.innerHTML = `
                    <h5 class="mb-3">${culture.name}</h5>
                    <div class="d-flex justify-content-between mb-3">
                        <div style="flex: 1; margin-right: 10px;">
                            <img src="${culture.img}" alt="${culture.name}" class="img-fluid" style="width: auto; height: auto;">
                        </div>
                        <div style="flex: 1;">
                            <div class="embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src="${culture.video}" allowfullscreen style="width: auto; height: auto;"></iframe>
                            </div>
                        </div>
                    </div>
                    <p class="mb-2"><strong>Provinsi:</strong> ${culture.province_name}</p>
                    <p class="mb-2"><strong>Kategori Budaya:</strong> ${culture.category_name}</p>
                    <p class="mb-2"><strong>Deskripsi:</strong> ${culture.desc}</p>
                `;
                $('#detailModal').modal('show');
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}



function displayData(cultures, startIndex) {
    const tableBody = document.querySelector('#cultureTable tbody');
    tableBody.innerHTML = '';

    cultures.forEach((culture, index) => {
        const row = tableBody.insertRow();
        const rowNumber = startIndex + index + 1; // Nomor dihitung mulai dari startIndex + 1
        row.innerHTML = `
            <td>${rowNumber}</td>
            <td>${culture.province_name}</td>
            <td>${culture.category_name}</td>
            <td>${culture.name}</td>
            <td>
                <a href="#" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${culture.id}">Edit</a>
                <a class="btn btn-danger btn-sm" data-id="${culture.id}">Del</a>
                <a href="#" class="btn btn-primary btn-sm btn-detail" data-id="${culture.id}">Detail</a>
            </td>
        `;
    });

    attachDetailEventListeners(); 
}


function createPagination(totalPages) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    prevPageBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    nextPageBtn.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });

    updatePage();
}

function updatePage() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    if (currentPage === 1) {
        prevPageBtn.classList.add('disabled');
    } else {
        prevPageBtn.classList.remove('disabled');
    }

    if (currentPage === totalPages) {
        nextPageBtn.classList.add('disabled');
    } else {
        nextPageBtn.classList.remove('disabled');
    }

    const startIndex = (currentPage - 1) * itemsPerPage;

    // Dapatkan data untuk halaman saat ini dan tampilkan
    fetch('https://be.indoculturalfinder.my.id/api/cultures')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const cultures = data.Cultures.slice(startIndex, startIndex + itemsPerPage);
                displayData(cultures, startIndex); // Mulai dari nomor startIndex + 1
                attachDeleteEventListeners();
                attachDetailEventListeners(); 
                attachEditEventListeners()
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function attachEditEventListeners() {
    const editButtons = document.querySelectorAll('.btn-warning');
    editButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const cultureId = this.getAttribute('data-id');
            openEditModal(cultureId);
        });
    });
}

function openEditModal(cultureId) {
    const editForm = document.getElementById('editForm');

    // Dapatkan data budaya berdasarkan ID dari endpoint atau penyimpanan lokal
    fetch(`https://be.indoculturalfinder.my.id/api/cultures/${cultureId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                // Isi formulir edit dengan data budaya yang diterima
                const culture = data.cultures;
                editForm.innerHTML = `
                    <input type="hidden" name="cultureId" value="${culture.id}">
                    <div class="mb-3">
                        <input type="hidden" class="form-control" name="editProvinsi" value="${culture.province_id}" disabled>
                    </div>
                    <div class="mb-3">
                        <input type="hidden" class="form-control" name="editKategori" value="${culture.category_id}" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="editJudul" class="form-label">Nama Budaya</label>
                        <input type="text" class="form-control" name="editJudul" value="${culture.name}">
                    </div>
                    <div class="mb-3">
                        <label for="editDeskripsi" class="form-label">Deskripsi Budaya</label>
                        <input type="text" class="form-control" name="editDeskripsi" value="${culture.desc}">
                    </div>
                    <div class="mb-3">
                        <label for="editGambar" class="form-label">Gambar</label>
                        <input type="text" class="form-control" name="editGambar" value="${culture.img}">
                    </div>
                    <div class="mb-3">
                        <label for="editVideo" class="form-label">Video</label>
                        <input type="text" class="form-control" name="editVideo" value="${culture.video}">
                    </div>
                    <button type="submit" class="btn btn-primary">Update</button>
                `;

                // Tambahkan event listener untuk form edit
                editForm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    updateData(this);
                });
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateData(form) {
    const cultureId = form.elements['cultureId'].value;
    const updatedData = {
        province_id: form.elements['editProvinsi'].value,
        category_id: form.elements['editKategori'].value,
        name: form.elements['editJudul'].value,
        desc: form.elements['editDeskripsi'].value,
        img: form.elements['editGambar'].value,
        video: form.elements['editVideo'].value
    };

    // Kirim data yang diperbarui ke backend melalui endpoint update
    fetch(`https://be.indoculturalfinder.my.id/api/cultures/${cultureId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                // Tutup modal edit setelah update berhasil
                $('#editModal').modal('hide');
                // Refresh data setelah update
                alert('Data berhasil dirubah!');
                fetchData();
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const cultureId = this.getAttribute('data-id');
            deleteData(cultureId);
        });
    });
}

function deleteData(cultureId) {
    const confirmation = confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmation) return;

    fetch(`https://be.indoculturalfinder.my.id/api/cultures/${cultureId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            alert('Data berhasil dihapus!');
            // Refresh halaman atau perbarui tampilan setelah menghapus data
            location.reload();
        } else {
            alert('Terjadi kesalahan: ' + data.message);
        }
    })
    .catch(error => console.error('Error deleting data:', error));
}
