// Animasi tombol CTA
document.getElementById('ctaButton').addEventListener('click', function() {
    alert('Terima kasih telah mengklik!');
    
    // Animasi (contoh: bounce)
    this.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        this.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
});

// Efek scroll halus untuk semua link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
