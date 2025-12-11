// ============================================
// KONFIGURASI
// ============================================

// GANTI INI DENGAN URL WEB APP ANDA!

// ============================================
// INISIALISASI VARIABEL
// ============================================

// DOM Elements
const openingPage = document.getElementById('opening-page');
const mainContent = document.getElementById('main-content');
const openInvitationBtn = document.getElementById('open-invitation');
const weddingMusic = document.getElementById('wedding-music');
const musicToggleBtn = document.getElementById('music-toggle');
const countdownDays = document.getElementById('days');
const countdownHours = document.getElementById('hours');
const countdownMinutes = document.getElementById('minutes');
const countdownSeconds = document.getElementById('seconds');
const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

// Wedding date (10 January 2026, 09:00 WIB)
const weddingDate = new Date('January 10, 2026 09:00:00 GMT+0700').getTime();
let countdownInterval; // Pindahkan deklarasi ke sini

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website undangan pernikahan Dapot & Elvyana dimuat!');
    
    // Setup countdown timer
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    
    // Setup music toggle button
    musicToggleBtn.addEventListener('click', toggleMusic);
    
    // Setup open invitation button
    openInvitationBtn.addEventListener('click', openInvitation);
    
    // Setup form submission - BENAR seperti ini
    rsvpForm.addEventListener('submit', submitRSVP);

    // Setup attendance radio button logic
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestCountGroup = document.getElementById('guest-count').closest('.form-group');

    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const guestCountSelect = document.getElementById('guest-count');

            if (this.value === 'Tidak Hadir') {
                // Hide guest count and remove required
                guestCountGroup.style.display = 'none';
                guestCountSelect.required = false;
                guestCountSelect.value = ''; // Clear selection
            } else {
                // Show guest count and make required
                guestCountGroup.style.display = 'block';
                guestCountSelect.required = true;
            }
        });
    });
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup scroll animations
    initScrollAnimations();
    
    // Setup floating nav behavior
    window.addEventListener('scroll', handleFloatingNav);
    
    // Cek dan sync data yang pending saat load
    checkAndSyncPendingData();
});

// ============================================
// COUNTDOWN TIMER
// ============================================

function updateCountdown() {
    const now = new Date().getTime();
    const timeRemaining = weddingDate - now;
    
    // Jika tanggal sudah lewat
    if (timeRemaining < 0) {
        clearInterval(countdownInterval);
        countdownDays.textContent = '00';
        countdownHours.textContent = '00';
        countdownMinutes.textContent = '00';
        countdownSeconds.textContent = '00';
        return;
    }
    
    // Hitung waktu tersisa
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Update tampilan
    countdownDays.textContent = days.toString().padStart(2, '0');
    countdownHours.textContent = hours.toString().padStart(2, '0');
    countdownMinutes.textContent = minutes.toString().padStart(2, '0');
    countdownSeconds.textContent = seconds.toString().padStart(2, '0');
}

// ============================================
// MUSIC & INVITATION
// ============================================

function openInvitation() {
    console.log('Membuka undangan...');
    
    // Putar musik
    playWeddingMusic();
    
    // Sembunyikan halaman pembuka, tampilkan konten utama
    openingPage.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Scroll ke greeting section
    setTimeout(() => {
        const greetingSection = document.getElementById('greeting');
        if (greetingSection) {
            window.scrollTo({
                top: greetingSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }, 500);
}

function playWeddingMusic() {
    weddingMusic.volume = 0.5;
    weddingMusic.play()
        .then(() => {
            console.log('Musik berhasil diputar');
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(error => {
            console.log('Autoplay diblokir:', error);
            showFormMessage('Klik tombol musik di pojok kanan atas untuk memutar musik', 'info');
        });
}

function toggleMusic() {
    if (weddingMusic.paused) {
        weddingMusic.play();
        musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicToggleBtn.style.backgroundColor = '#C08A82';
    } else {
        weddingMusic.pause();
        musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        musicToggleBtn.style.backgroundColor = '#4E5D54';
    }
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

async function submitRSVP(event) {
    event.preventDefault();

    const submitBtn = rsvpForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;

    const formData = new FormData(rsvpForm);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch(rsvpForm.action, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.result === 'success') {
            showFormMessage('Konfirmasi kehadiran berhasil dikirim!', 'success');
            rsvpForm.reset();
        } else {
            showFormMessage('Terjadi kesalahan: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        showFormMessage('Gagal mengirim data. Silakan coba lagi.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ============================================
// FORM RSVP - INTEGRASI GOOGLE SHEETS
// ============================================






// ============================================
// ANIMATIONS & SCROLLING
// ============================================

function initScrollAnimations() {
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Math.random() * 0.5;
                entry.target.style.animationDelay = `${delay}s`;
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeUpElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function handleFloatingNav() {
    const floatingNav = document.querySelector('.floating-nav');
    if (!floatingNav) return;
    
    if (window.scrollY > 300) {
        floatingNav.style.opacity = '1';
        floatingNav.style.visibility = 'visible';
        floatingNav.style.transform = 'translateY(0)';
    } else {
        floatingNav.style.opacity = '0';
        floatingNav.style.visibility = 'hidden';
        floatingNav.style.transform = 'translateY(20px)';
    }
}

    // Setup gallery lightbox
    initGalleryLightbox();


// ============================================
// GALLERY LIGHTBOX
// ============================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    // Open lightbox when gallery item is clicked
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentIndex = index;
            openLightbox(images[currentIndex]);
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking outside the image
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Navigate to previous image
    lightboxPrev.addEventListener('click', function() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        openLightbox(images[currentIndex]);
    });

    // Navigate to next image
    lightboxNext.addEventListener('click', function() {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        openLightbox(images[currentIndex]);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightboxModal.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                openLightbox(images[currentIndex]);
                break;
            case 'ArrowRight':
                currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                openLightbox(images[currentIndex]);
                break;
        }
    });

    function openLightbox(src) {
        lightboxImage.src = src;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// ============================================
// COPY TO CLIPBOARD FUNCTION
// ============================================

function copyToClipboard(accountNumber) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = accountNumber;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Find the button that was clicked and add visual feedback
            const copyBtn = event.target.closest('.copy-btn');
            if (copyBtn) {
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';

                // Reset button after 2 seconds
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            }

            // Show success message (optional)
            showFormMessage('Nomor rekening berhasil disalin!', 'success');
        } else {
            showFormMessage('Gagal menyalin nomor rekening', 'error');
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        showFormMessage('Browser tidak mendukung fitur copy', 'error');
    }

    // Remove the temporary input
    document.body.removeChild(tempInput);
}

// ============================================
// DEBUG FUNCTIONS (untuk testing di console)
// ============================================

window.debugFunctions = {
    testFormSubmit: function() {
        // Isi form dengan data test
        document.getElementById('name').value = 'Test User';
        document.querySelector('input[name="attendance"][value="Hadir"]').checked = true;
        document.getElementById('guest-count').value = '2';
        document.getElementById('message').value = 'Ini adalah test dari console';
        
        // Trigger submit
        rsvpForm.dispatchEvent(new Event('submit'));
    },
    
    showPendingData: function() {
        const data = JSON.parse(localStorage.getItem('rsvp_data') || '[]');
        console.log('Data di localStorage:', data);
        return data;
    },
    
    clearLocalStorage: function() {
        localStorage.removeItem('rsvp_data');
        console.log('LocalStorage cleared');
    },
    
    testGoogleSheets: async function() {
        const testData = {
            name: 'Test from Console',
            attendance: 'Hadir',
            'guest-count': '1',
            message: 'Testing dari browser console'
        };
        
        try {
            const result = await sendToGoogleSheets(testData);
            console.log('Test result:', result);
            return result;
        } catch (error) {
            console.error('Test failed:', error);
            return error;
        }
    }
};

console.log('Debug functions available: window.debugFunctions');