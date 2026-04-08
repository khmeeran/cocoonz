# 🦋 Cocoonz Gallery & Admin System

## Overview
This is a complete gallery management system that allows teachers to upload and manage photos for the Cocoonz website.

---

## 📸 Gallery Page (`gallery.html`)

### Features:
- **Masonry Layout**: Beautiful responsive layout that handles all image orientations
  - Landscape
  - Portrait  
  - Square
- **Category Filtering**: Filter photos by:
  - All Moments
  - Learning
  - Play
  - Art & Creativity
  - Celebrations
- **Lightbox**: Click any photo to view full-screen
  - Navigate with arrow keys or buttons
  - Close with ESC key or X button
- **Auto-Updates**: Automatically shows newly uploaded photos

---

## 🔐 Admin Portal (`admin.html`)

### Access:
- **URL**: `yourdomain.com/admin.html`
- **Default Credentials**:
  - Username: `teacher`
  - Password: `cocoonz2026`

> ⚠️ **Important**: Change the password in production! Edit `js/admin.js` line 5-7 to update credentials.

### Features:

#### 1. **Upload Photos**
   - **Drag & Drop**: Simply drag photos onto the upload zone
   - **Browse**: Click to select files from your device
   - **Multiple Files**: Upload many photos at once
   - **Preview**: See photos before they're uploaded
   - **Progress Bar**: Track upload progress
   - **Supports**: JPG, PNG, WebP (up to 10MB each)

#### 2. **Manage Gallery**
   - View all photos (static + uploaded)
   - Delete uploaded photos you don't want
   - Photo count display
   - Refresh button to reload gallery

#### 3. **Security**
   - Login required
   - Session persists in browser
   - Logout button in header
   - Not indexed by search engines

---

## 📝 How Teachers Should Use

### Step 1: Login
1. Go to `yourdomain.com/admin.html`
2. Enter username and password
3. Click "Sign In"

### Step 2: Upload Photos
1. Drag photos to the upload zone OR click "Choose Files"
2. Preview appears showing selected photos
3. Photos upload automatically
4. Wait for success message

### Step 3: Verify Upload
1. Scroll down to see your photos in the gallery grid
2. Click "View Gallery" to see public view
3. Delete any photos if needed

### Step 4: View Public Gallery
- Click "View Gallery" button in admin header
- Or visit `yourdomain.com/gallery.html`
- Your uploaded photos will appear at the beginning

---

## 💾 Storage

### Current Setup (Static Site):
- Photos are stored in **browser localStorage**
- Good for testing and small-scale use
- **Limitation**: ~5-10MB per browser

### For Production (Recommended):
To enable server-side storage, you'll need:
1. A backend server (Node.js, PHP, Python, etc.)
2. Database (MySQL, MongoDB, etc.)
3. File storage (local folder or cloud like AWS S3)

The system is designed to easily integrate with a real backend - just update the `uploadSingleFile()` and related functions in `js/admin.js` to call your API endpoints.

---

## 🎨 Design Features

### Gallery Page:
- ✅ Masonry layout (handles all orientations)
- ✅ Responsive (mobile → desktop)
- ✅ Smooth animations
- ✅ Modern filter tabs
- ✅ Full-screen lightbox
- ✅ Keyboard navigation

### Admin Panel:
- ✅ Clean, professional UI
- ✅ Drag & drop uploads
- ✅ Preview before commit
- ✅ Progress indicators
- ✅ Photo management tools

---

## 🔧 File Structure

```
website/
├── gallery.html          # Public gallery page
├── admin.html            # Admin login & dashboard
├── css/
│   ├── style.css        # Main styles
│   ├── gallery-page.css # Gallery page styles
│   └── admin.css        # Admin panel styles
├── js/
│   ├── main.js          # Main site JS
│   ├── gallery.js       # Gallery functionality
│   └── admin.js         # Admin functionality
└── images/
    └── *.jpg            # All gallery images
```

---

## 🚀 Future Enhancements (Optional)

- [ ] Backend API for server storage
- [ ] Image compression before upload
- [ ] Category assignment during upload
- [ ] Bulk delete functionality
- [ ] Image captions and alt text
- [ ] Teacher user management
- [ ] Upload date filtering
- [ ] Image search functionality

---

## 📞 Support

For any issues or questions, refer to the code comments or contact your web developer.

---

**Made with 💛 for Cocoonz**
