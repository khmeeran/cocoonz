// Gallery Page JavaScript

// Static images from the images folder
const staticGalleryImages = [
    { src: 'images/01e28409-d3ee-4659-b502-e17d1b995478.jpg', alt: 'Children at play', category: 'play' },
    { src: 'images/0fc3fd66-75b1-4576-bc10-16b5b2e8d822.jpg', alt: 'Learning activities', category: 'learning' },
    { src: 'images/127ae09b-8ab5-404f-b4d5-60830394c95b.jpg', alt: 'Creative play', category: 'play' },
    { src: 'images/20ec9be5-30c7-4d50-b663-cd2efab96566.jpg', alt: 'Classroom learning', category: 'learning' },
    { src: 'images/2bb8e87f-56cd-4b2d-a03c-9847e64a233a.jpg', alt: 'Art time', category: 'art' },
    { src: 'images/2f269840-90b9-4660-88b1-a9d60c6cd2fc.jpg', alt: 'Group activities', category: 'play' },
    { src: 'images/420f69b2-e1d3-4e30-ae26-80f64e88ef3d.jpg', alt: 'Classroom fun', category: 'learning' },
    { src: 'images/43e9635f-a0e6-48cf-9adc-93765c4d7c3e.jpg', alt: 'Happy children', category: 'play' },
    { src: 'images/4d15c3f4-274c-4f74-9314-7ae1d8bdb64d.jpg', alt: 'Art and craft', category: 'art' },
    { src: 'images/539398ad-f126-4415-be3d-a57f973e5f45.jpg', alt: 'Outdoor play', category: 'play' },
    { src: 'images/5702c4a7-19ab-4653-afe0-c2dff3ccbe4f.jpg', alt: 'Group activities', category: 'learning' },
    { src: 'images/5dd77526-9511-40a0-80d2-f0c4c426da2d.jpg', alt: 'Celebrations', category: 'celebrations' },
    { src: 'images/ae621571-4254-47bc-984d-6b051ffb75ae.jpg', alt: 'Special moments', category: 'celebrations' },
    { src: 'images/b26f87d9-8c55-483c-abd0-1226afe2a5ed.jpg', alt: 'Creative expression', category: 'art' },
    { src: 'images/b46b1671-022a-4d1f-a5b6-2a790f8ffd66.jpg', alt: 'Learning together', category: 'learning' },
    { src: 'images/bd82d3fd-8fa1-4bce-b1c8-bd085a3b42b2.jpg', alt: 'Festival celebration', category: 'celebrations' },
    { src: 'images/c01135a1-15c0-4825-a2ce-685481e5fa92.jpg', alt: 'Celebrations', category: 'celebrations' },
    { src: 'images/c1b2b871-fa35-4abf-8328-735283697c4e.jpg', alt: 'Art projects', category: 'art' },
    { src: 'images/c9eb5e92-95e9-4f56-9c01-ae2bb1a30b9a.jpg', alt: 'Story time', category: 'learning' },
    { src: 'images/d0fd1252-efeb-46f0-bff6-5f7c274de655.jpg', alt: 'Happy moments', category: 'play' },
    { src: 'images/d78cc466-850a-4511-beb6-8c0577ce6035.jpg', alt: 'Music and dance', category: 'celebrations' },
    { src: 'images/dddec84b-2bb0-427c-98da-e50e0b356592.jpg', alt: 'Painting time', category: 'art' },
    { src: 'images/e1b64a4e-fb50-43fe-9c47-6a8a673997c4.jpg', alt: 'Outdoor fun', category: 'play' },
    { src: 'images/f08b33df-8d9c-437d-a37d-e48f5cce7371.jpg', alt: 'Reading corner', category: 'learning' },
    { src: 'images/ffdc7c51-0cfc-47eb-9ae4-dfa8a6a30282.jpg', alt: 'Sports day', category: 'celebrations' },
    { src: 'images/image_1775478456614.jpg', alt: 'Campus life', category: 'play' }
];

// Combine static images with uploaded ones
function getAllImages() {
    const uploadedImages = JSON.parse(localStorage.getItem('cocoonz_gallery_images') || '[]');
    
    // Convert uploaded images to gallery format
    const uploaded = uploadedImages.map(img => ({
        src: img.src,
        alt: img.name || 'Uploaded photo',
        category: 'play' // Default category for uploaded images
    }));
    
    return [...uploaded, ...staticGalleryImages];
}

let currentFilter = 'all';
let currentImageIndex = 0;
let filteredImages = [];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const filterButtons = document.querySelectorAll('.gallery-filter');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Render gallery
function renderGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    const allImages = getAllImages();
    filteredImages = filter === 'all' ? [...allImages] : allImages.filter(img => img.category === filter);
    
    filteredImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.dataset.index = index;
        item.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="zoom-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                    <path d="M11 8v6M8 11h6"></path>
                </svg>
            </div>
        `;
        item.addEventListener('click', () => openLightbox(index));
        galleryGrid.appendChild(item);
    });
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderGallery(currentFilter);
    });
});

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const image = filteredImages[currentImageIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = `${image.alt} (${currentImageIndex + 1} / ${filteredImages.length})`;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    updateLightbox();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightbox();
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});
