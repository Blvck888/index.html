// Konfigurasi Spreadsheet
const SPREADSHEET_ID = '1zc2OY8FSfAnyGDIz1DUSjs0hYqFd4jGt0g06Bw38HSE';
const SHEET_NAME = 'All QRIS';
const API_URL = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;

// Elemen DOM
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const table = document.getElementById('data-table');
const tbody = table.querySelector('tbody');
const thead = table.querySelector('thead tr');

// Variabel untuk menyimpan data asli
let originalData = [];

// Fungsi untuk memuat data
function loadData() {
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error(`Gagal mengambil data. Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) throw new Error('Tidak ada data di sheet "All QRIS"');
            
            originalData = data; // Simpan data asli untuk pencarian
            renderTable(data);
            loadingElement.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            loadingElement.style.display = 'none';
            showError(error);
        });
}

// Fungsi untuk render tabel
function renderTable(data) {
    // Kosongkan tabel
    thead.innerHTML = '<th>No</th>';
    tbody.innerHTML = '';

    // Ambil header dari kolom pertama data
    const headers = Object.keys(data[0]);
    if (headers.length === 0) {
        throw new Error('Format header tidak valid');
    }

    // Buat header tabel
    headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        if (index === 0) th.classList.add('primary-header');
        thead.appendChild(th);
    });

    // Isi data ke tabel
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        // Nomor urut
        const tdNo = document.createElement('td');
        tdNo.textContent = rowIndex + 1;
        tr.appendChild(tdNo);

        // Isi data per kolom
        headers.forEach((header, colIndex) => {
            const td = document.createElement('td');
            td.textContent = row[header] || '-';
            if (colIndex === 0) td.classList.add('primary-data');
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Fungsi untuk menampilkan error
function showError(error) {
    errorElement.innerHTML = `
        <div class="error-icon">!</div>
        <div>
            <strong>Gagal memuat data</strong><br>
            ${error.message}<br>
            <small>Pastikan sheet "${SHEET_NAME}" sudah dibagikan secara publik</small>
        </div>
    `;
    errorElement.style.display = 'flex';
}

// Fungsi untuk pencarian
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) {
        renderTable(originalData);
        return;
    }

    const filteredData = originalData.filter(row => {
        return Object.values(row).some(
            value => value && value.toString().toLowerCase().includes(searchTerm)
        );
    });

    renderTable(filteredData);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadData);
searchInput.addEventListener('input', handleSearch);

// (Opsional) Auto-refresh setiap 1 menit
// setInterval(loadData, 60000);
