// تهيئة Firebase - باستخدام بيانات التهيئة التي قدمتها

const firebaseConfig = {
  apiKey: "AIzaSyAzYZMxqNmnLMGYnCyiJYPg2MbxZMt0co0",
  authDomain: "osama-91b95.firebaseapp.com",
  databaseURL: "https://osama-91b95-default-rtdb.firebaseio.com",
  projectId: "osama-91b95",
  storageBucket: "osama-91b95.appspot.com",
  messagingSenderId: "118875905722",
  appId: "1:118875905722:web:200bff1bd99db2c1caac83",
  measurementId: "G-LEM5PVPJZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// عناصر DOM
const homePage = document.getElementById('home-page');
const authPage = document.getElementById('auth-page');
const addPostPage = document.getElementById('add-post-page');
const profilePage = document.getElementById('profile-page');

const authMessage = document.getElementById('auth-message');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const publishBtn = document.getElementById('publish-btn');

const postsContainer = document.getElementById('posts-container');
const userInfo = document.getElementById('user-info');

const profileIcon = document.getElementById('profile-icon');
const addPostIcon = document.getElementById('add-post-icon');
const homeIcon = document.getElementById('home-icon');
const closeAuthBtn = document.getElementById('close-auth');

// تحميل المنشورات عند بدء التحميل
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

// استمع لتغير حالة المستخدم
auth.onAuthStateChanged(user => {
    // لا شيء خاص هنا لأن المنشورات تظهر للجميع
});

// تحميل المنشورات للجميع
function loadPosts() {
    database.ref('posts').on('value', snapshot => {
        postsContainer.innerHTML = '';
        
        if (snapshot.exists()) {
            const posts = snapshot.val();
            Object.keys(posts).reverse().forEach(postId => {
                const post = posts[postId];
                createPostCard(post);
            });
        } else {
            postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات بعد. كن أول من ينشر!</p>';
        }
    });
}

// إنشاء بطاقة منشور
function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    postCard.innerHTML = `
        <div class="post-image">
            <i class="fas fa-image fa-3x"></i>
        </div>
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            <div class="post-meta">
                ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
                <div class="post-location"><i class="fas fa-map-marker-alt"></i> ${post.location}</div>
            </div>
            <div class="post-author">
                <i class="fas fa-user"></i> ${post.authorName}
                <span class="post-phone">${post.phone}</span>
            </div>
        </div>
    `;
    
    postsContainer.appendChild(postCard);
}

// تسجيل الدخول
loginBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showAuthMessage('تم تسجيل الدخول بنجاح!', 'success');
            setTimeout(() => {
                showPage(homePage);
                resetAuthForms();
            }, 1500);
        })
        .catch(error => {
            showAuthMessage(getAuthErrorMessage(error.code), 'error');
        });
});

// إنشاء حساب
signupBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;
    
    if (!name || !phone || !email || !password || !address) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            
            // حفظ معلومات المستخدم الإضافية
            return database.ref('users/' + user.uid).set({
                name: name,
                phone: phone,
                email: email,
                address: address
            });
        })
        .then(() => {
            showAuthMessage('تم إنشاء الحساب بنجاح!', 'success');
            setTimeout(() => {
                showPage(homePage);
                resetAuthForms();
            }, 1500);
        })
        .catch(error => {
            showAuthMessage(getAuthErrorMessage(error.code), 'error');
        });
});

// تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        showPage(homePage);
    });
});

// نشر منشور جديد
publishBtn.addEventListener('click', e => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        showPage(authPage);
        return;
    }
    
    const title = document.getElementById('post-title').value;
    const description = document.getElementById('post-description').value;
    const price = document.getElementById('post-price').value;
    const location = document.getElementById('post-location').value;
    const phone = document.getElementById('post-phone').value;
    
    if (!title || !description || !location || !phone) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // الحصول على معلومات المستخدم الإضافية
    database.ref('users/' + user.uid).once('value')
        .then(snapshot => {
            const userData = snapshot.val();
            
            const postData = {
                title: title,
                description: description,
                price: price || '',
                location: location,
                phone: phone,
                authorId: user.uid,
                authorName: userData.name,
                authorPhone: userData.phone,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            
            // حفظ المنشور في قاعدة البيانات
            return database.ref('posts').push(postData);
        })
        .then(() => {
            alert('تم نشر المنشور بنجاح!');
            resetAddPostForm();
            showPage(homePage);
        })
        .catch(error => {
            console.error('Error adding post: ', error);
            alert('حدث خطأ أثناء نشر المنشور. يرجى المحاولة مرة أخرى.');
        });
});

// عرض معلومات المستخدم
profileIcon.addEventListener('click', () => {
    const user = auth.currentUser;
    
    if (user) {
        // عرض صفحة حساب المستخدم
        database.ref('users/' + user.uid).once('value')
            .then(snapshot => {
                const userData = snapshot.val();
                userInfo.innerHTML = `
                    <div class="user-detail">
                        <i class="fas fa-user"></i>
                        <span>${userData.name}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-envelope"></i>
                        <span>${userData.email}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-phone"></i>
                        <span>${userData.phone}</span>
                    </div>
                    <div class="user-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${userData.address}</span>
                    </div>
                `;
                showPage(profilePage);
            });
    } else {
        // عرض صفحة التوثيق
        showPage(authPage);
    }
});

// إضافة منشور جديد
addPostIcon.addEventListener('click', () => {
    const user = auth.currentUser;
    
    if (user) {
        resetAddPostForm();
        showPage(addPostPage);
    } else {
        showPage(authPage);
    }
});

// العودة للصفحة الرئيسية
homeIcon.addEventListener('click', () => {
    showPage(homePage);
});

// إغلاق صفحة التوثيق
closeAuthBtn.addEventListener('click', () => {
    showPage(homePage);
});

// تغيير علامات التوثيق
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// وظائف مساعدة
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    page.classList.remove('hidden');
}

function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = '';
    authMessage.classList.add(type + '-message');
}

function getAuthErrorMessage(code) {
    switch(code) {
        case 'auth/invalid-email':
            return 'البريد الإلكتروني غير صالح';
        case 'auth/user-disabled':
            return 'هذا الحساب معطل';
        case 'auth/user-not-found':
            return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني';
        case 'auth/wrong-password':
            return 'كلمة المرور غير صحيحة';
        case 'auth/email-already-in-use':
            return 'هذا البريد الإلكتروني مستخدم بالفعل';
        case 'auth/weak-password':
            return 'كلمة المرور ضعيفة (يجب أن تحتوي على 6 أحرف على الأقل)';
        default:
            return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
    }
}

function resetAddPostForm() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-description').value = '';
    document.getElementById('post-price').value = '';
    document.getElementById('post-location').value = '';
    document.getElementById('post-phone').value = '';
}

function resetAuthForms() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-phone').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-address').value = '';
    authMessage.textContent = '';
    authMessage.className = '';
                       }
