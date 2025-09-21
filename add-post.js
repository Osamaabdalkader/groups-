// add-post.js
import { supabase } from './supabase.js'
import { getCurrentUser } from './auth.js'

document.addEventListener('DOMContentLoaded', async () => {
    // التحقق من تسجيل الدخول
    const { user, error: userError } = await getCurrentUser()
    if (!user) {
        window.location.href = 'login.html'
        return
    }
    
    // معالجات أحداث رفع الصور
    const chooseImageBtn = document.getElementById('choose-image-btn')
    const cameraBtn = document.getElementById('camera-btn')
    const postImageInput = document.getElementById('post-image')
    const imageName = document.getElementById('image-name')
    const imagePreview = document.getElementById('image-preview')
    const previewImg = document.getElementById('preview-img')
    const removeImageBtn = document.getElementById('remove-image-btn')
    
    chooseImageBtn.addEventListener('click', () => {
        postImageInput.click()
    })
    
    cameraBtn.addEventListener('click', () => {
        // هنا يمكن إضافة دعم الكاميرا في المستقبل
        alert('ميزة الكاميرا قيد التطوير')
    })
    
    postImageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            imageName.textContent = file.name
            
            // عرض معاينة الصورة
            const reader = new FileReader()
            reader.onload = (e) => {
                previewImg.src = e.target.result
                imagePreview.classList.remove('hidden')
            }
            reader.readAsDataURL(file)
        }
    })
    
    removeImageBtn.addEventListener('click', () => {
        postImageInput.value = ''
        imageName.textContent = 'لم يتم اختيار صورة'
        imagePreview.classList.add('hidden')
    })
    
    // معالجة إرسال النموذج
    const addPostForm = document.getElementById('add-post-form')
    const loadingOverlay = document.getElementById('loading-overlay')
    const uploadProgress = document.getElementById('upload-progress')
    
    addPostForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const title = document.getElementById('post-title').value
        const description = document.getElementById('post-description').value
        const category = document.getElementById('post-category').value
        const price = document.getElementById('post-price').value
        const location = document.getElementById('post-location').value
        const phone = document.getElementById('post-phone').value
        const imageFile = postImageInput.files[0]
        
        // التحقق من الحقول المطلوبة
        if (!title || !description || !category || !location || !phone) {
            alert('يرجى ملء جميع الحقول المطلوبة')
            return
        }
        
        // عرض نافذة التحميل
        loadingOverlay.classList.remove('hidden')
        uploadProgress.style.width = '0%'
        
        let imageUrl = null
        
        try {
            // رفع الصورة إذا وجدت
            if (imageFile) {
                uploadProgress.style.width = '30%'
                
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `post_images/${fileName}`
                
                const { error: uploadError } = await supabase.storage
                    .from('marketing') // استخدام الدلو marketing
                    .upload(filePath, imageFile)
                
                if (uploadError) {
                    throw uploadError
                }
                
                uploadProgress.style.width = '60%'
                
                // الحصول على رابط الصورة
                const { data: { publicUrl } } = supabase.storage
                    .from('marketing')
                    .getPublicUrl(filePath)
                
                imageUrl = publicUrl
            }
            
            uploadProgress.style.width = '80%'
            
            // إدراج المنشور في قاعدة البيانات
            const { data: post, error } = await supabase
                .from('posts')
                .insert([
                    {
                        title,
                        description,
                        category,
                        price: price || null,
                        location,
                        phone,
                        image_url: imageUrl,
                        user_id: user.id,
                        user_name: user.user_metadata?.name || 'مستخدم'
                    }
                ])
                .select()
            
            if (error) {
                throw error
            }
            
            uploadProgress.style.width = '100%'
            
            // إخفاء نافذة التحميل وإظهار رسالة النجاح
            setTimeout(() => {
                loadingOverlay.classList.add('hidden')
                alert('تم نشر المنشور بنجاح!')
                window.location.href = 'index.html'
            }, 1000)
            
        } catch (error) {
            loadingOverlay.classList.add('hidden')
            console.error('Error adding post:', error)
            alert('حدث خطأ أثناء نشر المنشور: ' + error.message)
        }
    })
})
