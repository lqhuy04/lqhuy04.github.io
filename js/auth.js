
let users = JSON.parse(localStorage.getItem('users')) || [
    { id: 1, name: "John Doe", email: "john@example.com", password: "password123" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password123" }

];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const userNav = document.getElementById('user-nav');

function initAuthUI() {


    if (currentUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (userNav) {
            userNav.style.display = 'block';
            const profileLink = userNav.querySelector('a[href="profile.html"]');
            profileLink.textContent = `Welcome, ${currentUser.name}`;
            window.location.href = 'profile.html';
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (userNav) userNav.style.display = 'none';
    }
}

function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }
    return false;
}

function register(name, email, password) {
    if (users.some(u => u.email === email)) {
        return false;
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (login(email, password)) {
            window.location.href = 'profile.html';
        } else {
            document.getElementById('login-error').textContent = 'Invalid email or password';
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        if (password !== confirm) {
            document.getElementById('register-error').textContent = 'Passwords do not match';
            return;
        }
        
        if (register(name, email, password)) {
            window.location.href = 'profile.html';
        } else {
            document.getElementById('register-error').textContent = 'Email already registered';
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
};

window.addEventListener('storage', function(e) {
    if (e.key === 'currentUser') {
        currentUser = JSON.parge(localStorage.getItem('currentUser')) || null;
        initAuthUI();
    }
});

document.addEventListener('DOMContentLoaded', initAuthUI);