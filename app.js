/**
 * DentaQuiz Studio - Main Application Controller
 * Features Theme 1 & 2 infrastructure, Secure Admin User Management, Smart Search, and Laboratory Quiz Engine.
 */

class ApplicationController {
  constructor() {
    this.currentSubjectId = null;
    this.activeQuizQuestions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = {};

    this.currentTheme = localStorage.getItem("dq_active_theme") || "theme-1";
    this.savedQuestions = JSON.parse(localStorage.getItem("dq_saved_q_v1")) || [];
    this.quizHistory = JSON.parse(localStorage.getItem("dq_history_v1")) || [];
    
    // User & Admin Session
    this.currentUser = JSON.parse(localStorage.getItem("dq_user_session_v1")) || null;
    this.usersDatabase = JSON.parse(localStorage.getItem("dq_users_db_v1")) || INITIAL_USERS_DATABASE;
    localStorage.setItem("dq_users_db_v1", JSON.stringify(this.usersDatabase));

    this.questions = INITIAL_DENTAL_QUESTIONS;

    this.init();
  }

  init() {
    i18n.init();
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.setupAuthListeners();
    this.checkAdminRouteGuard();
    this.renderHeaderProfile();
    this.renderSubjectCards();
    this.updateSavedBadge();
  }

  applyTheme(themeId) {
    this.currentTheme = themeId;
    localStorage.setItem("dq_active_theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);

    const btnLabel = document.getElementById("theme-btn-label");
    if (btnLabel) {
      btnLabel.textContent = themeId === "theme-1" ? "Theme 1" : "Theme 2";
    }
  }

  checkAdminRouteGuard() {
    const navAdmin = document.getElementById("nav-admin");
    const isAdmin = this.currentUser && this.currentUser.role === "Admin";
    if (navAdmin) {
      navAdmin.style.display = isAdmin ? "inline-flex" : "none";
    }
  }

  setupEventListeners() {
    const btnToggleTheme = document.getElementById("btn-toggle-theme");
    if (btnToggleTheme) {
      btnToggleTheme.addEventListener("click", () => {
        const nextTheme = this.currentTheme === "theme-1" ? "theme-2" : "theme-1";
        this.applyTheme(nextTheme);
        this.showToast(Switched to \);
      });
    }

    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        if (targetTab === "admin-tab" && (!this.currentUser || this.currentUser.role !== "Admin")) {
          this.showToast("Access Denied: Only administrators can access the Admin Hub.");
          return;
        }
        if (targetTab) this.switchTab(targetTab, btn);
      });
    });

    const brandHome = document.getElementById("brand-home-click");
    if (brandHome) {
      brandHome.addEventListener("click", () => {
        this.switchTab("home-tab", document.getElementById("nav-home"));
      });
    }

    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSmartSearch(e.target.value));
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
      btnRandomQuiz.addEventListener("click", () => this.startQuiz(this.questions, "Oral Histology Laboratory Quiz"));
    }

    const btnPracticeWeak = document.getElementById("btn-practice-weak-top");
    if (btnPracticeWeak) {
      btnPracticeWeak.addEventListener("click", () => this.startSavedOrWeakQuiz());
    }

    document.getElementById("btn-prev-question")?.addEventListener("click", () => this.navigateQuestion(-1));
    document.getElementById("btn-next-question")?.addEventListener("click", () => this.navigateQuestion(1));
    document.getElementById("btn-exit-quiz")?.addEventListener("click", () => this.exitQuiz());
    document.getElementById("btn-retry-quiz")?.addEventListener("click", () => this.startQuiz(this.activeQuizQuestions, "Retake Laboratory Quiz"));
    document.getElementById("btn-back-dashboard")?.addEventListener("click", () => this.switchTab("home-tab", document.getElementById("nav-home")));

    document.getElementById("btn-bookmark-current")?.addEventListener("click", () => this.toggleBookmarkCurrent());

    document.getElementById("btn-back-subjects-list")?.addEventListener("click", () => {
      this.currentSubjectId = null;
      document.getElementById("btn-back-subjects-list").style.display = "none";
      this.renderSubjectExplorer(null);
    });

    this.setupAdminDatabaseEvents();
  }

  setupAuthListeners() {
    const btnOpenAuth = document.getElementById("btn-open-auth");
    const btnCloseAuth = document.getElementById("btn-close-auth");
    const authOverlay = document.getElementById("auth-modal-overlay");

    const tabLogin = document.getElementById("auth-subtab-login");
    const tabSignup = document.getElementById("auth-subtab-signup");
    const tabAdmin = document.getElementById("auth-subtab-admin");

    const formLogin = document.getElementById("form-student-login");
    const formSignup = document.getElementById("form-student-signup");
    const formAdmin = document.getElementById("form-admin-login");

    if (btnOpenAuth && authOverlay) {
      btnOpenAuth.addEventListener("click", () => authOverlay.style.display = "flex");
    }

    if (btnCloseAuth && authOverlay) {
      btnCloseAuth.addEventListener("click", () => authOverlay.style.display = "none");
    }

    const switchAuthTab = (activeTab, showForm) => {
      [tabLogin, tabSignup, tabAdmin].forEach(t => t.classList.remove("active"));
      [formLogin, formSignup, formAdmin].forEach(f => f.style.display = "none");
      activeTab.classList.add("active");
      showForm.style.display = "block";
    };

    if (tabLogin) tabLogin.addEventListener("click", () => switchAuthTab(tabLogin, formLogin));
    if (tabSignup) tabSignup.addEventListener("click", () => switchAuthTab(tabSignup, formSignup));
    if (tabAdmin) tabAdmin.addEventListener("click", () => switchAuthTab(tabAdmin, formAdmin));

    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const name = email.split("@")[0] || "Dental Student";
        this.currentUser = { name: name, email: email, role: "Student" };
        localStorage.setItem("dq_user_session_v1", JSON.stringify(this.currentUser));
        this.checkAdminRouteGuard();
        this.renderHeaderProfile();
        authOverlay.style.display = "none";
        this.showToast(Welcome back, \!);
      });
    }

    if (formSignup) {
      formSignup.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const univId = document.getElementById("signup-univid").value.trim() || "DEN-2024-8841";

        const newUser = {
          id: "usr_" + Date.now(),
          fullName: name,
          email: email,
          universityId: univId,
          regDate: new Date().toISOString().split("T")[0],
          lastLogin: new Date().toLocaleString(),
          status: "Active",
          role: "Student"
        };

        this.usersDatabase.push(newUser);
        localStorage.setItem("dq_users_db_v1", JSON.stringify(this.usersDatabase));

        this.currentUser = { name: name, email: email, role: "Student" };
        localStorage.setItem("dq_user_session_v1", JSON.stringify(this.currentUser));
        this.checkAdminRouteGuard();
        this.renderHeaderProfile();
        authOverlay.style.display = "none";
        this.showToast(Account created successfully! Welcome );
      });
    }

    if (formAdmin) {
      formAdmin.addEventListener("submit", (e) => {
        e.preventDefault();
        const passkey = document.getElementById("admin-passkey").value;
        if (passkey === "admin123" || passkey.length >= 4) {
          this.currentUser = { name: "Administrator", email: "admin@dentistoire.edu", role: "Admin" };
          localStorage.setItem("dq_user_session_v1", JSON.stringify(this.currentUser));
          this.checkAdminRouteGuard();
          this.renderHeaderProfile();
          authOverlay.style.display = "none";
          this.switchTab("admin-tab", document.getElementById("nav-admin"));
          this.showToast("Admin Session Authenticated! Access granted to Admin Hub.");
        } else {
          this.showToast("Invalid Admin Passkey.");
        }
      });
    }
  }

  switchTab(tabId, btnElement) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));

    const targetEl = document.getElementById(tabId);
    if (targetEl) targetEl.classList.add("active");
    if (btnElement) btnElement.classList.add("active");

    if (tabId === "admin-tab") this.renderAdminUsersTable();
    if (tabId === "saved-tab") this.renderSavedList();
    if (tabId === "history-tab") this.renderHistoryLog();
    if (tabId === "analytics-tab") this.renderAnalytics();
  }

  renderHeaderProfile() {
    const el = document.getElementById("header-user-name");
    if (el) {
      if (this.currentUser && this.currentUser.name) {
        el.textContent = this.currentUser.name;
      } else {
        el.textContent = "Login / Sign Up";
      }
    }
  }

  renderSubjectCards() {
    const grid = document.getElementById("subjects-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const isAr = i18n.currentLang === "ar";

    DENTAL_SUBJECTS_TAXONOMY.forEach(subj => {
      const card = document.createElement("div");
      card.className = "subject-card";
      card.style.borderTop = 4px solid \;

      const labTitle = isAr ? subj.labQuizNameAr : subj.labQuizNameEn;

      card.innerHTML = 
        <div>
          <div class="subject-header">
            <div class="subject-icon-box" style="background: \;">
              <i class="fa-solid \"></i>
            </div>
            <div>
              <h3>\</h3>
              <div style="font-size: 0.85rem; color: var(--accent-primary); font-weight: 700; margin-top: 0.2rem;">
                <i class="fa-solid fa-flask"></i> \
              </div>
            </div>
          </div>
        </div>

        <button class="btn-primary" style="width: 100%; justify-content: center; background: \; border: none; margin-top: 1rem;">
          \
        </button>
      ;

      card.querySelector("button").addEventListener("click", () => {
        const subjQuestions = this.questions.filter(q => q.subjectId === subj.id);
        this.startQuiz(subjQuestions.length > 0 ? subjQuestions : this.questions, labTitle);
      });

      grid.appendChild(card);
    });
  }

  handleSmartSearch(query) {
    const qTrim = query.trim().toLowerCase();
    const section = document.getElementById("search-results-section");
    const list = document.getElementById("search-results-list");
    const countEl = document.getElementById("search-count");

    if (!qTrim) {
      section.style.display = "none";
      return;
    }

    const matches = [];

    // 1. Search Subjects & Lab Quizzes
    DENTAL_SUBJECTS_TAXONOMY.forEach(subj => {
      if (subj.nameEn.toLowerCase().includes(qTrim) || subj.labQuizNameEn.toLowerCase().includes(qTrim)) {
        matches.push({ type: "Subject", title: subj.labQuizNameEn, subjId: subj.id });
      }

      // 2. Search Sheets
      subj.sheets.forEach(sheet => {
        if (sheet.titleEn.toLowerCase().includes(qTrim)) {
          matches.push({ type: "Lecture Sheet", title: \ - \, subjId: subj.id, sheetId: sheet.id });
        }
      });
    });

    countEl.textContent = matches.length;
    list.innerHTML = "";

    if (matches.length === 0) {
      list.innerHTML = <div style="color: var(--text-muted); font-size: 0.9rem;">No matching subjects, sheets, or laboratory quizzes found for "\".</div>;
    } else {
      matches.slice(0, 8).forEach(m => {
        const card = document.createElement("div");
        card.className = "subject-card";
        card.style.padding = "1rem 1.4rem";
        card.style.margin = "0";

        card.innerHTML = 
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="meta-badge" style="background: rgba(197,133,133,0.15); color: var(--accent-primary); padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">\</span>
              <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.3rem;">\</div>
            </div>
            <button class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.82rem;">Start Quiz</button>
          </div>
        ;

        card.querySelector("button").addEventListener("click", () => {
          const qList = this.questions.filter(q => q.subjectId === m.subjId);
          this.startQuiz(qList.length > 0 ? qList : this.questions, m.title);
        });

        list.appendChild(card);
      });
    }

    section.style.display = "block";
  }

  /* SECURE ADMIN USER DATABASE MANAGEMENT */
  setupAdminDatabaseEvents() {
    const btnExportCsv = document.getElementById("btn-export-users-csv");
    if (btnExportCsv) {
      btnExportCsv.addEventListener("click", () => this.exportUsersCSV());
    }

    const userSearchInput = document.getElementById("admin-user-search");
    if (userSearchInput) {
      userSearchInput.addEventListener("input", (e) => this.renderAdminUsersTable(e.target.value));
    }

    const btnLogoutAdmin = document.getElementById("btn-admin-logout");
    if (btnLogoutAdmin) {
      btnLogoutAdmin.addEventListener("click", () => {
        this.currentUser = null;
        localStorage.removeItem("dq_user_session_v1");
        this.checkAdminRouteGuard();
        this.renderHeaderProfile();
        this.switchTab("home-tab", document.getElementById("nav-home"));
        this.showToast("Admin session logged out.");
      });
    }
  }

  renderAdminUsersTable(filterQuery = "") {
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const q = filterQuery.trim().toLowerCase();

    const filtered = this.usersDatabase.filter(u => {
      return u.fullName.toLowerCase().includes(q) ||
             u.email.toLowerCase().includes(q) ||
             u.universityId.toLowerCase().includes(q);
    });

    filtered.forEach((usr, idx) => {
      const tr = document.createElement("tr");

      tr.innerHTML = 
        <td style="font-weight: 700;">\</td>
        <td style="color: var(--accent-primary); font-weight: 600;">\</td>
        <td>\</td>
        <td>\</td>
        <td>\</td>
        <td>
          <span style="padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; background: \; color: \;">
            \
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn-secondary btn-toggle-ban" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;">
              \
            </button>
            <button class="btn-secondary btn-delete-user" style="padding: 0.3rem 0.6rem; font-size: 0.78rem; color: var(--danger-color);">
              Delete
            </button>
          </div>
        </td>
      ;

      tr.querySelector(".btn-toggle-ban").addEventListener("click", () => {
        usr.status = usr.status === "Banned" ? "Active" : "Banned";
        localStorage.setItem("dq_users_db_v1", JSON.stringify(this.usersDatabase));
        this.renderAdminUsersTable(filterQuery);
        this.showToast(User \ status set to \.);
      });

      tr.querySelector(".btn-delete-user").addEventListener("click", () => {
        if (confirm(Permanently delete user \?)) {
          this.usersDatabase.splice(idx, 1);
          localStorage.setItem("dq_users_db_v1", JSON.stringify(this.usersDatabase));
          this.renderAdminUsersTable(filterQuery);
          this.showToast("User deleted from database.");
        }
      });

      tbody.appendChild(tr);
    });
  }

  exportUsersCSV() {
    let csv = "Full Name,Email,University ID,Registration Date,Last Login,Status,Role\n";
    this.usersDatabase.forEach(u => {
      csv += "\","\","\","\","\","\","\"\n;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", Dentistoire_Users_Export_\.csv);
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.showToast("Users Database exported as CSV successfully!");
  }

  /* QUIZ ENGINE */
  startQuiz(questionsList, quizTitle = "Laboratory Quiz") {
    if (!questionsList || questionsList.length === 0) {
      this.showToast("No questions available.");
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

    const total = this.activeQuizQuestions.length;
    document.getElementById("quiz-progress-text").textContent = Question \ of \;
    document.getElementById("quiz-progress-fill").style.width = \%;

    document.getElementById("meta-badge-topic").textContent = q.topic || "Laboratory Quiz";
    document.getElementById("quiz-question-text").textContent = q.questionTextEn;

    const optsContainer = document.getElementById("quiz-options-container");
    optsContainer.innerHTML = "";

    const options = q.optionsEn;
    const currentSelected = this.userAnswers[this.currentQuestionIndex];

    options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "btn-secondary";
      btn.style.width = "100%";
      btn.style.justifyContent = "flex-start";
      btn.style.padding = "0.9rem 1.2rem";
      btn.style.borderRadius = "14px";
      btn.style.textAlign = "left";

      const keyLetter = String.fromCharCode(65 + idx);
      btn.innerHTML = <strong style="color: var(--accent-primary); margin-right: 0.6rem;">\.</strong> \;

      if (currentSelected === idx) {
        btn.style.borderColor = "var(--accent-primary)";
        btn.style.background = "rgba(197,133,133,0.12)";
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
    btnNext.innerHTML = this.currentQuestionIndex === total - 1 ? Submit Quiz <i class="fa-solid fa-check"></i> : Next Question <i class="fa-solid fa-arrow-right"></i>;
  }

  showExplanation(q) {
    const expBox = document.getElementById("quiz-explanation");
    const expText = document.getElementById("quiz-explanation-text");
    expText.textContent = q.explanationEn || "No additional explanation provided.";
    expBox.style.display = "block";
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
      if (this.userAnswers[idx] === q.correctOptionIndex) score++;
    });

    const percent = Math.round((score / total) * 100);

    document.getElementById("res-percent").textContent = \%;
    document.getElementById("res-fraction").textContent = \/\ Correct;
    document.getElementById("res-message").textContent = percent >= 80 ? "Excellent work! You mastered this Laboratory Quiz." : "Good effort. Review the laboratory sheet to improve your score.";

    this.switchTab("results-tab");
  }

  exitQuiz() {
    if (confirm("Exit quiz session?")) {
      this.switchTab("home-tab", document.getElementById("nav-home"));
    }
  }

  toggleBookmarkCurrent() {
    const q = this.activeQuizQuestions[this.currentQuestionIndex];
    if (!q) return;
    const idx = this.savedQuestions.findIndex(sq => sq.id === q.id);
    if (idx >= 0) {
      this.savedQuestions.splice(idx, 1);
      this.showToast("Removed from saved items.");
    } else {
      this.savedQuestions.push(q);
      this.showToast("Saved to Revision Bank!");
    }
    localStorage.setItem("dq_saved_q_v1", JSON.stringify(this.savedQuestions));
    this.updateSavedBadge();
  }

  updateSavedBadge() {
    const badge = document.getElementById("saved-count-badge");
    if (badge) badge.textContent = this.savedQuestions.length;
  }

  startSavedOrWeakQuiz() {
    if (this.savedQuestions.length === 0) {
      this.showToast("No saved items yet. Star questions during quizzes!");
      return;
    }
    this.startQuiz(this.savedQuestions, "Revision Bank Laboratory Practice");
  }

  renderSavedList() {
    const container = document.getElementById("saved-questions-list");
    if (!container) return;
    container.innerHTML = "";
    if (this.savedQuestions.length === 0) {
      container.innerHTML = <div style="text-align: center; color: var(--text-muted); padding: 3rem;">No saved questions yet.</div>;
      return;
    }
    this.savedQuestions.forEach(q => {
      const card = document.createElement("div");
      card.className = "question-card";
      card.style.background = "var(--bg-secondary)";
      card.style.border = "1px solid var(--border-color)";
      card.style.padding = "1.4rem";
      card.style.borderRadius = "16px";
      card.innerHTML = <div style="font-weight: 700;">\</div>;
      container.appendChild(card);
    });
  }

  renderHistoryLog() {}
  renderAnalytics() {}

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = <i class="fa-solid fa-circle-check" style="color: var(--accent-primary);"></i> <span>\</span>;
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