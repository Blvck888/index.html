// Konfigurasi Spreadsheet Anda
const SPREADSHEET_ID = '1zc2OY8FSfAnyGDIz1DUSjs0hYqFd4jGt0g06Bw38HSE';
const SHEET_NAME = 'Sheet1'; // Ganti jika nama sheet berbeda
const API_URL = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_NAME}`;

document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead tr');

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data berhasil diambil:', data);
            
            if (data.length === 0) {
                loadingElement.textContent = 'Tidak ada data ditemukan';
                return;
            }

            loadingElement.style.display = 'none';
            
            // Buat header tabel
            Object.keys(data[0]).forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                thead.appendChild(th);
            });

            // Isi data
            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                
                // Nomor urut
                const tdNo = document.createElement('td');
                tdNo.textContent = index + 1;
                tr.appendChild(tdNo);
                
                // Data lainnya
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value || '-';
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = `Gagal memuat data: ${error.message}`;
        });
});
