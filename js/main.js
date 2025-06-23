/**
 * JusRide - Main JavaScript File
  
 */

document.addEventListener('DOMContentLoaded', function() {
    
    
    // Check if user is logged in and update UI
    function checkAuthStatus() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;
        
        const isLoggedIn = localStorage.getItem('jusride_token') !== null;
        const userType = localStorage.getItem('jusride_user_type') || 'rider';
        
        if (isLoggedIn) {
            // User is logged in - show dashboard/logout
            authButtons.innerHTML = `
                <a href="${userType}-dashboard.html" class="btn btn-outline">
                    <i class="fas fa-user"></i> Dashboard
                </a>
                <a href="#" class="btn btn-primary" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', logoutUser);
        } else {
            // User is logged out - show login/signup
            authButtons.innerHTML = `
                <a href="#" class="btn btn-outline" id="login-btn">Login</a>
                <a href="auth/register.html" class="btn btn-primary">Sign Up</a>
            `;
        }
    }
    
    // Handle user logout
    function logoutUser(e) {
        if (e) e.preventDefault();
        localStorage.removeItem('jusride_token');
        localStorage.removeItem('jusride_user_type');
        window.location.href = 'index.html';
    }
    
    
    
    function initAutoPopupLogin() {
        const modal = document.getElementById('autoLoginModal');
        if (!modal) return;
        
        // Show after delay if no token and not on login page
        if (!localStorage.getItem('jusride_token') && !window.location.pathname.includes('login.html')) {
            setTimeout(() => {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }, 4000); // 4-second delay
        }
        
        // Close functionality
        modal.querySelector('.close-modal')?.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Initialize form
        initLoginForm(modal.querySelector('.login-form'));
    }
    
    
    
    function initCardLogin() {
        const overlay = document.getElementById('loginOverlay');
        if (!overlay) return;
        
        // Toggle overlay when login button clicked
        document.addEventListener('click', (e) => {
            if (e.target.closest('#login-btn')) {
                e.preventDefault();
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close functionality
        overlay.querySelector('.close-modal')?.addEventListener('click', () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // Close when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Initialize form
        initLoginForm(overlay.querySelector('.login-form'));
    }
    
    
    
    function initLoginForm(form) {
        if (!form) return;
        
        // Toggle between rider/driver
        const riderBtn = form.closest('.login-card').querySelector('.user-type-toggle button:first-child');
        const driverBtn = form.closest('.login-card').querySelector('.user-type-toggle button:last-child');
        
        if (riderBtn && driverBtn) {
            riderBtn.addEventListener('click', () => {
                riderBtn.classList.add('active');
                driverBtn.classList.remove('active');
            });
            
            driverBtn.addEventListener('click', () => {
                driverBtn.classList.add('active');
                riderBtn.classList.remove('active');
            });
        }
        
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;
            const rememberMe = form.querySelector('input[type="checkbox"]')?.checked || false;
            const isDriver = driverBtn?.classList.contains('active') || false;
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call (replace with actual fetch)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // For demo - always "successful"
                localStorage.setItem('jusride_token', 'demo_token_' + Math.random().toString(36).substring(2));
                localStorage.setItem('jusride_user_type', isDriver ? 'driver' : 'rider');
                
                // Close all login modals
                document.querySelectorAll('.modal, .login-overlay').forEach(el => {
                    el.style.display = 'none';
                });
                document.body.style.overflow = '';
                
                // Update UI
                checkAuthStatus();
                
                // Show welcome message
                showToast(`Welcome back, ${email}! Redirecting to your dashboard...`);
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = isDriver ? 'driver-dashboard.html' : 'index.html';
                }, 2000);
                
            } catch (error) {
                // Handle errors
                showToast('Login failed. Please check your credentials.', 'error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
  
    // Show toast notifications
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
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
    
   
    
    // Initialize all systems
    checkAuthStatus();
    initAutoPopupLogin();
    initCardLogin();
    
    // Handle redirect from standalone login page
    if (window.location.search.includes('showLogin=true')) {
        document.getElementById('loginOverlay').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
});