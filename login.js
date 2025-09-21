// login.js
import { signIn } from './auth.js'

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form')
    const alertDiv = document.getElementById('login-alert')
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const email = document.getElementById('login-email').value
        const password = document.getElementById('login-password').value
        
        try {
            const { data, error } = await signIn(email, password)
            
            if (error) {
                showAlert(alertDiv, 'error', error.message)
                return
            }
            
            showAlert(alertDiv, 'success', 'تم تسجيل الدخول بنجاح!')
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 1000)
            
        } catch (error) {
            showAlert(alertDiv, 'error', 'حدث خطأ أثناء تسجيل الدخول')
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