// Contoh fungsi untuk menampilkan alert saat button diklik
document.addEventListener('DOMContentLoaded', function() {
    const button = document.createElement('button');
    button.textContent = 'Klik Saya!';
    button.style.marginTop = '20px';
    button.addEventListener('click', function() {
        alert('Anda telah mengklik tombol!');
    });
    
    document.querySelector('.content').appendChild(button);
});
