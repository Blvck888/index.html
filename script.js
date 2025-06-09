// Konfigurasi Spreadsheet Anda
const SPREADSHEET_ID = '1zc2OY8FSfAnyGDIz1DUSjs0hYqFd4jGt0g06Bw38HSE';
const SHEET_NAME = 'All QRIS'; // Nama sheet yang sesuai
const API_URL = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;

document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead tr');

    loadingElement.textContent = 'Sedang memuat data dari spreadsheet...';

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal mengambil data. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data berhasil diambil:', data);
            
            if (!data || data.length === 0) {
                loadingElement.textContent = 'Tidak ada data ditemukan di sheet "All QRIS"';
                return;
            }

            loadingElement.style.display = 'none';
            
            // Bersihkan header yang ada
            while (thead.children.length > 1) {
                thead.removeChild(thead.lastChild);
            }

            // Buat header tabel dari kolom pertama data
            const headers = Object.keys(data[0]);
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                thead.appendChild(th);
            });

            // Isi data
            tbody.innerHTML = ''; // Kosongkan dulu
            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                
                // Nomor urut
                const tdNo = document.createElement('td');
                tdNo.textContent = index + 1;
                tr.appendChild(tdNo);
                
                // Data lainnya
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header] || '-';
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = `Error: ${error.message}`;
            errorElement.innerHTML += `<br><small>Pastikan sheet "All QRIS" sudah dibagikan secara publik</small>`;
        });
});
