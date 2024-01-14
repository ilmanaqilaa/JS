document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchCulture');
    const cultureTableBody = document.getElementById('cultureTable').getElementsByTagName('tbody')[0];

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        // Loop through each row in the table and hide/show based on the search term
        for (let i = 0; i < cultureTableBody.rows.length; i++) {
            const row = cultureTableBody.rows[i];
            const cultureName = row.cells[3].textContent.toLowerCase(); // Assuming the culture name is in the 4th column

            // Check if the culture name contains the search term
            if (cultureName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
});