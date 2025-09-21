// register.js
import { signUp } from './auth.js'

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form')
    const alertDiv = document.getElementById('register-alert')
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        // التحقق من تطابق كلمة المرور
        const password = document.getElementById('register-password').value
        const confirmPassword = document.getElementById('confirm-password').value
        
        if (password !== confirmPassword) {
            showAlert(alertDiv, 'error', 'كلمات المرور غير متطابقة')
            return
        }
        
        // جمع بيانات المستخدم
        const userData = {
            name: document.getElementById('register-name').value,
            address: document.getElementById('register-address').value,
            phone: document.getElementById('register-phone').value,
            referral_code: document.getElementById('referral-code').value
        }
        
        const email = document.getElementById('register-email').value
        
        try {
            const { data, error } = await signUp(email, password, userData)
            
            if (error) {
                showAlert(alertDiv, 'error', error.message)
                return
            }
            
            showAlert(alertDiv, 'success', 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني للتأكيد.')
            
            setTimeout(() => {
                window.location.href = 'login.html'
            }, 3000)
            
        } catch (error) {
            showAlert(alertDiv, 'error', 'حدث خطأ أثناء إنشاء الحساب')
        }
    })
})

function showAlert(alertElement, type, message) {
    alertElement.textContent = message
    alertElement.className = `alert ${type}`
    alertElement.style.display = 'block'
    
    setTimeout(() => {
        alertElement.style.display = 'none'
    }, 5000)
}