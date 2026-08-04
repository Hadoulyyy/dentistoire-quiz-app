/**
 * DENTISTOIRE - Complete Application Controller
 * Handles 7 Subjects, 88 Lecture Sheets, Per-Subject Laboratory Quizzes, Search, Auth, and Admin Hub.
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
    this.usersDatabase = JSON.parse(localStorage.getItem("dq_users_db_v1")) || (window.INITIAL_USERS_DATABASE || []);

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.setupAuthListeners();
    this.renderHeaderProfile();
    this.renderSubjectCards();
    this.updateSavedBadge();
  }

  applyTheme(themeId) {
    this.currentTheme = themeId;
    localStorage.setItem("dq_active_theme", themeId);
    
    document.documentElement.setAttribute("data-theme", themeId);
    document.body.setAttribute("data-theme", themeId);
    document.body.className = themeId;

    const btnText = document.getElementById("theme-btn-label-text");
    if (btnText) {
      btnText.textContent = themeId === "theme-1" ? "Switch to Theme 2" : "Switch to Theme 1";
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === "theme-1" ? "theme-2" : "theme-1";
    this.applyTheme(nextTheme);
    this.showToast(`Switched to ${nextTheme === 'theme-2' ? 'Theme 2 (Terracotta Amber)' : 'Theme 1 (Cozy Cream)'}`);
  }

  setupEventListeners() {
    // Global Event Delegation for Nav Tabs and Buttons
    document.addEventListener("click", (e) => {
      // Theme Switcher Button
      const themeBtn = e.target.closest("#btn-theme-switcher");
      if (themeBtn) {
        this.toggleTheme();
        return;
      }

      // Nav Tab Buttons
      const tabBtn = e.target.closest(".tab-btn");
      if (tabBtn) {
        const targetTab = tabBtn.getAttribute("data-tab");
        if (targetTab) this.switchTab(targetTab, tabBtn);
        return;
      }

      // Brand Logo Home Click
      const brandHome = e.target.closest("#brand-home-click");
      if (brandHome) {
        this.switchTab("home-tab", document.getElementById("nav-home"));
        return;
      }

      // Subject Card - Open Sheets
      const openSheetsBtn = e.target.closest(".btn-open-sheets");
      if (openSheetsBtn) {
        const subId = openSheetsBtn.getAttribute("data-subject-id");
        if (subId) this.openSubjectExplorer(subId);
        return;
      }

      // Subject Card - Start Lab Quiz
      const startLabBtn = e.target.closest(".btn-start-lab-quiz");
      if (startLabBtn) {
        const subId = startLabBtn.getAttribute("data-subject-id");
        if (subId) this.startSubjectLabQuiz(subId);
        return;
      }
    });

    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSmartSearch(e.target.value));
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
      [tabLogin, tabSignup, tabAdmin].forEach(t => t && t.classList.remove("active"));
      [formLogin, formSignup, formAdmin].forEach(f => f && (f.style.display = "none"));
      if (activeTab) activeTab.classList.add("active");
      if (showForm) showForm.style.display = "block";
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
        this.renderHeaderProfile();
        authOverlay.style.display = "none";
        this.showToast(`Welcome back, ${name}!`);
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
        this.renderHeaderProfile();
        authOverlay.style.display = "none";
        this.showToast(`Account created! Welcome ${name}`);
      });
    }

    if (formAdmin) {
      formAdmin.addEventListener("submit", (e) => {
        e.preventDefault();
        const passkey = document.getElementById("admin-passkey").value;
        if (passkey === "admin123" || passkey.length >= 4) {
          this.currentUser = { name: "Administrator", email: "admin@dentistoire.edu", role: "Admin" };
          localStorage.setItem("dq_user_session_v1", JSON.stringify(this.currentUser));
          this.renderHeaderProfile();
          authOverlay.style.display = "none";
          this.switchTab("admin-tab", document.getElementById("nav-admin"));
          this.showToast("Admin Authenticated! Welcome to Admin Hub.");
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
    
    if (btnElement) {
      btnElement.classList.add("active");
    } else {
      const matchBtn = document.querySelector(`.nav-tabs .tab-btn[data-tab="${tabId}"]`);
      if (matchBtn) matchBtn.classList.add("active");
    }

    if (tabId === "admin-tab") this.renderAdminUsersTable();
    if (tabId === "saved-tab") this.renderSavedList();
    if (tabId === "history-tab") this.renderHistoryLog();
    if (tabId === "analytics-tab") this.renderAnalytics();

    window.scrollTo({ top: 0, behavior: "smooth" });
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

  updateSavedBadge() {
    const badge = document.getElementById("saved-count-badge");
    if (badge) badge.textContent = this.savedQuestions.length;
  }

  getSubjects() {
    return window.DENTISTOIRE_SUBJECTS || window.DENTAL_SUBJECTS_TAXONOMY || [];
  }

  renderSubjectCards() {
    const grid = document.getElementById("subjects-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const subjects = this.getSubjects();

    subjects.forEach(subj => {
      const card = document.createElement("div");
      card.className = "subject-card";
      card.setAttribute("data-subject-id", subj.id);
      card.style.borderTop = `4px solid ${subj.color || '#c67a32'}`;

      card.innerHTML = `
        <div>
          <div style="font-size: 2.2rem; color: ${subj.color || 'var(--accent-primary)'}; margin-bottom: 0.8rem;">
            <i class="${subj.icon}"></i>
          </div>
          <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: 0.4rem; color: var(--text-main);">${subj.title}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.2rem;">${subj.description}</p>
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 1.2rem;">
            <i class="fa-solid fa-file-lines"></i> ${subj.sheets.length} Lecture Sheets Available
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 1rem;">
          <button class="btn-primary btn-open-sheets" data-subject-id="${subj.id}" style="width: 100%; font-size: 0.88rem;">
            <i class="fa-solid fa-book"></i> View Course Sheets
          </button>
          
          <button class="btn-secondary btn-start-lab-quiz" data-subject-id="${subj.id}" style="width: 100%; font-size: 0.88rem; background: var(--bg-primary); border: 1px solid var(--accent-primary); color: var(--text-main); font-weight: 700;">
            <i class="fa-solid fa-flask"></i> ${subj.title} Lab
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  openSubjectExplorer(subjectId) {
    const sub = this.getSubjects().find(s => s.id === subjectId);
    if (!sub) return;

    const container = document.getElementById("subject-explorer-content");
    const titleEl = document.getElementById("subject-explorer-title");
    if (!container || !titleEl) return;

    titleEl.textContent = sub.title;

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6;">${sub.description}</p>
        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          ${sub.sheets.map(sheet => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1.15rem; color: var(--text-main); font-weight: 700;">${sheet.title}</h4>
                <span style="font-size: 0.8rem; background: var(--bg-primary); padding: 0.3rem 0.8rem; border-radius: 20px; color: var(--accent-primary); border: 1px solid var(--border-color); font-weight: 700;">
                  Lecture Sheet
                </span>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.2rem; line-height: 1.5;">${sheet.summary}</p>
              <button class="btn-primary" onclick="window.app.startSingleSheetQuiz('${sub.id}', '${sheet.id}')" style="padding: 0.6rem 1.4rem; font-size: 0.88rem; cursor: pointer;">
                <i class="fa-solid fa-play"></i> Start ${sheet.title} Lab Quiz
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.switchTab("subjects-tab", document.getElementById("nav-subjects"));
  }

  startSubjectLabQuiz(subjectId) {
    const sub = this.getSubjects().find(s => s.id === subjectId);
    if (!sub) return;

    let questions = [];
    sub.sheets.forEach(sheet => {
      if (sheet.quizzes) {
        sheet.quizzes.forEach(q => {
          questions.push({ ...q, questionTextEn: q.question, optionsEn: q.options, correctOptionIndex: q.correctAnswer });
        });
      }
    });

    this.startQuiz(questions, `${sub.title} Laboratory Quiz`);
  }

  startSingleSheetQuiz(subjectId, sheetId) {
    const sub = this.getSubjects().find(s => s.id === subjectId);
    if (!sub) return;
    const sheet = sub.sheets.find(sh => sh.id === sheetId);
    if (!sheet || !sheet.quizzes) return;

    const questions = sheet.quizzes.map(q => ({
      ...q,
      questionTextEn: q.question,
      optionsEn: q.options,
      correctOptionIndex: q.correctAnswer
    }));

    this.startQuiz(questions, `${sub.title} - ${sheet.title} Lab`);
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
    const subjects = this.getSubjects();

    subjects.forEach(subj => {
      const name = subj.title.toLowerCase();
      if (name.includes(qTrim)) {
        matches.push({ type: "Subject", title: `${subj.title} Lab`, subjId: subj.id });
      }
      subj.sheets.forEach(sheet => {
        const sTitle = sheet.title.toLowerCase();
        if (sTitle.includes(qTrim)) {
          matches.push({ type: "Lecture Sheet", title: `${subj.title} - ${sheet.title}`, subjId: subj.id, sheetId: sheet.id });
        }
      });
    });

    countEl.textContent = matches.length;
    list.innerHTML = "";

    if (matches.length === 0) {
      list.innerHTML = `<div style="color: var(--text-muted); font-size: 0.9rem;">No matching items found for "${query}".</div>`;
    } else {
      matches.slice(0, 8).forEach(m => {
        const card = document.createElement("div");
        card.className = "subject-card";
        card.style.padding = "1rem 1.4rem";
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="background: rgba(197,133,133,0.15); color: var(--accent-primary); padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;">${m.type}</span>
              <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.3rem;">${m.title}</div>
            </div>
            <button class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.82rem;">Start Lab</button>
          </div>
        `;
        card.querySelector("button").addEventListener("click", () => {
          this.openSubjectExplorer(m.subjId);
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
      tr.innerHTML = `
        <td style="padding: 0.8rem; font-weight: 700;">${usr.fullName || usr.name}</td>
        <td style="padding: 0.8rem; color: var(--accent-primary); font-weight: 600;">${usr.email}</td>
        <td style="padding: 0.8rem;">${usr.universityId || usr.id}</td>
        <td style="padding: 0.8rem;">${usr.regDate || usr.date || '2026-08-04'}</td>
        <td style="padding: 0.8rem;"><span style="padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; background: var(--border-color);">${usr.status || 'Active'}</span></td>
        <td style="padding: 0.8rem;">
          <button class="btn-secondary btn-delete-user" style="padding: 0.3rem 0.6rem; font-size: 0.78rem; color: #d46a6a;">Delete</button>
        </td>
      `;

      tr.querySelector(".btn-delete-user").addEventListener("click", () => {
        if (confirm(`Delete user ${usr.fullName || usr.name}?`)) {
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
      csv += `"${u.fullName || u.name}","${u.email}","${u.universityId || u.id}","${u.regDate || '2026-08-04'}","${u.status || 'Active'}","${u.role || 'Student'}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Dentistoire_Users_Export_${Date.now()}.csv`);
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
    document.getElementById("quiz-progress-text").textContent = `Question ${this.currentQuestionIndex + 1} of ${total}`;
    
    const pct = ((this.currentQuestionIndex + 1) / total) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${pct}%`;
    document.getElementById("quiz-question-text").textContent = q.questionTextEn || q.question;

    const optsContainer = document.getElementById("quiz-options-container");
    optsContainer.innerHTML = "";

    const options = q.optionsEn || q.options;
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
      btn.innerHTML = `<strong style="color: var(--accent-primary); margin-right: 0.6rem;">${keyLetter}.</strong> ${optText}`;

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
    document.getElementById("btn-next-question").textContent = this.currentQuestionIndex === total - 1 ? "Submit Quiz" : "Next Question";
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
      const correct = q.correctOptionIndex !== undefined ? q.correctOptionIndex : q.correctAnswer;
      if (this.userAnswers[idx] === correct) score++;
    });

    const percent = Math.round((score / total) * 100);
    document.getElementById("res-percent").textContent = `${percent}%`;
    document.getElementById("res-fraction").textContent = `${score}/${total} Correct`;
    document.getElementById("res-message").textContent = percent >= 80 ? "Excellent work! You mastered this Laboratory Quiz." : "Good effort. Review the laboratory sheet to improve your score.";

    this.quizHistory.unshift({
      title: document.getElementById("quiz-title-display").textContent || "Laboratory Quiz",
      score,
      total,
      percent,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem("dq_history_v1", JSON.stringify(this.quizHistory));

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

  renderSavedList() {
    const container = document.getElementById("saved-questions-list");
    if (!container) return;
    container.innerHTML = "";

    if (this.savedQuestions.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No saved questions yet! Bookmark items during laboratory quizzes to save them here.</div>`;
      return;
    }

    this.savedQuestions.forEach(q => {
      const div = document.createElement("div");
      div.className = "subject-card";
      div.style.padding = "1.2rem";
      div.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.4rem;">${q.questionTextEn || q.question}</div>
        <div style="font-size: 0.85rem; color: var(--accent-primary); font-weight: 700;">${q.topic || 'Laboratory Quiz'}</div>
      `;
      container.appendChild(div);
    });
  }

  renderHistoryLog() {
    const container = document.getElementById("history-attempts-container");
    if (!container) return;
    container.innerHTML = "";

    if (this.quizHistory.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No quiz attempts recorded yet.</div>`;
      return;
    }

    this.quizHistory.forEach(h => {
      const div = document.createElement("div");
      div.className = "subject-card";
      div.style.padding = "1rem 1.4rem";
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.innerHTML = `
        <div>
          <strong style="color: var(--text-main);">${h.title}</strong>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${h.date}</div>
        </div>
        <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent-primary);">${h.percent}% (${h.score}/${h.total})</div>
      `;
      container.appendChild(div);
    });
  }

  renderAnalytics() {
    const totalQuizzes = this.quizHistory.length;
    let avgAcc = 0;
    if (totalQuizzes > 0) {
      const sum = this.quizHistory.reduce((acc, h) => acc + h.percent, 0);
      avgAcc = Math.round(sum / totalQuizzes);
    }

    const accEl = document.getElementById("analytic-accuracy");
    const countEl = document.getElementById("analytic-quizzes-completed");
    const savedEl = document.getElementById("analytic-saved-items");

    if (accEl) accEl.textContent = `${avgAcc}%`;
    if (countEl) countEl.textContent = totalQuizzes;
    if (savedEl) savedEl.textContent = this.savedQuestions.length;
  }

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
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-primary); margin-right: 0.5rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ApplicationController();
});
"@

[System.IO.File]::WriteAllText('C:\Users\us\.gemini\antigravity\scratch\lecture_quiz_app\app.js', $appJsDelegation, [System.Text.Encoding]::UTF8)