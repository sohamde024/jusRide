/**
 * auth.js - Handles registration/signup functionality for JusRide
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const registerForm = document.getElementById('registerForm');
    const riderBtn = document.getElementById('riderBtn');
    const driverBtn = document.getElementById('driverBtn');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Initialize user type (default to rider)
    let userType = 'rider';

    // User type toggle functionality
    if (riderBtn && driverBtn) {
        riderBtn.addEventListener('click', function() {
            this.classList.add('active');
            driverBtn.classList.remove('active');
            userType = 'rider';
        });

        driverBtn.addEventListener('click', function() {
            this.classList.add('active');
            riderBtn.classList.remove('active');
            userType = 'driver';
        });
    }

    // Password validation
    function validatePassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity("Passwords don't match");
            return false;
        }
        
        // Check password strength (min 8 chars, 1 number)
        if (password.length < 8 || !/\d/.test(password)) {
            passwordInput.setCustomValidity("Password must be at least 8 characters with 1 number");
            return false;
        }
        
        confirmPasswordInput.setCustomValidity('');
        passwordInput.setCustomValidity('');
        return true;
    }

    // Real-time password validation
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);

    // Form submission handler
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (!validatePassword() || !registerForm.checkValidity()) {
                registerForm.reportValidity();
                return;
            }

            // Get form data
            const formData = {
                name: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                password: passwordInput.value,
                userType: userType,
                agreedToTerms: document.getElementById('terms').checked
            };

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            submitBtn.disabled = true;

            try {
                // Send registration request
                const response = await registerUser(formData);
                
                if (response.success) {
                    // Store user data
                    localStorage.setItem('jusride_token', response.token);
                    localStorage.setItem('jusride_user_type', response.userType);
                    localStorage.setItem('jusride_user_name', response.name);
                    
                    // Show success message
                    showToast(`Welcome to JusRide, ${response.name}! Redirecting...`, 'success');
                    
                    // Redirect based on user type
                    setTimeout(() => {
                        window.location.href = response.userType === 'driver' 
                            ? '/driver-dashboard.html' 
                            : '/index.html';
                    }, 2000);
                } else {
                    throw new Error(response.message || 'Registration failed');
                }
            } catch (error) {
                showToast(error.message || 'Registration failed. Please try again.', 'error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * Register user API call
     * @param {Object} userData - User registration data
     */
    async function registerUser(userData) {
        // In a real app, this would be a fetch() call to your backend
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate API response
                resolve({
                    success: true,
                    token: 'demo_token_' + Math.random().toString(36).substring(2, 15),
                    name: userData.name,
                    userType: userData.userType
                });
            }, 1500); // Simulate network delay
        });
    }

    /**
     * Show toast notification
     * @param {String} message - Message to display
     * @param {String} type - Type of toast (success, error, etc.)
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="toast-content">${message}</div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 100);
    }
});