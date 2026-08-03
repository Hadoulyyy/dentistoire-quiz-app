/**
 * DentaQuiz Studio - Bilingual Engine (English & Arabic)
 * Pure translation dictionary for Dental Lecture Sheets platform.
 */

const TRANSLATIONS = {
  en: {
    brandSubtitle: "Learn. Understand. Smile.",
    navHome: "Home",
    navSubjects: "Course Subjects",
    navSaved: "Saved & Weak",
    navHistory: "History",
    navAnalytics: "Analytics",
    navAdmin: "Admin Hub",

    welcomeTitle: "Bienvenue chez DENTISTOIRE",
    welcomeSubtitle: "A soft and inspiring space for 2nd-year dental students to study lecture materials, master 7 course subjects, and make every smile shine.",
    statSubjects: "Course Subjects",
    statTopics: "Lecture Sheets",
    statQuestions: "Total Questions",
    statAccuracy: "Overall Accuracy",

    searchPlaceholder: "Search questions, subjects, sheets, or keywords...",
    btnStartRandom: "Quick Practice",
    btnPracticeWeak: "Practice Weak Topics",
    btnBackHome: "Return to Dashboard",
    btnRetakeQuiz: "Retake Quiz",
    btnExitQuiz: "Exit Quiz",
    btnPrevious: "Previous",
    btnNext: "Next Question",
    btnFinish: "Submit Quiz",

    sheetsHeader: "Lecture Sheets",
    sheetCount: "Sheets",
    startSheetQuiz: "Take Sheet Quiz",

    questionPaletteBtn: "Navigator",
    paletteTitle: "Question Navigator",
    paletteAnswered: "Answered",
    paletteUnanswered: "Unanswered",

    explanationTitle: "Academic Explanation & Notes",
    resultsTitle: "Quiz Performance Summary",
    historyTitle: "Completed Quiz History Log",

    profileTitle: "Student Profile",
    labelStudentName: "Student Name",
    labelTargetScore: "Target Exam Score (%)",
    labelRole: "Account Role",
    roleStudent: "Dental Student",
    roleAdmin: "Platform Administrator",
    adminPasskeyLabel: "Admin Security Passkey (Default: admin123)",
    btnSaveProfile: "Save Profile Settings"
  },

  ar: {
    brandSubtitle: "تعلّم. افهم. ابتسم.",
    navHome: "الرئيسية",
    navSubjects: "المواد الدراسية",
    navSaved: "المحفوظات والضعيفة",
    navHistory: "سجل الاختبارات",
    navAnalytics: "الإحصائيات",
    navAdmin: "لوحة الأدمن",

    welcomeTitle: "مرحباً بكم في DENTISTOIRE",
    welcomeSubtitle: "مساحة ملهمة ولطيفة لطلاب طب الأسنان السنة الثانية لدراسة شيتات المحاضرات واختبار معلوماتهم في المواد السبعة.",
    statSubjects: "المواد الدراسية",
    statTopics: "شيتات المحاضرات",
    statQuestions: "إجمالي الأسئلة",
    statAccuracy: "نسبة الدقة العامة",

    searchPlaceholder: "ابحث عن الأسئلة، المواد، الشيتات، أو الكلمات المفتاحية...",
    btnStartRandom: "تمرين سريع",
    btnPracticeWeak: "تدريب المواضيع الضعيفة",
    btnBackHome: "العودة للرئيسية",
    btnRetakeQuiz: "إعادة الاختبار",
    btnExitQuiz: "خروج من الاختبار",
    btnPrevious: "السابق",
    btnNext: "السؤال التالي",
    btnFinish: "إنهاء الاختبار",

    sheetsHeader: "شيتات المحاضرات",
    sheetCount: "شيتات",
    startSheetQuiz: "بدء اختبار الشيت",

    questionPaletteBtn: "مستكشف الأسئلة",
    paletteTitle: "خريطة التنقل بين الأسئلة",
    paletteAnswered: "تمت إجابته",
    paletteUnanswered: "لم تتم إجابته",

    explanationTitle: "الشرح الأكاديمي والملاحظات",
    resultsTitle: "ملخص نتيجة الاختبار",
    historyTitle: "سجل محاولات الاختبارات السابقة",

    profileTitle: "الملف الشخصي للطالب",
    labelStudentName: "اسم الطالب",
    labelTargetScore: "الدرجة المستهدفة (%)",
    labelRole: "نوع الحساب",
    roleStudent: "طالب طب أسنان",
    roleAdmin: "مسؤول المنصة (أدمن)",
    adminPasskeyLabel: "رمز أمان الأدمن (الافتراضي: admin123)",
    btnSaveProfile: "حفظ بيانات الملف"
  }
};

class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem("dq_lang") || "en";
  }

  init() {
    this.setLanguage(this.currentLang);
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem("dq_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    this.updateDOM();
  }

  toggleLanguage() {
    const nextLang = this.currentLang === "en" ? "ar" : "en";
    this.setLanguage(nextLang);
    return nextLang;
  }

  t(key) {
    return TRANSLATIONS[this.currentLang][key] || TRANSLATIONS["en"][key] || key;
  }

  updateDOM() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (TRANSLATIONS[this.currentLang][key]) {
        el.textContent = TRANSLATIONS[this.currentLang][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (TRANSLATIONS[this.currentLang][key]) {
        el.setAttribute("placeholder", TRANSLATIONS[this.currentLang][key]);
      }
    });

    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.innerHTML = this.currentLang === "en" 
        ? `<span>العربية</span> <i class="fa-solid fa-language"></i>` 
        : `<span>English</span> <i class="fa-solid fa-language"></i>`;
    }
  }
}

const i18n = new I18nEngine();
