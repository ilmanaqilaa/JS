document.addEventListener('DOMContentLoaded', function () {
    const provinceFilter = document.getElementById('provinceFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchCulture');
    const cultureTableBody = document.getElementById('cultureTable').getElementsByTagName('tbody')[0];

    let originalData = []; // Store the original data to avoid refetching from the API

    // Fetch culture data from the API
    fetch('https://be.indoculturalfinder.my.id/api/cultures')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                originalData = data.Cultures;
                // Populate options for province and category filters
                populateFilterOptions(originalData);
                // Display the initial data in the table
                displayData(originalData);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));

    // Event listener for filtering
    provinceFilter.addEventListener('change', filterData);
    categoryFilter.addEventListener('change', filterData);
    searchInput.addEventListener('input', filterData);

    function populateFilterOptions(cultures) {
        const uniqueProvinces = [...new Set(cultures.map(culture => culture.province_name))];
        const uniqueCategories = [...new Set(cultures.map(culture => culture.category_name))];

        populateOptions(provinceFilter, uniqueProvinces);
        populateOptions(categoryFilter, uniqueCategories);
    }

    function populateOptions(selectElement, options) {
        selectElement.innerHTML = ''; // Clear existing options
    
        // Add an "All" option
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'All';
        selectElement.appendChild(allOption);
    
        // Populate the other options
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    function filterData() {
        const provinceFilterValue = provinceFilter.value.toLowerCase();
        const categoryFilterValue = categoryFilter.value.toLowerCase();
        const searchFilterValue = searchInput.value.toLowerCase();
    
        // Filter the data based on selected filters
        const filteredData = originalData.filter(culture =>
            (provinceFilterValue === '' || culture.province_name.toLowerCase().includes(provinceFilterValue) || provinceFilterValue === 'all') &&
            (categoryFilterValue === '' || culture.category_name.toLowerCase().includes(categoryFilterValue) || categoryFilterValue === 'all') &&
            (searchFilterValue === '' || culture.name.toLowerCase().includes(searchFilterValue))
        );
    
        // Display the filtered data in the table
        displayData(filteredData);
    }

// Define variables for pagination
const itemsPerPage = 10;
let currentPage = 1;

// Function to display paginated data
function displayData(cultures) {
    cultureTableBody.innerHTML = '';

    // Calculate start and end indices based on the current page and items per page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Get the current page's data
    const currentData = cultures.slice(startIndex, endIndex);

    currentData.forEach((culture, index) => {
        const row = cultureTableBody.insertRow();
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${culture.province_name}</td>
            <td>${culture.category_name}</td>
            <td>${culture.name}</td>
            <td>
                <a href="#" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${culture.id}">Edit</a>
                <a class="btn btn-danger btn-sm" data-id="${culture.id}">Del</a>
            </td>
        `;
    });

    // Update pagination
    updatePagination(cultures.length);
}

// Function to update pagination based on the total number of items
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', function () {
            currentPage = i;
            displayData(cultures); // Assuming 'cultures' is your data array
        });
        paginationElement.appendChild(li);
    }
}
     // Get the "Reset Filter" button
     const resetFilterBtn = document.getElementById('resetFilterBtn');

     // Add an event listener to reset filters when the button is clicked
     resetFilterBtn.addEventListener('click', function () {
         // Reset all filters to their default state
         provinceFilter.value = 'all';
         categoryFilter.value = 'all';
         searchInput.value = '';
 
         // Trigger the filterData function to update the table
         filterData();
     });
});