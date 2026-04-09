// ========================================
// COCOONZ — Admin Parent Feedback Management
// localStorage-based feedback viewing & Excel export
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const dashboardPage = document.getElementById('dashboardPage');
    
    if (!dashboardPage) return;

    // Wait for dashboard to be visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (dashboardPage.style.display === 'block') {
                initializeFeedbackManagement();
                observer.disconnect();
            }
        });
    });

    observer.observe(dashboardPage, { attributes: true, attributeFilter: ['style'] });
});

function initializeFeedbackManagement() {
    addFeedbackTabToHeader();
    createFeedbackSection();
    loadParentFeedback();
}

function addFeedbackTabToHeader() {
    const header = document.querySelector('.admin-header');
    if (!header) return;
    if (document.querySelector('.admin-tabs')) return;

    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'admin-tabs';
    tabsContainer.style.cssText = `
        display: flex;
        gap: 12px;
        padding: 0 32px;
        background: var(--white);
        border-bottom: 2px solid var(--grey);
    `;

    const photoTab = document.createElement('button');
    photoTab.className = 'admin-tab active';
    photoTab.dataset.tab = 'photos';
    photoTab.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span>Photo Management</span>
    `;

    const feedbackTab = document.createElement('button');
    feedbackTab.className = 'admin-tab';
    feedbackTab.dataset.tab = 'feedback';
    feedbackTab.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Parent Feedback</span>
        <span class="feedback-badge" id="feedbackBadge" style="display:none;background:#e74c3c;color:white;padding:2px 8px;border-radius:12px;font-size:0.7rem;margin-left:4px;">0</span>
    `;

    tabsContainer.appendChild(photoTab);
    tabsContainer.appendChild(feedbackTab);
    header.insertAdjacentElement('afterend', tabsContainer);

    photoTab.addEventListener('click', () => switchTab('photos'));
    feedbackTab.addEventListener('click', () => switchTab('feedback'));
}

function switchTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    const photoSection = document.querySelector('.admin-content');
    const feedbackSection = document.getElementById('feedbackManagementSection');

    if (tabName === 'photos') {
        photoSection.style.display = 'block';
        if (feedbackSection) feedbackSection.style.display = 'none';
    } else {
        photoSection.style.display = 'none';
        if (feedbackSection) feedbackSection.style.display = 'block';
        loadParentFeedback();
    }
}

function createFeedbackSection() {
    const dashboard = document.getElementById('dashboardPage');
    if (!dashboard) return;

    const feedbackSection = document.createElement('div');
    feedbackSection.id = 'feedbackManagementSection';
    feedbackSection.className = 'admin-content';
    feedbackSection.style.display = 'none';

    feedbackSection.innerHTML = `
        <div class="admin-section">
            <div class="section-header">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Parent Feedback
                </h2>
                <div style="display:flex;gap:12px;">
                    <button id="exportFeedbackBtn" class="btn-admin-primary" style="display:flex;align-items:center;gap:8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        <span>Export to Excel</span>
                    </button>
                    <button id="refreshFeedbackBtn" class="btn-admin-outline" style="display:flex;align-items:center;gap:8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 4v6h-6M1 20v-6h6"/>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div id="feedbackStats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;"></div>

            <div class="feedback-table-container">
                <table class="admin-table" id="feedbackTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Parent Name</th>
                            <th>Child Name</th>
                            <th>Branch</th>
                            <th>Program</th>
                            <th>Rating</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Feedback</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="feedbackTableBody">
                        <tr>
                            <td colspan="10" style="text-align:center;padding:40px;color:var(--text-mid);">
                                <div style="font-size:2rem;margin-bottom:8px;">📋</div>
                                Loading feedback...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    dashboard.appendChild(feedbackSection);

    document.getElementById('exportFeedbackBtn').addEventListener('click', exportFeedbackToExcel);
    document.getElementById('refreshFeedbackBtn').addEventListener('click', loadParentFeedback);
}

function loadParentFeedback() {
    getFeedbacksFromFirebase().then(feedbacks => {
        // Update badge
        const badge = document.getElementById('feedbackBadge');
        if (badge) {
            badge.textContent = feedbacks.length;
            badge.style.display = feedbacks.length > 0 ? 'inline' : 'none';
        }

        // Update stats
        updateFeedbackStats(feedbacks);

        // Update table
        renderFeedbackTable(feedbacks);

        // Store for export
        window._allFeedbacks = feedbacks;
    });
}

async function getFeedbacksFromFirebase() {
    // Try Firebase first
    if (typeof db !== 'undefined') {
        try {
            const snapshot = await db.collection('parent_feedback')
                .orderBy('date', 'desc')
                .get();

            const feedbacks = [];
            snapshot.forEach(doc => {
                feedbacks.push({ id: doc.id, ...doc.data() });
            });
            return feedbacks;
        } catch (error) {
            console.error('Error loading feedback from Firebase:', error);
        }
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('cocoonz_parent_feedbacks');
    return stored ? JSON.parse(stored) : [];
}

function updateFeedbackStats(feedbacks) {
    const statsContainer = document.getElementById('feedbackStats');
    if (!statsContainer) return;

    const totalFeedback = feedbacks.length;
    const avgRating = totalFeedback > 0 
        ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedback).toFixed(1)
        : '0.0';
    const fiveStarCount = feedbacks.filter(f => f.rating === 5).length;
    const satisfactionRate = totalFeedback > 0 ? ((fiveStarCount / totalFeedback) * 100).toFixed(0) : 0;

    statsContainer.innerHTML = `
        <div style="background:linear-gradient(135deg,#5DADE2,#2E86C1);padding:20px;border-radius:12px;color:white;">
            <div style="font-size:0.85rem;opacity:0.9;margin-bottom:4px;">Total Feedback</div>
            <div style="font-size:2rem;font-weight:800;">${totalFeedback}</div>
        </div>
        <div style="background:linear-gradient(135deg,#A9DFBF,#58D68D);padding:20px;border-radius:12px;color:#145A32;">
            <div style="font-size:0.85rem;margin-bottom:4px;">Average Rating</div>
            <div style="font-size:2rem;font-weight:800;">⭐ ${avgRating}/5</div>
        </div>
        <div style="background:linear-gradient(135deg,#F7DC6F,#F0C228);padding:20px;border-radius:12px;color:#7D6608;">
            <div style="font-size:0.85rem;margin-bottom:4px;">5-Star Reviews</div>
            <div style="font-size:2rem;font-weight:800;">${fiveStarCount}</div>
        </div>
        <div style="background:linear-gradient(135deg,#EBF5FB,#D4E6F1);padding:20px;border-radius:12px;color:#1B4F72;">
            <div style="font-size:0.85rem;margin-bottom:4px;">Satisfaction Rate</div>
            <div style="font-size:2rem;font-weight:800;">${satisfactionRate}%</div>
        </div>
    `;
}

function renderFeedbackTable(feedbacks) {
    const tbody = document.getElementById('feedbackTableBody');
    if (!tbody) return;

    if (feedbacks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;padding:40px;color:var(--text-mid);">
                    <div style="font-size:2rem;margin-bottom:8px;">💬</div>
                    <div>No feedback submitted yet.</div>
                </td>
            </tr>
        `;
        return;
    }

    const branchLabels = {
        akshaya: 'Branch I – Akshaya',
        spkovil: 'Branch II – SP Kovil',
        maraimalai: 'Branch III – Maraimalai Nagar',
        siruseri: 'Branch L&T – Siruseri',
        singaperumalkoil: 'Branch V – Singaperumal Koil'
    };

    const categoryLabels = {
        teachers: 'Teachers & Staff',
        curriculum: 'Curriculum & Learning',
        facilities: 'Facilities & Environment',
        communication: 'Communication & Updates',
        overall: 'Overall Experience',
        improvement: 'Suggestions'
    };

    tbody.innerHTML = feedbacks.map(feedback => {
        const date = feedback.date ? new Date(feedback.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'N/A';

        const stars = '⭐'.repeat(feedback.rating || 0);

        return `
            <tr>
                <td style="white-space:nowrap;">${date}</td>
                <td><strong>${escapeHtml(feedback.parentName || '')}</strong></td>
                <td>${escapeHtml(feedback.childName || '')}</td>
                <td style="font-size:0.85rem;">${branchLabels[feedback.branch] || feedback.branch || 'N/A'}</td>
                <td style="text-transform:uppercase;font-size:0.85rem;font-weight:600;">${feedback.program || 'N/A'}</td>
                <td style="font-size:0.9rem;">${stars} <span style="color:var(--text-light);font-size:0.75rem;">(${feedback.rating}/5)</span></td>
                <td style="font-size:0.85rem;">${categoryLabels[feedback.category] || feedback.category || 'N/A'}</td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(feedback.feedbackTitle || '')}">${escapeHtml(feedback.feedbackTitle || '')}</td>
                <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(feedback.feedbackText || '')}">${escapeHtml(feedback.feedbackText || '')}</td>
                <td>
                    <button class="btn-delete-feedback" data-id="${feedback.id}" style="background:#e74c3c;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.8rem;">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Add delete event listeners
    document.querySelectorAll('.btn-delete-feedback').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const feedbackId = parseInt(e.target.dataset.id);
            if (confirm('Are you sure you want to delete this feedback?')) {
                deleteFeedback(feedbackId);
            }
        });
    });
}

async function deleteFeedback(feedbackId) {
    try {
        if (typeof db !== 'undefined') {
            await db.collection('parent_feedback').doc(feedbackId).delete();
        } else {
            const feedbacks = JSON.parse(localStorage.getItem('cocoonz_parent_feedbacks') || '[]');
            const updatedFeedbacks = feedbacks.filter(f => f.id !== parseInt(feedbackId));
            localStorage.setItem('cocoonz_parent_feedbacks', JSON.stringify(updatedFeedbacks));
        }
        
        loadParentFeedback();
        showAdminNotification('Feedback deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting feedback:', error);
        showAdminNotification('Error deleting feedback', 'error');
    }
}

function exportFeedbackToExcel() {
    const feedbacks = window._allFeedbacks || [];
    
    if (feedbacks.length === 0) {
        showAdminNotification('No feedback to export', 'error');
        return;
    }

    const branchLabels = {
        akshaya: 'Branch I – Akshaya',
        spkovil: 'Branch II – SP Kovil',
        maraimalai: 'Branch III – Maraimalai Nagar',
        siruseri: 'Branch L&T – Siruseri',
        singaperumalkoil: 'Branch V – Singaperumal Koil'
    };

    const categoryLabels = {
        teachers: 'Teachers & Staff',
        curriculum: 'Curriculum & Learning',
        facilities: 'Facilities & Environment',
        communication: 'Communication & Updates',
        overall: 'Overall Experience',
        improvement: 'Suggestions'
    };

    const excelData = feedbacks.map(f => ({
        'Date': f.date ? new Date(f.date).toLocaleDateString('en-IN') : 'N/A',
        'Parent Name': f.parentName || '',
        'Child Name': f.childName || '',
        'Branch': branchLabels[f.branch] || f.branch || 'N/A',
        'Program': (f.program || '').toUpperCase(),
        'Rating (1-5)': f.rating || 0,
        'Category': categoryLabels[f.category] || f.category || 'N/A',
        'Feedback Title': f.feedbackTitle || '',
        'Feedback': f.feedbackText || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    ws['!cols'] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 25 },
        { wch: 10 },
        { wch: 12 },
        { wch: 20 },
        { wch: 35 },
        { wch: 60 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Parent Feedback');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Cocoonz_Parent_Feedback_${timestamp}.xlsx`;

    XLSX.writeFile(wb, filename);
    
    showAdminNotification(`Exported ${feedbacks.length} feedbacks to Excel`, 'success');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAdminNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 24px;
        padding: 16px 24px;
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 3000;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}
