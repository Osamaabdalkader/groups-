// home.js
import { supabase } from './supabase.js'
import { checkAuthState } from './auth.js'

// تحميل المنشورات من Supabase
async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error loading posts:', error)
            return
        }

        displayPosts(posts)
    } catch (error) {
        console.error('Error:', error)
    }
}

// عرض المنشورات في واجهة المستخدم
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container')
    
    // إخفاء رسالة التحميل
    const loadingElement = document.querySelector('.posts-loading')
    if (loadingElement) {
        loadingElement.style.display = 'none'
    }
    
    postsContainer.innerHTML = ''

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">لا توجد منشورات بعد</div>'
        return
    }

    posts.forEach(post => {
        const postElement = createPostElement(post)
        postsContainer.appendChild(postElement)
    })
}

// إنشاء عنصر منشور
function createPostElement(post) {
    const postCard = document.createElement('div')
    postCard.className = 'post-card'
    
    postCard.innerHTML = `
        <div class="post-image">
            ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : '<div class="no-image"><i class="fas fa-image"></i></div>'}
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-details">
                <span class="detail-item"><i class="fas fa-tag"></i> ${post.category}</span>
                <span class="detail-item"><i class="fas fa-map-marker-alt"></i> ${post.location}</span>
                ${post.price ? `<span class="detail-item"><i class="fas fa-money-bill-wave"></i> ${post.price}</span>` : ''}
            </div>
            <div class="post-meta">
                <span class="post-time"><i class="fas fa-clock"></i> ${formatDate(post.created_at)}</span>
                <span class="post-author"><i class="fas fa-user"></i> ${post.user_name || 'مستخدم'}</span>
            </div>
        </div>
    `
    
    return postCard
}

// تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
        return 'اليوم'
    } else if (diffDays === 1) {
        return 'أمس'
    } else if (diffDays < 7) {
        return `قبل ${diffDays} أيام`
    } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('ar-EG', options)
    }
}

// التحقق من حالة المصادقة وإضافة معالجات الأحداث
document.addEventListener('DOMContentLoaded', async () => {
    // تحميل المنشورات
    loadPosts()
    
    // التحقق من حالة تسجيل الدخول
    const { session } = await checkAuthState()
    const isLoggedIn = !!session
    
    // إضافة معالجات الأحداث للأيقونات المحمية
    const protectedIcons = [
        document.getElementById('profile-header-icon'),
        document.getElementById('notifications-icon'),
        document.getElementById('sidebar-toggle'),
        document.getElementById('groups-icon'),
        document.getElementById('cart-icon'),
        document.getElementById('support-icon'),
        document.getElementById('more-icon')
    ]
    
    protectedIcons.forEach(icon => {
        if (icon) {
            icon.addEventListener('click', (e) => {
                if (!isLoggedIn) {
                    e.preventDefault()
                    window.location.href = 'login.html'
                } else {
                    e.preventDefault()
                    alert('هذه الصفحة قيد التطوير')
                }
            })
        }
    })
    
    // معالج لأيقونة الإضافة
    const addButton = document.getElementById('add-button')
    if (addButton) {
        addButton.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault()
                window.location.href = 'login.html'
            }
            // إذا كان مسجلاً، سيتم الانتقال إلى صفحة الإضافة بشكل طبيعي
        })
    }
})
