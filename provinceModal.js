// File: updateProvince.js

// Fungsi untuk membuka modal provinsi
function openProvinceModal(provinceId) {
    fetch(`https://be.indoculturalfinder.my.id/api/provinces/${provinceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const province = data.province;
                const provinceModalBody = document.getElementById('provinceModalBody');
                provinceModalBody.innerHTML = `
                    <p><strong>Nama Provinsi:</strong> ${province.name}</p>
                `;
                $('#provinceModal').modal('show');
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}
