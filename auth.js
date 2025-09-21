// auth.js
import { supabase } from './supabase.js'

// التحقق من حالة المصادقة
export function checkAuthState() {
    return supabase.auth.getSession()
}

// تسجيل الدخول
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    return { data, error }
}

// تسجيل مستخدم جديد
export async function signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: userData
        }
    })
    return { data, error }
}

// تسجيل الخروج
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

// الحصول على المستخدم الحالي
export function getCurrentUser() {
    return supabase.auth.getUser()
}