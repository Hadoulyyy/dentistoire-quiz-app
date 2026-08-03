/**
 * DentaQuiz Studio - Main Application Controller
 * Manages 7 Dental Course Subjects, 88 Lecture Sheets, Quiz Engine, History, Student Login/Signup, and Admin Hub.
 */

class ApplicationController {
  constructor() {
    this.currentSubjectId = null;
    this.currentSheetId = null;
    this.activeQuizQuestions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.quizMode = "STUDY";

    this.savedQuestions = JSON.parse(localStorage.getItem("dq_saved_q_v1")) || [];
    this.quizHistory = JSON.parse(localStorage.getItem("dq_history_v1")) || [];
    this.studentSession = JSON.parse(localStorage.getItem("dq_student_session_v1")) || null;

    this.userProfile = this.studentSession || {
      name: "Dental Student",
      email: "student@dentistoire.edu",
      targetScore: 85,
      role: "Student"
    };

    this.questions = INITIAL_DENTAL_QUESTIONS;
    localStorage.setItem("dq_questions_v1", JSON.stringify(this.questions));

    this.init();
  }

  init() {
    i18n.init();
    this.setupEventListeners();
    this.setupAuthListeners();
    this.renderHeaderProfile();
    this.renderDashboardStats();
    this.renderSubjectCards();
    this.updateSavedBadge();
  }

  setupEventListeners() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        if (targetTab) this.switchTab(targetTab, btn);
      });
    });

    const brandHome = document.getElementById("brand-home-click");
    if (brandHome) {
      brandHome.addEventListener("click", () => {
        const homeBtn = document.getElementById("nav-home");
        if (homeBtn) this.switchTab("home-tab", homeBtn);
      });
    }

    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        i18n.toggleLanguage();
        this.renderDashboardStats();
        this.renderSubjectCards();
        if (this.currentSubjectId) this.renderSubjectExplorer(this.currentSubjectId);
        this.renderHistoryLog();
      });
    }

    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleGlobalSearch(e.target.value));
    }

    const btnClearSearch = document.getElementById("btn-clear-search");
    if (btnClearSearch) {
      btnClearSearch.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        document.getElementById("search-results-section").style.display = "none";
      });
    }

    const btnRandomQuiz = document.getElementById("btn-random-quiz");
    if (btnRandomQuiz) {
      btnRandomQuiz.addEventListener("click", () => this.startQuiz(this.questions, "Random Practice Quiz"));
    }

    const btnPracticeWeak = document.getElementById("btn-practice-weak-top");
    if (btnPracticeWeak) {
      btnPracticeWeak.addEventListener("click", () => this.startSavedOrWeakQuiz());
    }

    const btnStartSaved = document.getElementById("btn-start-saved-quiz");
    if (btnStartSaved) {
      btnStartSaved.addEventListener("click", () => this.startSavedOrWeakQuiz());
    }

    document.getElementById("btn-prev-question")?.addEventListener("click", () => this.navigateQuestion(-1));
    document.getElementById("btn-next-question")?.addEventListener("click", () => this.navigateQuestion(1));
    document.getElementById("btn-exit-quiz")?.addEventListener("click", () => this.exitQuiz());
    document.getElementById("btn-retry-quiz")?.addEventListener("click", () => this.startQuiz(this.activeQuizQuestions, "Retake Quiz"));
    document.getElementById("btn-back-dashboard")?.addEventListener("click", () => this.switchTab("home-tab", document.getElementById("nav-home")));

    document.getElementById("btn-bookmark-current")?.addEventListener("click", () => this.toggleBookmarkCurrent());

    const btnOpenPalette = document.getElementById("btn-open-palette");
    const btnClosePalette = document.getElementById("btn-close-palette");
    const paletteOverlay = document.getElementById("palette-modal-overlay");

    if (btnOpenPalette && paletteOverlay) {
      btnOpenPalette.addEventListener("click", () => {
        this.renderPaletteGrid();
        paletteOverlay.style.display = "flex";
      });
    }

    if (btnClosePalette && paletteOverlay) {
      btnClosePalette.addEventListener("click", () => paletteOverlay.style.display = "none");
    }

    document.getElementById("btn-back-subjects-list")?.addEventListener("click", () => {
      this.currentSubjectId = null;
      document.getElementById("btn-back-subjects-list").style.display = "none";
      this.renderSubjectExplorer(null);
    });

    this.setupAdminEvents();
  }

  /* STUDENT LOGIN & SIGN UP MODAL LISTENERS */
  setupAuthListeners() {
    const btnOpenAuth = document.getElementById("btn-open-auth");
    const btnCloseAuth = document.getElementById("btn-close-auth");
    const authOverlay = document.getElementById("auth-modal-overlay");

    const tabLogin = document.getElementById("auth-subtab-login");
    const tabSignup = document.getElementById("auth-subtab-signup");
    const formLogin = document.getElementById("form-student-login");
    const formSignup = document.getElementById("form-student-signup");

    if (btnOpenAuth && authOverlay) {
      btnOpenAuth.addEventListener("click", () => {
        authOverlay.style.display = "flex";
      });
    }

    if (btnCloseAuth && authOverlay) {
      btnCloseAuth.addEventListener("click", () => {
        authOverlay.style.display = "none";
      });
    }

    if (tabLogin && tabSignup) {
      tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        formLogin.style.display = "block";
        formSignup.style.display = "none";
      });

      tabSignup.addEventListener("click", () => {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        formSignup.style.display = "block";
        formLogin.style.display = "none";
      });
    }

    // Login Submission
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const name = email.split("@")[0] || "Dental Student";
        this.userProfile = { name: name, email: email, role: "Student" };
        localStorage.setItem("dq_student_session_v1", JSON.stringify(this.userProfile));
        this.renderHeaderProfile();
        authOverlay.style.display = "none";
        this.showToast(`Welcome back, ${name}! Logged in successfully.`);
      });
    }

    // Sign Up Submission
    if (formSignup) {
      formSignup.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        this.userProfile = { name: name, email: email, role: "Student" };
        localStorage.setItem("dq_student_session_v1", JSON.stringify(this.userProfile));
        this.renderHeaderProfile();
        authOverlay.style.display = "none";
        this.showToast(`Account created! Welcome to DENTISTOIRE, ${name}! 🎉`);
      });
    }
  }

  switchTab(tabId, btnElement) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));

    const targetEl = document.getElementById(tabId);
    if (targetEl) targetEl.classList.add("active");
    if (btnElement) btnElement.classList.add("active");

    if (tabId === "saved-tab") this.renderSavedList();
    if (tabId === "history-tab") this.renderHistoryLog();
    if (tabId === "analytics-tab") this.renderAnalytics();
    if (tabId === "admin-tab") this.renderAdminQuestionsTable();
    if (tabId === "subjects-tab") this.renderSubjectExplorer(this.currentSubjectId);
  }

  renderHeaderProfile() {
    const el = document.getElementById("header-user-name");
    if (el) {
      if (this.userProfile && this.userProfile.name && this.userProfile.name !== "Dental Student") {
        el.textContent = this.userProfile.name;
      } else {
        el.textContent = "Login / Sign Up";
      }
    }
  }

  renderDashboardStats() {
    const isAr = i18n.currentLang === "ar";
    document.getElementById("stat-subjects-count").textContent = DENTAL_SUBJECTS_TAXONOMY.length;

    let totalSheets = 0;
    DENTAL_SUBJECTS_TAXONOMY.forEach(s => totalSheets += s.sheets.length);
    document.getElementById("stat-topics-count").textContent = totalSheets;
    document.getElementById("stat-questions-count").textContent = this.questions.length;

    let totalAttempts = 0, totalCorrect = 0;
    this.quizHistory.forEach(h => {
      totalAttempts += h.total;
      totalCorrect += h.score;
    });

    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    document.getElementById("stat-accuracy-rate").textContent = `${accuracy}%`;
  }

  renderSubjectCards() {
    const grid = document.getElementById("subjects-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const isAr = i18n.currentLang === "ar";

    DENTAL_SUBJECTS_TAXONOMY.forEach(subj => {
      const subjQuestions = this.questions.filter(q => q.subjectId === subj.id);
      const card = document.createElement("div");
      card.className = "subject-card";
      card.style.borderTop = `4px solid ${subj.color}`;

      const name = isAr ? subj.nameAr : subj.nameEn;

      card.innerHTML = `
        <div>
          <div class="subject-header">
            <div class="subject-icon-box" style="background: ${subj.color};">
              <i class="fa-solid ${subj.icon}"></i>
            </div>
            <div>
              <h3>${name}</h3>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">${subj.sheets.length} ${isAr ? 'شيتات رسمية' : 'Official Sheets'}</div>
            </div>
          </div>

          <div class="subject-meta">
            <span>${subj.sheets.length} ${isAr ? 'شيتات' : 'Sheets'}</span>
            <span>•</span>
            <span>${subjQuestions.length} ${isAr ? 'أسئلة' : 'Questions'}</span>
          </div>
        </div>

        <button class="btn-primary" style="width: 100%; justify-content: center; background: ${subj.color}; border: none;">
          ${isAr ? 'استكشاف الشيتات' : 'Explore Sheets'}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        this.currentSubjectId = subj.id;
        const subjTab = document.getElementById("nav-subjects");
        this.switchTab("subjects-tab", subjTab);
      });

      grid.appendChild(card);
    });
  }

  renderSubjectExplorer(subjId) {
    const container = document.getElementById("subject-explorer-content");
    const titleEl = document.getElementById("subject-explorer-title");
    if (!container) return;

    const isAr = i18n.currentLang === "ar";

    if (!subjId) {
      titleEl.innerHTML = `${isAr ? 'مكتبة شيتات المحاضرات الرسمية' : 'Official Course Sheets Library'}`;
      container.innerHTML = `<div class="subject-grid"></div>`;
      const grid = container.querySelector(".subject-grid");

      DENTAL_SUBJECTS_TAXONOMY.forEach(subj => {
        const subjQuestions = this.questions.filter(q => q.subjectId === subj.id);
        const card = document.createElement("div");
        card.className = "subject-card";
        card.style.borderTop = `4px solid ${subj.color}`;
        const name = isAr ? subj.nameAr : subj.nameEn;

        card.innerHTML = `
          <div class="subject-header">
            <div class="subject-icon-box" style="background: ${subj.color};">
              <i class="fa-solid ${subj.icon}"></i>
            </div>
            <div>
              <h3>${name}</h3>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">${subj.sheets.length} ${isAr ? 'شيتات' : 'Lecture Sheets'}</div>
            </div>
          </div>
          <button class="btn-primary" style="width: 100%; justify-content: center; background: ${subj.color};">
            ${isAr ? 'عرض الشيتات' : 'View Lecture Sheets'}
          </button>
        `;

        card.querySelector("button").addEventListener("click", () => {
          this.currentSubjectId = subj.id;
          document.getElementById("btn-back-subjects-list").style.display = "inline-flex";
          this.renderSubjectExplorer(subj.id);
        });

        grid.appendChild(card);
      });
      return;
    }

    const subj = DENTAL_SUBJECTS_TAXONOMY.find(s => s.id === subjId);
    if (!subj) return;

    const subjName = isAr ? subj.nameAr : subj.nameEn;
    titleEl.innerHTML = `${subjName} (${subj.sheets.length} ${isAr ? 'شيتات' : 'Lecture Sheets'})`;

    container.innerHTML = `<div class="sheets-organized-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.2rem;"></div>`;
    const grid = container.querySelector(".sheets-organized-grid");

    subj.sheets.forEach((sheet, idx) => {
      const sheetQuestions = this.questions.filter(q => q.subjectId === subj.id && q.sheetId === sheet.id);
      const card = document.createElement("div");
      card.className = "sheet-clean-card";
      card.style.background = "#ffffff";
      card.style.border = "1px solid #eedcd3";
      card.style.borderRadius = "16px";
      card.style.padding = "1.4rem 1.6rem";
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";
      card.style.gap = "1rem";
      card.style.boxShadow = "0 4px 14px rgba(61, 38, 38, 0.03)";
      card.style.transition = "all 0.25s ease";

      const sheetTitle = isAr ? sheet.titleAr : sheet.titleEn;

      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(197, 133, 133, 0.12); color: var(--accent-primary); font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${idx + 1}
          </div>
          <div>
            <div style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 600; color: var(--text-main); line-height: 1.3;">
              ${sheetTitle}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${sheetQuestions.length > 0 ? sheetQuestions.length : 1} ${isAr ? 'أسئلة متاحة' : 'questions available'}
            </div>
          </div>
        </div>

        <button class="btn-primary btn-start-sheet-quiz" style="background: ${subj.color}; border: none; padding: 0.55rem 1.1rem; font-size: 0.85rem; flex-shrink: 0;">
          ${isAr ? 'بدء الاختبار' : 'Take Quiz'}
        </button>
      `;

      card.addEventListener("mouseenter", () => {
        card.style.borderColor = subj.color;
        card.style.transform = "translateY(-2px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.borderColor = "#eedcd3";
        card.style.transform = "translateY(0)";
      });

      card.querySelector(".btn-start-sheet-quiz").addEventListener("click", (e) => {
        e.stopPropagation();
        let qList = sheetQuestions;
        if (qList.length === 0) {
          qList = this.questions.filter(q => q.subjectId === subj.id);
        }
        this.startQuiz(qList, `${subjName} - ${sheetTitle}`);
      });

      grid.appendChild(card);
    });
  }

  /* QUIZ ENGINE */
  startQuiz(questionsList, quizTitle = "Dental Quiz") {
    if (!questionsList || questionsList.length === 0) {
      this.showToast("No questions available for this selection.");
      return;
    }

    this.activeQuizQuestions = [...questionsList];
    this.currentQuestionIndex = 0;
    this.userAnswers = {};

    document.getElementById("quiz-title-display").textContent = quizTitle;
    this.switchTab("quiz-tab");
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    const q = this.activeQuizQuestions[this.currentQuestionIndex];
    if (!q) return;

    const isAr = i18n.currentLang === "ar";
    const total = this.activeQuizQuestions.length;

    document.getElementById("quiz-progress-text").textContent = isAr 
      ? `السؤال ${this.currentQuestionIndex + 1} من ${total}` 
      : `Question ${this.currentQuestionIndex + 1} of ${total}`;

    const fillPercent = ((this.currentQuestionIndex + 1) / total) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${fillPercent}%`;

    const btnBookmark = document.getElementById("btn-bookmark-current");
    const isBookmarked = this.savedQuestions.some(sq => sq.id === q.id);
    if (btnBookmark) {
      btnBookmark.classList.toggle("bookmarked", isBookmarked);
      btnBookmark.innerHTML = isBookmarked ? `<i class="fa-solid fa-star"></i>` : `<i class="fa-regular fa-star"></i>`;
    }

    document.getElementById("meta-badge-type").textContent = q.type || "MCQ";
    document.getElementById("meta-badge-topic").textContent = q.topic || "Lecture Sheet";
    document.getElementById("meta-badge-difficulty").textContent = q.difficulty || "Medium";

    const yearBadge = document.getElementById("meta-badge-year");
    if (q.yearLabel) {
      yearBadge.textContent = q.yearLabel;
      yearBadge.style.display = "inline-block";
    } else {
      yearBadge.style.display = "none";
    }

    const qText = isAr && q.questionTextAr ? q.questionTextAr : q.questionTextEn;
    document.getElementById("quiz-question-text").textContent = qText;

    const optsContainer = document.getElementById("quiz-options-container");
    optsContainer.innerHTML = "";

    const options = isAr && q.optionsAr ? q.optionsAr : q.optionsEn;
    const currentSelected = this.userAnswers[this.currentQuestionIndex];

    options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      const keyLetter = String.fromCharCode(65 + idx);

      btn.innerHTML = `
        <span class="option-key">${keyLetter}</span>
        <span>${optText}</span>
      `;

      if (currentSelected === idx) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () => {
        this.userAnswers[this.currentQuestionIndex] = idx;
        this.renderCurrentQuestion();
        this.showExplanation(q);
      });

      optsContainer.appendChild(btn);
    });

    document.getElementById("btn-prev-question").disabled = this.currentQuestionIndex === 0;

    const btnNext = document.getElementById("btn-next-question");
    if (this.currentQuestionIndex === total - 1) {
      btnNext.innerHTML = `<span data-i18n="btnFinish">${isAr ? 'إنهاء الاختبار' : 'Submit Quiz'}</span> <i class="fa-solid fa-check"></i>`;
    } else {
      btnNext.innerHTML = `<span data-i18n="btnNext">${isAr ? 'السؤال التالي' : 'Next Question'}</span> <i class="fa-solid fa-arrow-right"></i>`;
    }

    if (currentSelected !== undefined) {
      this.showExplanation(q);
    } else {
      document.getElementById("quiz-explanation").classList.remove("visible");
    }
  }

  showExplanation(q) {
    const isAr = i18n.currentLang === "ar";
    const expBox = document.getElementById("quiz-explanation");
    const expText = document.getElementById("quiz-explanation-text");

    const text = isAr && q.explanationAr ? q.explanationAr : q.explanationEn;
    expText.textContent = text || (isAr ? "لا يوجد شرح إضافي لهذا السؤال." : "No additional explanation provided for this question.");
    expBox.classList.add("visible");
  }

  navigateQuestion(direction) {
    const newIdx = this.currentQuestionIndex + direction;
    if (newIdx >= 0 && newIdx < this.activeQuizQuestions.length) {
      this.currentQuestionIndex = newIdx;
      this.renderCurrentQuestion();
    } else if (newIdx >= this.activeQuizQuestions.length) {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    let score = 0;
    const total = this.activeQuizQuestions.length;

    this.activeQuizQuestions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });

    const percent = Math.round((score / total) * 100);

    const attempt = {
      id: "attempt_" + Date.now(),
      timestamp: new Date().toLocaleDateString(),
      quizTitle: document.getElementById("quiz-title-display").textContent,
      score: score,
      total: total,
      percent: percent
    };

    this.quizHistory.unshift(attempt);
    localStorage.setItem("dq_history_v1", JSON.stringify(this.quizHistory));

    document.getElementById("res-percent").textContent = `${percent}%`;
    document.getElementById("res-fraction").textContent = `${score}/${total} Correct`;

    const isAr = i18n.currentLang === "ar";
    const msg = percent >= 80 
      ? (isAr ? "أداء ممتاز! لقد اجتزت اختبار الشيت بنجاح." : "Excellent performance! You mastered this dental sheet.") 
      : (isAr ? "أداء جيد، يوصى بمراجعة شيت المحاضرة مجدداً." : "Good effort. Review the lecture sheet items to improve your score.");

    document.getElementById("res-message").textContent = msg;
    this.switchTab("results-tab");
    this.renderDashboardStats();
  }

  exitQuiz() {
    if (confirm("Are you sure you want to exit this quiz session?")) {
      this.switchTab("home-tab", document.getElementById("nav-home"));
    }
  }

  toggleBookmarkCurrent() {
    const q = this.activeQuizQuestions[this.currentQuestionIndex];
    if (!q) return;

    const idx = this.savedQuestions.findIndex(sq => sq.id === q.id);
    if (idx >= 0) {
      this.savedQuestions.splice(idx, 1);
      this.showToast("Question removed from saved revision items.");
    } else {
      this.savedQuestions.push(q);
      this.showToast("Question saved to your Revision Bank!");
    }

    localStorage.setItem("dq_saved_q_v1", JSON.stringify(this.savedQuestions));
    this.updateSavedBadge();
    this.renderCurrentQuestion();
  }

  updateSavedBadge() {
    const badge = document.getElementById("saved-count-badge");
    if (badge) badge.textContent = this.savedQuestions.length;
  }

  startSavedOrWeakQuiz() {
    if (this.savedQuestions.length === 0) {
      this.showToast("No saved questions yet. Star questions during quizzes to practice them here!");
      return;
    }
    this.startQuiz(this.savedQuestions, "Revision Bank Practice");
  }

  renderSavedList() {
    const container = document.getElementById("saved-questions-list");
    if (!container) return;
    container.innerHTML = "";

    if (this.savedQuestions.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem;">No saved questions yet. Click the star icon during quizzes to bookmark items here.</div>`;
      return;
    }

    const isAr = i18n.currentLang === "ar";

    this.savedQuestions.forEach((q, idx) => {
      const card = document.createElement("div");
      card.className = "question-card";
      card.style.margin = "0";

      const qText = isAr && q.questionTextAr ? q.questionTextAr : q.questionTextEn;

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="meta-badge">${q.topic || 'Lecture Sheet'}</span>
            <span class="meta-badge">${q.difficulty || 'Medium'}</span>
          </div>
          <button class="icon-btn danger btn-remove-saved"><i class="fa-solid fa-trash"></i></button>
        </div>

        <div style="font-weight: 700; font-size: 1.1rem; margin: 1rem 0;">${qText}</div>
        <div style="font-size: 0.88rem; color: var(--text-muted);">${isAr && q.explanationAr ? q.explanationAr : q.explanationEn}</div>
      `;

      card.querySelector(".btn-remove-saved").addEventListener("click", () => {
        this.savedQuestions.splice(idx, 1);
        localStorage.setItem("dq_saved_q_v1", JSON.stringify(this.savedQuestions));
        this.updateSavedBadge();
        this.renderSavedList();
      });

      container.appendChild(card);
    });
  }

  renderPaletteGrid() {
    const container = document.getElementById("palette-grid-container");
    if (!container) return;
    container.innerHTML = "";

    this.activeQuizQuestions.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.className = "palette-num-btn";
      btn.textContent = idx + 1;

      if (this.userAnswers[idx] !== undefined) {
        btn.classList.add("answered");
      }
      if (this.currentQuestionIndex === idx) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        this.currentQuestionIndex = idx;
        this.renderCurrentQuestion();
        document.getElementById("palette-modal-overlay").style.display = "none";
      });

      container.appendChild(btn);
    });
  }

  renderHistoryLog() {
    const container = document.getElementById("history-attempts-container");
    if (!container) return;
    container.innerHTML = "";

    if (this.quizHistory.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No completed quiz attempts recorded yet.</div>`;
      return;
    }

    this.quizHistory.forEach(h => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.style.display = "flex";
      card.style.justifySpaceBetween = "space-between";
      card.style.alignItems = "center";
      card.style.padding = "1.2rem 1.6rem";
      card.style.textAlign = "left";

      card.innerHTML = `
        <div>
          <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">${h.quizTitle}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">
            <i class="fa-regular fa-calendar"></i> ${h.timestamp}
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary);">${h.percent}%</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${h.score}/${h.total} Correct</div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  /* RENDER ANALYTICS & WEAK TOPICS (SHOW UNKNOWN IF NO QUIZZES TAKEN YET) */
  renderAnalytics() {
    let totalAttempts = 0, totalCorrect = 0;
    this.quizHistory.forEach(h => {
      totalAttempts += h.total;
      totalCorrect += h.score;
    });

    const acc = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    document.getElementById("analytic-accuracy").textContent = `${acc}%`;
    document.getElementById("analytic-quizzes-completed").textContent = this.quizHistory.length;
    document.getElementById("analytic-saved-items").textContent = this.savedQuestions.length;

    const weakCountEl = document.getElementById("analytic-weak-topics-count");
    const weakContainer = document.getElementById("weak-topics-container");
    const isAr = i18n.currentLang === "ar";

    if (this.quizHistory.length === 0) {
      if (weakCountEl) weakCountEl.textContent = isAr ? "غير معروف" : "Unknown";
      if (weakContainer) {
        weakContainer.innerHTML = `
          <div style="text-align: center; color: var(--text-muted); padding: 2rem; background: #ffffff; border: 1px solid #eedcd3; border-radius: 16px;">
            <i class="fa-solid fa-circle-info" style="font-size: 1.5rem; color: var(--accent-primary); margin-bottom: 0.5rem; display: block;"></i>
            <strong>${isAr ? 'لا توجد مواضيع ضعيفة محددة حتى الآن' : 'No weak topics detected yet'}</strong>
            <p style="font-size: 0.88rem; margin-top: 0.4rem;">
              ${isAr ? 'قم بإجراء اختبارات الشيتات وسيقوم المحلل بتقييم مستواك وتحديد النقاط الضعيفة تلقائياً.' : 'Complete quiz sessions and the engine will automatically detect topics where you need practice.'}
            </p>
          </div>
        `;
      }
    } else {
      if (weakCountEl) weakCountEl.textContent = "0";
      if (weakContainer) {
        weakContainer.innerHTML = `
          <div style="text-align: center; color: var(--success-color); padding: 1.5rem; background: var(--success-bg); border: 1px solid var(--success-color); border-radius: 16px;">
            <i class="fa-solid fa-circle-check" style="font-size: 1.5rem; margin-bottom: 0.4rem; display: block;"></i>
            <strong>${isAr ? 'أداؤك رائع! لا توجد مواضيع ضعيفة حرجة حتى الآن.' : 'Great job! No critical weak topics detected in your recorded attempts.'}</strong>
          </div>
        `;
      }
    }
  }

  handleGlobalSearch(query) {
    const qTrim = query.trim().toLowerCase();
    const section = document.getElementById("search-results-section");
    const list = document.getElementById("search-results-list");
    const countEl = document.getElementById("search-count");

    if (!qTrim) {
      section.style.display = "none";
      return;
    }

    const isAr = i18n.currentLang === "ar";
    const matches = this.questions.filter(q => {
      const qTextEn = (q.questionTextEn || "").toLowerCase();
      const qTextAr = (q.questionTextAr || "").toLowerCase();
      const topic = (q.topic || "").toLowerCase();
      return qTextEn.includes(qTrim) || qTextAr.includes(qTrim) || topic.includes(qTrim);
    });

    countEl.textContent = matches.length;
    list.innerHTML = "";

    if (matches.length === 0) {
      list.innerHTML = `<div style="color: var(--text-muted); font-size: 0.9rem;">No matching questions found for "${query}".</div>`;
    } else {
      matches.slice(0, 10).forEach(q => {
        const item = document.createElement("div");
        item.className = "question-card";
        item.style.margin = "0";

        const qText = isAr && q.questionTextAr ? q.questionTextAr : q.questionTextEn;

        item.innerHTML = `
          <div style="font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">${qText}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${q.topic}</div>
        `;

        item.addEventListener("click", () => this.startQuiz([q], "Search Practice Question"));
        list.appendChild(item);
      });
    }

    section.style.display = "block";
  }

  setupAdminEvents() {
    const btnExport = document.getElementById("btn-export-database");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.questions, null, 2));
        const anchor = document.createElement("a");
        anchor.setAttribute("href", dataStr);
        anchor.setAttribute("download", "dentaquiz_database_backup.json");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        this.showToast("Database exported successfully!");
      });
    }
  }

  renderAdminQuestionsTable() {
    const tbody = document.getElementById("admin-questions-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    this.questions.slice(0, 15).forEach((q, idx) => {
      const tr = document.createElement("tr");
      const subj = DENTAL_SUBJECTS_TAXONOMY.find(s => s.id === q.subjectId);
      const subjName = subj ? subj.nameEn : "General";

      tr.innerHTML = `
        <td>${subjName}</td>
        <td>${q.topic || 'Sheet'}</td>
        <td style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${q.questionTextEn}</td>
        <td>${q.difficulty || 'Medium'}</td>
        <td>
          <button class="icon-btn btn-delete-q" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;

      tr.querySelector(".btn-delete-q").addEventListener("click", () => {
        if (confirm("Delete this question from database?")) {
          this.questions.splice(idx, 1);
          localStorage.setItem("dq_questions_v1", JSON.stringify(this.questions));
          this.renderAdminQuestionsTable();
          this.renderDashboardStats();
          this.showToast("Question deleted.");
        }
      });

      tbody.appendChild(tr);
    });
  }

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-primary);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new ApplicationController();
});
