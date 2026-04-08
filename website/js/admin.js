// Admin Panel JavaScript (Root Version)

// Configuration
const ADMIN_CONFIG = {
    credentials: {
        username: 'teacher',
        password: 'teacher123'
    }
};

let isAuthenticated = false; // In-memory only, resets on every page load

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Check if user is authenticated (always false on page load)
function checkAuth() {
    if (isAuthenticated) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginPage.style.display = 'flex';
    dashboardPage.style.display = 'none';
    isAuthenticated = false;
}

function showDashboard() {
    loginPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    isAuthenticated = true;
    loadGalleryImages();
}

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CONFIG.credentials.username && password === ADMIN_CONFIG.credentials.password) {
        isAuthenticated = true;
        showDashboard();
    } else {
        loginError.textContent = 'Invalid username or password. Please try again.';
        loginError.style.display = 'block';
        
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 3000);
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    showLogin();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Upload Functionality
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const uploadPreview = document.getElementById('uploadPreview');

let selectedFiles = [];

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('Please select image files only (JPG, PNG, WebP)');
        return;
    }
    
    selectedFiles = imageFiles;
    showPreview();
    uploadFiles();
}

function showPreview() {
    uploadPreview.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button class="remove-preview" data-index="${index}">&times;</button>
            `;
            uploadPreview.appendChild(item);
        };
        reader.readAsDataURL(file);
    });
    
    uploadPreview.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-preview')) {
            const index = parseInt(e.target.dataset.index);
            selectedFiles.splice(index, 1);
            showPreview();
        }
    });
}

async function uploadFiles() {
    if (selectedFiles.length === 0) return;
    
    uploadProgress.style.display = 'block';
    
    const total = selectedFiles.length;
    let uploaded = 0;
    
    for (const file of selectedFiles) {
        try {
            await uploadSingleFile(file);
            uploaded++;
            progressText.textContent = `${uploaded} / ${total}`;
            progressFill.style.width = `${(uploaded / total) * 100}%`;
        } catch (error) {
            console.error('Upload failed:', file.name, error);
        }
    }
    
    setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressFill.style.width = '0';
        selectedFiles = [];
        uploadPreview.innerHTML = '';
        fileInput.value = '';
        
        loadGalleryImages();
        alert(`✅ Successfully uploaded ${uploaded} photo${uploaded > 1 ? 's' : ''}!`);
    }, 500);
}

async function uploadSingleFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                src: e.target.result,
                name: file.name,
                date: new Date().toISOString(),
                size: file.size
            };
            
            let images = JSON.parse(localStorage.getItem('cocoonz_gallery_images') || '[]');
            images.unshift(imageData);
            
            try {
                localStorage.setItem('cocoonz_gallery_images', JSON.stringify(images));
                resolve(imageData);
            } catch (error) {
                alert('Storage full! Please delete some photos or use server storage.');
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Load and display gallery images
function loadGalleryImages() {
    const grid = document.getElementById('adminGalleryGrid');
    const photoCount = document.getElementById('photoCount');
    
    let images = JSON.parse(localStorage.getItem('cocoonz_gallery_images') || '[]');
    
    const staticImages = [
        { src: 'images/01e28409-d3ee-4659-b502-e17d1b995478.jpg', name: 'Children at play' },
        { src: 'images/0fc3fd66-75b1-4576-bc10-16b5b2e8d822.jpg', name: 'Learning activities' },
        { src: 'images/127ae09b-8ab5-404f-b4d5-60830394c95b.jpg', name: 'Creative play' },
        { src: 'images/20ec9be5-30c7-4d50-b663-cd2efab96566.jpg', name: 'Classroom learning' },
        { src: 'images/2bb8e87f-56cd-4b2d-a03c-9847e64a233a.jpg', name: 'Art time' },
        { src: 'images/2f269840-90b9-4660-88b1-a9d60c6cd2fc.jpg', name: 'Group activities' },
        { src: 'images/420f69b2-e1d3-4e30-ae26-80f64e88ef3d.jpg', name: 'Classroom fun' },
        { src: 'images/43e9635f-a0e6-48cf-9adc-93765c4d7c3e.jpg', name: 'Happy children' },
        { src: 'images/4d15c3f4-274c-4f74-9314-7ae1d8bdb64d.jpg', name: 'Art and craft' },
        { src: 'images/539398ad-f126-4415-be3d-a57f973e5f45.jpg', name: 'Outdoor play' },
        { src: 'images/5702c4a7-19ab-4653-afe0-c2dff3ccbe4f.jpg', name: 'Group activities' },
        { src: 'images/5dd77526-9511-40a0-80d2-f0c4c426da2d.jpg', name: 'Celebrations' },
        { src: 'images/ae621571-4254-47bc-984d-6b051ffb75ae.jpg', name: 'Special moments' },
        { src: 'images/b26f87d9-8c55-483c-abd0-1226afe2a5ed.jpg', name: 'Creative expression' },
        { src: 'images/b46b1671-022a-4d1f-a5b6-2a790f8ffd66.jpg', name: 'Learning together' },
        { src: 'images/bd82d3fd-8fa1-4bce-b1c8-bd085a3b42b2.jpg', name: 'Festival celebration' },
        { src: 'images/c01135a1-15c0-4825-a2ce-685481e5fa92.jpg', name: 'Celebrations' },
        { src: 'images/c1b2b871-fa35-4abf-8328-735283697c4e.jpg', name: 'Art projects' },
        { src: 'images/c9eb5e92-95e9-4f56-9c01-ae2bb1a30b9a.jpg', name: 'Story time' },
        { src: 'images/d0fd1252-efeb-46f0-bff6-5f7c274de655.jpg', name: 'Happy moments' },
        { src: 'images/d78cc466-850a-4511-beb6-8c0577ce6035.jpg', name: 'Music and dance' },
        { src: 'images/dddec84b-2bb0-427c-98da-e50e0b356592.jpg', name: 'Painting time' },
        { src: 'images/e1b64a4e-fb50-43fe-9c47-6a8a673997c4.jpg', name: 'Outdoor fun' },
        { src: 'images/f08b33df-8d9c-437d-a37d-e48f5cce7371.jpg', name: 'Reading corner' },
        { src: 'images/ffdc7c51-0cfc-47eb-9ae4-dfa8a6a30282.jpg', name: 'Sports day' },
        { src: 'images/image_1775478456614.jpg', name: 'Campus life' }
    ];
    
    const allImages = [...images, ...staticImages.map(img => ({...img, date: '2026-01-01', size: 0}))];
    
    photoCount.textContent = `(${allImages.length} photos)`;
    
    if (allImages.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1/-1;">No photos yet. Upload some above!</p>';
        return;
    }
    
    grid.innerHTML = allImages.map((img, index) => `
        <div class="admin-photo-card">
            <img src="${img.src}" alt="${img.name || 'Gallery photo'}" loading="lazy">
            <div class="admin-photo-actions">
                <button class="btn-delete-photo" data-index="${index}" data-src="${img.src}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-delete-photo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const src = e.currentTarget.dataset.src;
            if (confirm('Are you sure you want to delete this photo?')) {
                deletePhoto(src);
            }
        });
    });
}

function deletePhoto(src) {
    let images = JSON.parse(localStorage.getItem('cocoonz_gallery_images') || '[]');
    images = images.filter(img => img.src !== src);
    localStorage.setItem('cocoonz_gallery_images', JSON.stringify(images));
    loadGalleryImages();
}

document.getElementById('refreshGallery').addEventListener('click', loadGalleryImages);

// Initialize
checkAuth();
