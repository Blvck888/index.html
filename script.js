// Konfigurasi Spreadsheet
const SPREADSHEET_ID = '1zc2OY8FSfAnyGDIz1DUSjs0hYqFd4jGt0g06Bw38HSE';
const SHEET_NAME = 'All QRIS';
const API_URL = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;

// Variabel Global
let originalData = [];
let currentData = [];
let currentPage = 1;
let entriesPerPage = 10;

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const modalOkBtn = document.getElementById('modal-ok-btn');
const refreshBtn = document.getElementById('refresh-btn');
const searchInput = document.getElementById('search-input');
const entriesFilter = document.getElementById('entries-filter');
const table = document.getElementById('data-table');
const tbody = table.querySelector('tbody');
const thead = table.querySelector('thead tr');
const tableInfo = document.getElementById('table-info');
const pagination = document.getElementById('pagination');

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Refresh data
    refreshBtn.addEventListener('click', loadData);
    
    // Pencarian
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        filterData();
    });
    
    // Filter jumlah entri
    entriesFilter.addEventListener('change', () => {
        entriesPerPage = parseInt(entriesFilter.value);
        currentPage = 1;
        renderTable();
    });
    
    // Modal error
    modalOkBtn.addEventListener('click', () => {
        errorModal.style.display = 'none';
    });

    // Export CSV
    document.querySelector('.export-btn').addEventListener('click', () => {
        exportToCSV();
    });
}

// Memuat data dari spreadsheet
function loadData() {
    showLoading();
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) throw new Error('Tidak ada data di sheet "All QRIS"');
            
            originalData = data;
            currentData = [...data];
            
            renderTable();
            hideLoading();
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message);
            hideLoading();
        });
}

// Filter data berdasarkan pencarian
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        currentData = [...originalData];
    } else {
        currentData = originalData.filter(row => {
            return Object.values(row).some(
                value => value && value.toString().toLowerCase().includes(searchTerm)
            );
        });
    }
    
    currentPage = 1;
    renderTable();
}

// Render tabel dengan pagination
function renderTable() {
    // Kosongkan tabel
    thead.innerHTML = '<th>No</th>';
    tbody.innerHTML = '';
    
    if (currentData.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="100" style="text-align: center;">Tidak ada data yang cocok</td>`;
        tbody.appendChild(tr);
        updateTableInfo();
        renderPagination();
        return;
    }
    
    // Ambil headers dari data pertama
    const headers = Object.keys(currentData[0]);
    
    // Buat header tabel
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        thead.appendChild(th);
    });
    
    // Hitung pagination
    const totalPages = Math.ceil(currentData.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, currentData.length);
    const pageData = currentData.slice(startIndex, endIndex);
    
    // Isi data
    pageData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Nomor urut
        const tdNo = document.createElement('td');
        tdNo.textContent = startIndex + index + 1;
        tr.appendChild(tdNo);
        
        // Data lainnya
        headers.forEach(header => {
            const td = document.createElement('td');
            const value = row[header] || '-';

            // Format khusus untuk kolom status (baik "Status" atau variasi lain)
            if (header.toLowerCase().includes('status')) {
                const valLower = value.toLowerCase();
                if (valLower === 'active' || valLower === 'aktif') td.className = 'status-active status-aktif';
                else if (valLower === 'pending' || valLower === 'menunggu') td.className = 'status-pending status-menunggu';
                else if (valLower === 'inactive' || valLower === 'tidak aktif') td.className = 'status-inactive status-tidak-aktif';
            }
            
            td.textContent = value;
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    updateTableInfo();
    renderPagination(totalPages);
}

// Update info tabel
function updateTableInfo() {
    const start = (currentPage - 1) * entriesPerPage + (currentData.length ? 1 : 0);
    const end = Math.min(currentPage * entriesPerPage, currentData.length);
    
    tableInfo.textContent = `Showing ${start} to ${end} of ${currentData.length} entries`;
}

// Render pagination
function renderPagination(totalPages = 1) {
    pagination.innerHTML = '';
    
    // Tombol previous
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    pagination.appendChild(prevBtn);
    
    // Tombol nomor halaman
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-btn';
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pagination.appendChild(pageBtn);
    }
    // Tombol next
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    pagination.appendChild(nextBtn);
}

// Tampilkan loading
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// Sembunyikan loading
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Tampilkan error modal
function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'flex';
}

// Export data ke CSV
function exportToCSV() {
    if (!currentData.length) {
        showError('Tidak ada data untuk diekspor.');
        return;
    }
    const headers = Object.keys(currentData[0]);
    const rows = currentData.map(row => headers.map(h => `"${(row[h]||'').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qris-data.csv';
    a.click();
    URL.revokeObjectURL(url);
}
