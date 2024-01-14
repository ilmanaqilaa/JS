// File: post.js
document.addEventListener('DOMContentLoaded', function () {
    fetchProvinces();
    fetchCategories();
    
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        postData();
    });
});

let provinces = [];
let categories = [];

function fetchProvinces() {
    fetch('https://be.indoculturalfinder.my.id/api/provinces')
        .then(response => response.json())
        .then(data => {
            provinces = data.provinces;
            populateSelect('provinsiSelect', provinces);
        })
        .catch(error => console.error('Error fetching provinces:', error));
}

function fetchCategories() {
    fetch('https://be.indoculturalfinder.my.id/api/categories')
        .then(response => response.json())
        .then(data => {
            categories = data.Categories;
            populateSelect('kategoriSelect', categories);
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function populateSelect(selectId, data) {
    const selectElement = document.getElementById(selectId);

    selectElement.innerHTML = '<option>Pilih ' + selectId.replace('Select', '') + '</option>';

    data.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

function postData() {
    const formData = new FormData(document.querySelector('form'));
    
    const cultureData = {
        province_id: findIdByName(formData.get('provinsi'), provinces),
        category_id: findIdByName(formData.get('kategori'), categories),
        name: formData.get('judul'),
        desc: formData.get('deskripsi'),
        img: formData.get('gambar'),
        video: formData.get('video'),
    };

    fetch('https://be.indoculturalfinder.my.id/api/cultures', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cultureData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            alert('Data berhasil disimpan!');
            // Tambahkan logika tambahan jika diperlukan setelah sukses menyimpan data
            location.reload();
        } else {
            alert('Terjadi kesalahan: ' + data.message);
        }
    })
    .catch(error => console.error('Error posting data:', error));
}

function findIdByName(name, data) {
    const selectedItem = data.find(item => item.name === name);
    return selectedItem ? selectedItem.id : null;
}
