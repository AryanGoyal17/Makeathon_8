// ==========================================
// 1. THEME TOGGLE
// ==========================================
const themeBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ==========================================
// 2. VIEW MANAGEMENT (SPA Logic)
// ==========================================
const authView = document.getElementById('auth-view');
const mainView = document.getElementById('main-view');
const langToggle = document.getElementById('lang-toggle');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');

function showMainApp(userName) {
    authView.classList.add('hidden');
    mainView.classList.remove('hidden');
    langToggle.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    welcomeMessage.textContent = `Welcome, ${userName}`;
    document.getElementById('name').value = userName;
}

function showAuthScreen() {
    mainView.classList.add('hidden');
    langToggle.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    authView.classList.remove('hidden');
    document.getElementById('auth-message').textContent = '';
}

const sessionUser = localStorage.getItem('scholarflow_user');
if (sessionUser) showMainApp(sessionUser);

// ==========================================
// 3. AUTHENTICATION LOGIC
// ==========================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYHSdAgyRmA3c6T87_WBTlJyfj3g43nPrAvkJmog3Rs82yr5savHP4-o618d7mqXI/exec"; 

const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const formLogin = document.getElementById('login-form');
const formSignup = document.getElementById('signup-form');
const authMessage = document.getElementById('auth-message');

tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    formLogin.classList.remove('hidden'); formSignup.classList.add('hidden');
    authMessage.textContent = '';
});

tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    formSignup.classList.remove('hidden'); formLogin.classList.add('hidden');
    authMessage.textContent = '';
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('scholarflow_user');
    showAuthScreen();
});

formSignup.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-signup');
    btn.textContent = "Creating Account..."; btn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('action', 'signup');
    formData.append('name', document.getElementById('signup-name').value);
    formData.append('email', document.getElementById('signup-email').value);
    formData.append('password', document.getElementById('signup-password').value);

    try {
        const response = await fetch(APPS_SCRIPT_URL, { 
            method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString() 
        });
        const result = await response.json();
        
        if(result.status === "success") {
            authMessage.style.color = "var(--success)";
            authMessage.textContent = "Account created! You can now login.";
            formSignup.reset(); tabLogin.click();
        } else {
            authMessage.style.color = "var(--danger)"; authMessage.textContent = result.message;
        }
    } catch (error) {
        authMessage.style.color = "var(--danger)"; authMessage.textContent = "Error connecting to server.";
    }
    btn.textContent = "Create Account"; btn.disabled = false;
});

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-login');
    btn.textContent = "Authenticating..."; btn.disabled = true;

    const formData = new URLSearchParams();
    formData.append('action', 'login');
    formData.append('email', document.getElementById('login-email').value);
    formData.append('password', document.getElementById('login-password').value);

    try {
        const response = await fetch(APPS_SCRIPT_URL, { 
            method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString() 
        });
        const result = await response.json();
        
        if(result.status === "success") {
            localStorage.setItem('scholarflow_user', result.name);
            formLogin.reset(); showMainApp(result.name);
        } else {
            authMessage.style.color = "var(--danger)"; authMessage.textContent = result.message;
        }
    } catch (error) {
        authMessage.style.color = "var(--danger)"; authMessage.textContent = "Error connecting to server.";
    }
    btn.textContent = "Login"; btn.disabled = false;
});

// ==========================================
// 4. MAIN APP LOGIC (Merged with Real AI Backend!)
// ==========================================
const resources = {
    en: { translation: { "profile_header": "Student Profile", "label_name": "Full Name", "label_gender": "Gender", "label_category": "Category", "opt_select_gender": "Select Gender", "opt_select_category": "Select Category", "opt_male": "Male", "opt_female": "Female", "opt_general": "General", "opt_obc": "OBC", "opt_sc": "SC", "opt_st": "ST", "label_degree": "Degree", "label_cgpa": "CGPA", "label_income": "Annual Family Income (₹)", "label_skills": "Skills (Comma Separated)", "btn_discover": "Discover Opportunities", "empty_title": "Ready to Match", "empty_desc": "Enter student details to instantly find eligible scholarships.", "status_eligible": "Top Match Found", "status_ineligible": "No Direct Scholarships", "proof_header": "Official Eligibility Proof", "next_steps": "Next Steps", "fallback_header": "Alternative Opportunity Found" } }
};

i18next.init({ lng: 'en', debug: false, resources: resources }, () => updateContent());
document.getElementById('lang-toggle').addEventListener('change', (e) => i18next.changeLanguage(e.target.value, updateContent));

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18next.exists(key)) el.textContent = i18next.t(key);
    });
}

document.getElementById('evaluation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('analyze-btn');
    const originalText = btn.textContent;
    btn.textContent = "Searching AI Database..."; 
    btn.disabled = true;

    // Gather the payload exactly how your backend expects it
    const payload = {
        student_profile: {
            name: document.getElementById('name').value,
            gender: document.getElementById('gender').value,
            category: document.getElementById('category').value,
            degree: document.getElementById('degree').value,
            cgpa: parseFloat(document.getElementById('cgpa').value),
            annual_income: parseInt(document.getElementById('annual_income').value, 10),
            skills: document.getElementById('skills').value.split(',').map(s => s.trim())
        }
    };

    try {
        // The REAL connection to your Node.js Server & MegaLLM!
        const response = await fetch('http://localhost:5000/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const serverData = await response.json();
        const isEligible = serverData.status === "eligible"; 

        document.getElementById('empty-state').classList.add('hidden');
        const resultsDiv = document.getElementById('dynamic-results');
        resultsDiv.classList.remove('hidden');

        if (isEligible) {
            resultsDiv.innerHTML = `
                <div class="status-bar eligible">✓ ${i18next.t('status_eligible')}</div>
                <h2 style="margin-top:0;">${serverData.scholarship_name}</h2>
                <div class="proof-section">
                    <h4>${i18next.t('proof_header')}</h4>
                    <p class="proof-text" style="line-height: 1.5;">"${serverData.eligibility_proof}"</p>
                </div>
                <p><strong>Funding Amount:</strong> ${serverData.funding_amount}</p>
                <p><strong>${i18next.t('next_steps')}:</strong> Verify your documents and apply on the official portal.</p>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div class="status-bar ineligible">✕ ${i18next.t('status_ineligible')}</div>
                <p>Your profile does not currently meet the hard constraints for the top scholarships in our database.</p>
                <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">
                <h3 style="color: var(--danger);">${i18next.t('fallback_header')}</h3>
                <p>Try exploring alternative private grants or check back next semester when your CGPA updates!</p>
            `;
        }
        
        // Mobile scrolling fix
        if(window.innerWidth <= 768) {
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error("Backend connection failed:", error);
        alert("Could not connect to the backend server. Is Node running?");
    }
    
    btn.textContent = originalText; 
    btn.disabled = false;
});