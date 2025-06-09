// Ganti URL dengan link publik spreadsheet Anda dalam format CSV
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/[1zc2OY8FSfAnyGDIz1DUSjs0hYqFd4jGt0g06Bw38HSE]/pub?output=csv';

document.addEventListener('DOMContentLoaded', function() {
    fetch(SPREADSHEET_URL)
        .then(response => response.text())
        .then(data => {
            const loadingElement = document.getElementById('loading');
            loadingElement.style.display = 'none';
            
            const table = document.getElementById('data-table');
            const tbody = table.querySelector('tbody');
            const thead = table.querySelector('thead tr');
            
            // Parse data CSV
            const rows = data.split('\n');
            const headers = rows[0].split(',');
            
            // Buat header tabel
            headers.forEach((header, index) => {
                if (index === 0) return; // Skip kolom No yang sudah ada
                const th = document.createElement('th');
                th.textContent = header.trim();
                thead.appendChild(th);
            });
            
            // Isi data ke tabel
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i]) continue;
                
                const cells = rows[i].split(',');
                const tr = document.createElement('tr');
                
                // Tambah nomor urut
                const tdNo = document.createElement('td');
                tdNo.textContent = i;
                tr.appendChild(tdNo);
                
                // Tambah data lainnya
                for (let j = 0; j < cells.length; j++) {
                    const td = document.createElement('td');
                    td.textContent = cells[j].trim();
                    tr.appendChild(td);
                }
                
                tbody.appendChild(tr);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('loading').textContent = 'Gagal memuat data. Silakan coba lagi.';
        });
});
