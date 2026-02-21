// 1. Theme Toggle Logic
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

// 2. Define Translation Resources (Updated with Gender & Category)
const resources = {
    en: {
        translation: {
            "profile_header": "Student Profile",
            "label_name": "Full Name",
            "label_gender": "Gender",
            "label_category": "Category",
            "opt_select_gender": "Select Gender",
            "opt_select_category": "Select Category",
            "opt_male": "Male",
            "opt_female": "Female",
            "opt_general": "General",
            "opt_obc": "OBC",
            "opt_sc": "SC",
            "opt_st": "ST",
            "label_degree": "Degree",
            "label_cgpa": "CGPA",
            "label_income": "Annual Family Income (₹)",
            "label_skills": "Skills (Comma Separated)",
            "btn_discover": "Discover Opportunities",
            "privacy_note": "🔒 Your profile data is stored securely and never shared with third parties.",
            "empty_title": "Ready to Match",
            "empty_desc": "Enter student details to instantly find eligible government scholarships and paid internships.",
            "status_eligible": "Top Match Found",
            "status_ineligible": "No Direct Scholarships",
            "proof_header": "Official Eligibility Proof",
            "next_steps": "Next Steps",
            "fallback_header": "Alternative Opportunity Found"
        }
    },
    hi: {
        translation: {
            "profile_header": "छात्र प्रोफाइल",
            "label_name": "पूरा नाम",
            "label_gender": "लिंग",
            "label_category": "श्रेणी",
            "opt_select_gender": "लिंग चुनें",
            "opt_select_category": "श्रेणी चुनें",
            "opt_male": "पुरुष",
            "opt_female": "महिला",
            "opt_general": "सामान्य",
            "opt_obc": "ओबीसी (OBC)",
            "opt_sc": "एससी (SC)",
            "opt_st": "एसटी (ST)",
            "label_degree": "डिग्री",
            "label_cgpa": "सीजीपीए (CGPA)",
            "label_income": "वार्षिक पारिवारिक आय (₹)",
            "label_skills": "कौशल (अल्पविराम से अलग)",
            "btn_discover": "अवसर खोजें",
            "privacy_note": "🔒 आपका प्रोफ़ाइल डेटा सुरक्षित रूप से संग्रहीत है और कभी भी तीसरे पक्ष के साथ साझा नहीं किया जाता है।",
            "empty_title": "मैच के लिए तैयार",
            "empty_desc": "सरकारी छात्रवृत्ति और इंटर्नशिप खोजने के लिए छात्र विवरण दर्ज करें।",
            "status_eligible": "शीर्ष मैच मिला",
            "status_ineligible": "कोई सीधी छात्रवृत्ति नहीं",
            "proof_header": "आधिकारिक पात्रता प्रमाण",
            "next_steps": "अगले चरण",
            "fallback_header": "वैकल्पिक अवसर मिला"
        }
    },
    pa: {
        translation: {
            "profile_header": "ਵਿਦਿਆਰਥੀ ਪ੍ਰੋਫਾਈਲ",
            "label_name": "ਪੂਰਾ ਨਾਮ",
            "label_gender": "ਲਿੰਗ",
            "label_category": "ਸ਼੍ਰੇਣੀ",
            "opt_select_gender": "ਲਿੰਗ ਚੁਣੋ",
            "opt_select_category": "ਸ਼੍ਰੇਣੀ ਚੁਣੋ",
            "opt_male": "ਮਰਦ",
            "opt_female": "ਔਰਤ",
            "opt_general": "ਜਨਰਲ",
            "opt_obc": "ਓ.ਬੀ.ਸੀ (OBC)",
            "opt_sc": "ਐਸ.ਸੀ (SC)",
            "opt_st": "ਐਸ.ਟੀ (ST)",
            "label_degree": "ਡਿਗਰੀ",
            "label_cgpa": "ਸੀਜੀਪੀਏ (CGPA)",
            "label_income": "ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ (₹)",
            "label_skills": "ਹੁਨਰ (ਕੌਮੇ ਨਾਲ ਵੱਖ)",
            "btn_discover": "ਮੌਕੇ ਲੱਭੋ",
            "privacy_note": "🔒 ਤੁਹਾਡਾ ਪ੍ਰੋਫਾਈਲ ਡੇਟਾ ਸੁਰੱਖਿਅਤ ਰੂਪ ਵਿੱਚ ਸਟੋਰ ਕੀਤਾ ਗਿਆ ਹੈ ਅਤੇ ਕਦੇ ਵੀ ਤੀਜੀ ਧਿਰ ਨਾਲ ਸਾਂਝਾ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
            "empty_title": "ਮੈਚ ਲਈ ਤਿਆਰ",
            "empty_desc": "ਸਕਾਲਰਸ਼ਿਪ ਅਤੇ ਇੰਟਰਨਸ਼ਿਪ ਲੱਭਣ ਲਈ ਵੇਰਵੇ ਦਰਜ ਕਰੋ।",
            "status_eligible": "ਚੋਟੀ ਦਾ ਮੈਚ ਮਿਲਿਆ",
            "status_ineligible": "ਕੋਈ ਸਿੱਧੀ ਸਕਾਲਰਸ਼ਿਪ ਨਹੀਂ",
            "proof_header": "ਸਰਕਾਰੀ ਯੋਗਤਾ ਸਬੂਤ",
            "next_steps": "ਅਗਲੇ ਕਦਮ",
            "fallback_header": "ਵਿਕਲਪਕ ਮੌਕਾ ਲੱਭਿਆ"
        }
    },
    ta: {
        translation: {
            "profile_header": "மாணவர் சுயவிவரம்",
            "label_name": "முழு பெயர்",
            "label_gender": "பாலினம்",
            "label_category": "பிரிவு",
            "opt_select_gender": "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
            "opt_select_category": "பிரிவைத் தேர்ந்தெடுக்கவும்",
            "opt_male": "ஆண்",
            "opt_female": "பெண்",
            "opt_general": "பொது",
            "opt_obc": "ஓபிசி (OBC)",
            "opt_sc": "எஸ்சி (SC)",
            "opt_st": "எஸ்டி (ST)",
            "label_degree": "பட்டம்",
            "label_cgpa": "CGPA",
            "label_income": "ஆண்டு குடும்ப வருமானம் (₹)",
            "label_skills": "திறன்கள்",
            "btn_discover": "வாய்ப்புகளைக் கண்டறியவும்",
            "privacy_note": "🔒 உங்கள் சுயவிவரத் தரவு பாதுகாப்பாகச் சேமிக்கப்படுகிறது மற்றும் மூன்றாம் தரப்பினருடன் பகிரப்படாது.",
            "empty_title": "பொருந்த தயார்",
            "empty_desc": "உதவித்தொகை மற்றும் இன்டர்ன்ஷிப்களைக் கண்டறிய விவரங்களை உள்ளிடவும்.",
            "status_eligible": "சிறந்த போட்டி",
            "status_ineligible": "நேரடி உதவித்தொகை இல்லை",
            "proof_header": "அதிகாரப்பூர்வ தகுதி ஆதாரம்",
            "next_steps": "அடுத்த படிகள்",
            "fallback_header": "மாற்று வாய்ப்பு"
        }
    },
    mr: {
        translation: {
            "profile_header": "विद्यार्थी प्रोफाइल",
            "label_name": "पूर्ण नाव",
            "label_gender": "लिंग",
            "label_category": "वर्ग",
            "opt_select_gender": "लिंग निवडा",
            "opt_select_category": "वर्ग निवडा",
            "opt_male": "पुरुष",
            "opt_female": "महिला",
            "opt_general": "खुला (General)",
            "opt_obc": "ओबीसी (OBC)",
            "opt_sc": "एससी (SC)",
            "opt_st": "एसटी (ST)",
            "label_degree": "पदवी",
            "label_cgpa": "CGPA",
            "label_income": "वार्षिक कौटुंबिक उत्पन्न (₹)",
            "label_skills": "कौशल्ये",
            "btn_discover": "संधी शोधा",
            "privacy_note": "🔒 तुमचा प्रोफाइल डेटा सुरक्षितपणे संग्रहित केला जातो आणि तृतीय पक्षांसोबत कधीही शेअर केला जात नाही.",
            "empty_title": "मॅचसाठी तयार",
            "empty_desc": "शिष्यवृत्ती आणि इंटर्नशिप शोधण्यासाठी तपशील प्रविष्ट करा.",
            "status_eligible": "सर्वोत्तम जुळणी",
            "status_ineligible": "थेट शिष्यवृत्ती नाही",
            "proof_header": "अधिकृत पात्रता पुरावा",
            "next_steps": "पुढील पायऱ्या",
            "fallback_header": "पर्यायी संधी सापडली"
        }
    }
};

// 3. Initialize i18next
i18next.init({
    lng: 'en',
    debug: true,
    resources: resources
}, function(err, t) {
    updateContent();
});

// 4. Language Switcher Logic
document.getElementById('lang-toggle').addEventListener('change', function(e) {
    i18next.changeLanguage(e.target.value, () => {
        updateContent();
    });
});

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = i18next.t(key);
    });
}

// 5. Form Submission Logic
document.getElementById('evaluation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('analyze-btn');
    const originalText = btn.textContent;
    btn.textContent = "Searching Database...";
    btn.disabled = true;

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
        // 1. Send the actual data to your new Node.js backend!
        const response = await fetch('http://localhost:5000/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // 2. Wait for the server to reply
        const serverData = await response.json();
        console.log("Server says:", serverData); // <-- You will see this in your browser console!

        // 3. Keep our existing UI logic for now

const isEligible = serverData.status === "eligible"; 
renderResults(isEligible, serverData);

    } catch (error) {
        console.error("Backend connection failed:", error);
        alert("Could not connect to the backend server. Is Node running?");
    }
    
    btn.textContent = originalText;
    btn.disabled = false;
});

// 1. Add serverData as a parameter here!
function renderResults(isEligible, serverData) {
    document.getElementById('empty-state').classList.add('hidden');
    const resultsDiv = document.getElementById('dynamic-results');
    resultsDiv.classList.remove('hidden');

    if (isEligible) {
        // 2. Inject the AI's actual data using ${serverData.propertyName}
        resultsDiv.innerHTML = `
            <div class="status-bar eligible">✓ ${i18next.t('status_eligible')}</div>
            <h2 style="margin-top:0;">${serverData.scholarship_name}</h2>
            
            <div class="proof-section">
                <h4>${i18next.t('proof_header')}</h4>
                <p class="proof-text">"${serverData.eligibility_proof}"</p>
            </div>
            
            <p><strong>Funding Amount:</strong> ${serverData.funding_amount}</p>
            <p><strong>${i18next.t('next_steps')}:</strong> Verify your documents and apply on the official portal.</p>
        `;
    } else {
        // Fallback if the AI says they are not eligible for anything
        resultsDiv.innerHTML = `
            <div class="status-bar ineligible">✕ ${i18next.t('status_ineligible')}</div>
            <p>Your profile does not currently meet the hard constraints for the top scholarships in our database.</p>
            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">
            <h3 style="color: var(--danger);">${i18next.t('fallback_header')}</h3>
            <p>Try exploring alternative private grants or check back next semester when your CGPA updates!</p>
        `;
    }
}