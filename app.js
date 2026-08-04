/**
 * DentaQuiz Studio - Application Controller
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
    
    this.currentUser = JSON.parse(localStorage.getItem("dq_user_session_v1")) || null;
    this.usersDatabase = JSON.parse(localStorage.getItem("dq_users_db_v1")) || INITIAL_USERS_DATABASE;

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
  }

  applyTheme(themeId) {
    this.currentTheme = themeId;
    localStorage.setItem("dq_active_theme", themeId);
    
    document.documentElement.setAttribute("data-theme", themeId);
    document.body.setAttribute("data-theme", themeId);

    const btnText = document.getElementById("theme-btn-text");
    if (btnText) {
      btnText.textContent = themeId === "theme-1" ? "Switch to Theme 2" : "Switch to Theme 1";
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === "theme-1" ? "theme-2" : "theme-1";
    this.applyTheme(nextTheme);
    this.showToast(Switched to \);
  }

  checkAdminRouteGuard() {
    const navAdmin = document.getElementById("nav-admin");
    const isAdmin = this.currentUser && this.currentUser.role === "Admin";
    if (navAdmin) navAdmin.style.display = isAdmin ? "inline-block" : "none";
  }

  setupEventListeners() {
    const btnToggleMain = document.getElementById("btn-toggle-theme-main");
    if (btnToggleMain) {
      btnToggleMain.addEventListener("click", () => this.toggleTheme());
    }

    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        if (targetTab === "admin-tab" && (!this.currentUser || this.currentUser.role !== "Admin")) {
          this.showToast("Access Denied: Admin authentication required.");
          return;
        }
        if (targetTab) this.switchTab(targetTab, btn);
      });
    });

    const brandHome = document.getElementById("brand-home-click");
    if (brandHome) {
      brandHome.addEventListener("click", () => this.switchTab("home-tab", document.getElementById("nav-home")));
    }

    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSmartSearch(e.target.value));
    }

    const btnRandomQuiz = document.getElementById("btn-random-quiz");
    if (btnRandomQuiz) {
      btnRandomQuiz.addEventListener("click", () => this.startQuiz(this.questions, "Oral Histology Laboratory Quiz"));
    }

    document.getElementById("btn-prev-question")?.addEventListener("click", () => this.navigateQuestion(-1));
    document.getElementById("btn-next-question")?.addEventListener("click", () => this.navigateQuestion(1));
    document.getElementById("btn-exit-quiz")?.addEventListener("click", () => this.exitQuiz());
    document.getElementById("btn-retry-quiz")?.addEventListener("click", () => this.startQuiz(this.activeQuizQuestions, "Retake Laboratory Quiz"));
    document.getElementById("btn-back-dashboard")?.addEventListener("click", () => this.switchTab("home-tab", document.getElementById("nav-home")));
    document.getElementById("btn-bookmark-current")?.addEventListener("click", () => this.toggleBookmarkCurrent());

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

    if (btnOpenAuth && authOverlay) btnOpenAuth.addEventListener("click", () => authOverlay.style.display = "flex");
    if (btnCloseAuth && authOverlay) btnCloseAuth.addEventListener("click", () => authOverlay.style.display = "none");

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
        this.showToast(Account created successfully! Welcome \);
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
  }

  renderHeaderProfile() {
    const el = document.getElementById("header-user-name");
    if (el) {
      if (this.currentUser && this.currentUser.name) {
        el.textContent = this.currentUser.name;
      } else {
        el.textContent = "Login";
      }
    }
  }

  renderSubjectCards() {
    const grid = document.getElementById("subjects-grid");
    if (!grid) return;
    grid.innerHTML = "";

    DENTAL_SUBJECTS_TAXONOMY.forEach(subj => {
      const card = document.createElement("div");
      card.className = "subject-card";
      card.style.borderTop = 4px solid \;

      card.innerHTML = 
        <div>
          <div class="subject-header">
            <div class="banner-icon" style="color: \; font-size: 2rem;">
              <i class="fa-solid \"></i>
            </div>
            <div>
              <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.4rem;">\</h3>
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
        this.startQuiz(subjQuestions.length > 0 ? subjQuestions : this.questions, subj.labQuizNameEn);
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
    DENTAL_SUBJECTS_TAXONOMY.forEach(subj => {
      if (subj.nameEn.toLowerCase().includes(qTrim) || subj.labQuizNameEn.toLowerCase().includes(qTrim)) {
        matches.push({ type: "Subject", title: subj.labQuizNameEn, subjId: subj.id });
      }
      subj.sheets.forEach(sheet => {
        if (sheet.titleEn.toLowerCase().includes(qTrim)) {
          matches.push({ type: "Lecture Sheet", title: \ - \, subjId: subj.id, sheetId: sheet.id });
        }
      });
    });

    countEl.textContent = matches.length;
    list.innerHTML = "";

    if (matches.length === 0) {
      list.innerHTML = <div style="color: var(--text-muted); font-size: 0.9rem;">No matching items found for "\".</div>;
    } else {
      matches.slice(0, 8).forEach(m => {
        const card = document.createElement("div");
        card.className = "subject-card";
        card.style.padding = "1rem 1.4rem";
        card.innerHTML = 
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="background: rgba(197,133,133,0.15); color: var(--accent-primary); padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">\</span>
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

  setupAdminDatabaseEvents() {
    const btnExportCsv = document.getElementById("btn-export-users-csv");
    if (btnExportCsv) btnExportCsv.addEventListener("click", () => this.exportUsersCSV());

    const btnLogoutAdmin = document.getElementById("btn-admin-logout");
    if (btnLogoutAdmin) {
      btnLogoutAdmin.addEventListener("click", () => {
        this.currentUser = null;
        localStorage.removeItem("dq_user_session_v1");
        this.checkAdminRouteGuard();
        this.renderHeaderProfile();
        this.switchTab("home-tab", document.getElementById("nav-home"));
        this.showToast("Admin logged out.");
      });
    }
  }

  renderAdminUsersTable() {
    const tbody = document.getElementById("admin-users-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    this.usersDatabase.forEach((usr, idx) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border-color)";
      tr.innerHTML = 
        <td style="padding: 0.8rem; font-weight: 700;">\</td>
        <td style="padding: 0.8rem; color: var(--accent-primary); font-weight: 600;">\</td>
        <td style="padding: 0.8rem;">\</td>
        <td style="padding: 0.8rem;">\</td>
        <td style="padding: 0.8rem;"><span style="padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; background: var(--border-color);">\</span></td>
        <td style="padding: 0.8rem;">
          <button class="btn-secondary btn-delete-user" style="padding: 0.3rem 0.6rem; font-size: 0.78rem; color: #d46a6a;">Delete</button>
        </td>
      ;

      tr.querySelector(".btn-delete-user").addEventListener("click", () => {
        if (confirm(Delete user \?)) {
          this.usersDatabase.splice(idx, 1);
          localStorage.setItem("dq_users_db_v1", JSON.stringify(this.usersDatabase));
          this.renderAdminUsersTable();
          this.showToast("User deleted.");
        }
      });

      tbody.appendChild(tr);
    });
  }

  exportUsersCSV() {
    let csv = "Full Name,Email,University ID,Registration Date,Status,Role\n";
    this.usersDatabase.forEach(u => {
      csv += "\","\","\","\","\","\"\n;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", Dentistoire_Users_Export_\.csv);
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.showToast("Exported Users Database CSV!");
  }

  startQuiz(questionsList, quizTitle = "Laboratory Quiz") {
    if (!questionsList || questionsList.length === 0) return;
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
      });

      optsContainer.appendChild(btn);
    });

    document.getElementById("btn-prev-question").disabled = this.currentQuestionIndex === 0;
    document.getElementById("btn-next-question").innerHTML = this.currentQuestionIndex === total - 1 ? Submit Quiz : Next Question;
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
  }

  renderSavedList() {}

  showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.background = "var(--bg-secondary)";
    toast.style.border = "1px solid var(--border-color)";
    toast.style.padding = "1rem 1.4rem";
    toast.style.borderRadius = "14px";
    toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
    toast.innerHTML = <i class="fa-solid fa-circle-check" style="color: var(--accent-primary); margin-right: 0.5rem;"></i> <span>\</span>;
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