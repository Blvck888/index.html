// Google Sheets ID dan nama sheet
const SHEET_ID = '1zc2OY8FSfAnyGDIz1DUSjs0hYqFd4jGt0g06Bw38HSE';
const SHEET_NAME = 'Data Bank';

// Fungsi untuk memuat data dari Google Sheets
async function loadBankData() {
    try {
        // Menggunakan Google Sheets API v4
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=YOUR_API_KEY`);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data');
        }
        
        const data = await response.json();
        displayData(data.values);
    } catch (error) {
        console.error('Error:', error);
        // Fallback: Jika API tidak bekerja, gunakan data statis atau alternatif lain
        displayFallbackData();
    }
}

// Fungsi untuk menampilkan data ke tabel
function displayData(rows) {
    const tableBody = document.querySelector('#bank-data tbody');
    
    // Lewati header (baris pertama)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const tr = document.createElement('tr');
        
        // Asumsikan struktur kolom: No, Nama Bank, Kode Bank, Alamat, Telepon
        tr.innerHTML = `
            <td>${row[0] || ''}</td>
            <td>${row[1] || ''}</td>
            <td>${row[2] || ''}</td>
            <td>${row[3] || ''}</td>
            <td>${row[4] || ''}</td>
        `;
        
        tableBody.appendChild(tr);
    }
}

// Fungsi fallback jika API tidak bekerja
function displayFallbackData() {
    const tableBody = document.querySelector('#bank-data tbody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; color: red;">
                Gagal memuat data. Silakan coba lagi nanti atau hubungi administrator.
            </td>
        </tr>
    `;
}

// Panggil fungsi untuk memuat data ketika halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadBankData);
