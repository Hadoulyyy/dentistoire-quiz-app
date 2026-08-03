/**
 * DentaQuiz Studio - Official Academic Dental Curriculum Database
 * Contains exact 88 Lecture Sheets across all 7 Second-Year Dental Subjects as specified.
 */

const DENTAL_SUBJECTS_TAXONOMY = [
  {
    id: "subj_oral_histology",
    nameEn: "Oral Histology",
    nameAr: "أنسجة الفم",
    icon: "fa-tooth",
    color: "#D99BA5",
    sheets: [
      { id: "oh_s1", titleEn: "Embriology", titleAr: "شيت 1: علم الأجنة" },
      { id: "oh_s2", titleEn: "Development of the face", titleAr: "شيت 2: تطور الوجه" },
      { id: "oh_s3", titleEn: "Development of the mouth", titleAr: "شيت 3: تطور الفم" },
      { id: "oh_s4", titleEn: "Tooth development and growth", titleAr: "شيت 4: نمو وتطور الأسنان" },
      { id: "oh_s5", titleEn: "Enamel", titleAr: "شيت 5: المينا" },
      { id: "oh_s6", titleEn: "Dentin", titleAr: "شيت 6: العاج" },
      { id: "oh_s7", titleEn: "Cementum", titleAr: "شيت 7: الملاط" },
      { id: "oh_s8", titleEn: "Dental pulp", titleAr: "شيت 8: لب الأسنان" },
      { id: "oh_s9", titleEn: "PDL", titleAr: "شيت 9: الرباط السني المقوم" },
      { id: "oh_s10", titleEn: "Alveolar bone", titleAr: "شيت 10: العظم السنخي" },
      { id: "oh_s11", titleEn: "Maxillary sinus", titleAr: "شيت 11: الجيب الفكي العلوي" },
      { id: "oh_s12", titleEn: "Eruption and shedding", titleAr: "شيت 12: البزوغ والتبديل" },
      { id: "oh_s13", titleEn: "TMJ", titleAr: "شيت 13: المفصل الفكي الصدغي" },
      { id: "oh_s14", titleEn: "Oral mucosa & Gingiva", titleAr: "شيت 14: مخاطية الفم واللثة" },
      { id: "oh_s15", titleEn: "Salivary glands & Tonsils", titleAr: "شيت 15: الغدد اللعابية واللوزتين" }
    ]
  },
  {
    id: "subj_crown_bridge",
    nameEn: "Crown and Bridge",
    nameAr: "الاستعاضة الثابتة",
    icon: "fa-crown",
    color: "#A694B8",
    sheets: [
      { id: "cb_s1", titleEn: "Introduction", titleAr: "شيت 1: مقدمة الاستعاضة الثابتة" },
      { id: "cb_s2", titleEn: "Instrument", titleAr: "شيت 2: الأدوات" },
      { id: "cb_s3", titleEn: "Principles of tooth preparation", titleAr: "شيت 3: مبادئ تحضير الأسنان" },
      { id: "cb_s4", titleEn: "Metal ceramic", titleAr: "شيت 4: التركيبات المعدنية الخزفية" },
      { id: "cb_s5", titleEn: "Full coverage", titleAr: "شيت 5: التغطية الكاملة" },
      { id: "cb_s6", titleEn: "Fluid control", titleAr: "شيت 6: التحكم في السوائل واللعاب" },
      { id: "cb_s7", titleEn: "Impression material", titleAr: "شيت 7: مواد الطبعات" },
      { id: "cb_s8", titleEn: "Working cast and die", titleAr: "شيت 8: كاست العمل والداي" },
      { id: "cb_s9", titleEn: "Wax pattern", titleAr: "شيت 9: نموذج الشمع" },
      { id: "cb_s10", titleEn: "Spruing & investing", titleAr: "شيت 10: السبروينغ والكساء" },
      { id: "cb_s11", titleEn: "Casting", titleAr: "شيت 11: الصب المعدني" },
      { id: "cb_s12", titleEn: "Pontic", titleAr: "شيت 12: الدمية (Pontic)" },
      { id: "cb_s13", titleEn: "Retainer", titleAr: "شيت 13: المثبت (Retainer)" },
      { id: "cb_s14", titleEn: "Connector", titleAr: "شيت 14: الموصل (Connector)" }
    ]
  },
  {
    id: "subj_prosthodontics",
    nameEn: "Prosthodontics",
    nameAr: "الاستعاضة المتحركة",
    icon: "fa-teeth-open",
    color: "#C58585",
    sheets: [
      { id: "pros_s1", titleEn: "Introduction", titleAr: "شيت 1: مقدمة الاستعاضة المتحركة" },
      { id: "pros_s2", titleEn: "Anatomical landmarks", titleAr: "شيت 2: المعالم التشريحية" },
      { id: "pros_s3", titleEn: "Impression", titleAr: "شيت 3: الطبعات" },
      { id: "pros_s4", titleEn: "Relief", titleAr: "شيت 4: مناطق تخفيف الضغط (Relief)" },
      { id: "pros_s5", titleEn: "Occlusion blocks", titleAr: "شيت 5: كتل الإطباق" },
      { id: "pros_s6", titleEn: "Mandibular movement", titleAr: "شيت 6: حركة الفك السفلي" },
      { id: "pros_s7", titleEn: "Face bow", titleAr: "شيت 7: القوس الوجهي (Face bow)" },
      { id: "pros_s8", titleEn: "Selection of teeth", titleAr: "شيت 8: اختيار الأسنان" },
      { id: "pros_s9", titleEn: "Arrangement", titleAr: "شيت 9: صف وتنسيق الأسنان" },
      { id: "pros_s10", titleEn: "Retention", titleAr: "شيت 10: ثبات الطقم (Retention)" },
      { id: "pros_s11", titleEn: "Processing of complete denture", titleAr: "شيت 11: معالجة الطقم الكامل" },
      { id: "pros_s12", titleEn: "Repair, relining and rebasing of Complete Denture", titleAr: "شيت 12: إصلاح وتبطين الطقم" },
      { id: "pros_s13", titleEn: "Removable partial prosthodontic", titleAr: "شيت 13: الاستعاضة الجزئية المتحركة" },
      { id: "pros_s14", titleEn: "RPD competent Rest", titleAr: "شيت 14: مهام وقواعد الـ Rest" },
      { id: "pros_s15", titleEn: "Dental surveyor & surveying", titleAr: "شيت 15: تخطيط الأطقم (Surveying)" },
      { id: "pros_s16", titleEn: "Direct and indirect retainer", titleAr: "شيت 16: المثبتات المباشرة وغير المباشرة" },
      { id: "pros_s17", titleEn: "Major and minor connector", titleAr: "شيت 17: الموصلات الرئيسية والفرعية" },
      { id: "pros_s18", titleEn: "Denture base", titleAr: "شيت 18: قاعدة الطقم" },
      { id: "pros_s19", titleEn: "Laboratory Procedures", titleAr: "شيت 19: إجراءات المختبر" },
      { id: "pros_s20", titleEn: "Biomechanics of Removable Partial Denture", titleAr: "شيت 20: الميكانيكا الحيوية للـ RPD" }
    ]
  },
  {
    id: "subj_pharmacology",
    nameEn: "Pharmacology",
    nameAr: "علم الأدوية",
    icon: "fa-pills",
    color: "#D49B8B",
    sheets: [
      { id: "ph_s1", titleEn: "Introduction", titleAr: "شيت 1: مقدمة علم الأدوية" },
      { id: "ph_s2", titleEn: "Autonomic nerve system", titleAr: "شيت 2: الجهاز العصبي الذاتي" },
      { id: "ph_s3", titleEn: "Antimicrobial agent", titleAr: "شيت 3: المضادات الحيوية" },
      { id: "ph_s4", titleEn: "Opioid analgesics", titleAr: "شيت 4: مسكنات الأفيون" }
    ]
  },
  {
    id: "subj_pathology",
    nameEn: "Pathology",
    nameAr: "علم الأمراض",
    icon: "fa-disease",
    color: "#B87B7B",
    sheets: [
      { id: "path_s1", titleEn: "Introduction", titleAr: "شيت 1: مقدمة علم الأمراض" },
      { id: "path_s2", titleEn: "Adaptation", titleAr: "شيت 2: تكيف الخلايا" },
      { id: "path_s3", titleEn: "Cell injury", titleAr: "شيت 3: إصابة الخلايا" },
      { id: "path_s4", titleEn: "Inflammation", titleAr: "شيت 4: الالتهاب" },
      { id: "path_s5", titleEn: "Tissue repair", titleAr: "شيت 5: التئام الأنسجة" },
      { id: "path_s6", titleEn: "Circulatory", titleAr: "شيت 6: اضطرابات الدورة الدموية" },
      { id: "path_s7", titleEn: "Neoplasia", titleAr: "شيت 7: الأورام (Neoplasia)" },
      { id: "path_s8", titleEn: "Cardiovascular", titleAr: "شيت 8: أمراض القلب والأوعية الدموية" },
      { id: "path_s9", titleEn: "Gastrointestinal pathology", titleAr: "شيت 9: أمراض الجهاز الهضمي" },
      { id: "path_s10", titleEn: "Granuloma", titleAr: "شيت 10: الورم الحبيبي (Granuloma)" },
      { id: "path_s11", titleEn: "Oral manifestation of systemic desaise", titleAr: "شيت 11: أعراض الأمراض الجهازية بالفم" }
    ]
  },
  {
    id: "subj_microbiology",
    nameEn: "Microbiology",
    nameAr: "الأحياء الدقيقة",
    icon: "fa-microscope",
    color: "#94A89A",
    sheets: [
      { id: "mb_s1", titleEn: "Introduction", titleAr: "شيت 1: مقدمة الأحياء الدقيقة" },
      { id: "mb_s2", titleEn: "Bacteriology", titleAr: "شيت 2: علم البكتيريا" },
      { id: "mb_s3", titleEn: "Bacterial taxonomy", titleAr: "شيت 3: تصنيف البكتيريا" },
      { id: "mb_s4", titleEn: "Bacterial pathogenicity", titleAr: "شيت 4: إمراضية البكتيريا" },
      { id: "mb_s5", titleEn: "Antimicrobial chemotherapy", titleAr: "شيت 5: العلاج الكيميائي للميكروبات" },
      { id: "mb_s6", titleEn: "Clinically important bacteria", titleAr: "شيت 6: البكتيريا الكلينيكية الهامة" },
      { id: "mb_s7", titleEn: "Immunology", titleAr: "شيت 7: علم المناعة" },
      { id: "mb_s8", titleEn: "complement system", titleAr: "شيت 8: النظام المتمم (Complement)" },
      { id: "mb_s9", titleEn: "Mycology", titleAr: "شيت 9: علم الفطريات" },
      { id: "mb_s10", titleEn: "Sterilization and Disinfection", titleAr: "شيت 10: التعقيم والتطهير" },
      { id: "mb_s11", titleEn: "Bacterial genetic", titleAr: "شيت 11: جينات البكتيريا" },
      { id: "mb_s12", titleEn: "Virology", titleAr: "شيت 12: علم الفيروسات" }
    ]
  },
  {
    id: "subj_conservative",
    nameEn: "Conservative Dentistry",
    nameAr: "العلاج التحفظي",
    icon: "fa-tooth",
    color: "#D1AD85",
    sheets: [
      { id: "cons_s1", titleEn: "Introduction", titleAr: "شيت 1: مقدمة العلاج التحفظي" },
      { id: "cons_s2", titleEn: "Tooth histology", titleAr: "شيت 2: أنسجة الأسنان التحفظية" },
      { id: "cons_s3", titleEn: "Instruments", titleAr: "شيت 3: الأدوات والمعدات" },
      { id: "cons_s4", titleEn: "Dental caries part 1 and 2", titleAr: "شيت 4: تسوس الأسنان (جزء 1 و 2)" },
      { id: "cons_s5", titleEn: "Principles", titleAr: "شيت 5: مبادئ تحضير الحفر" },
      { id: "cons_s6", titleEn: "Amalgam", titleAr: "شيت 6: حشوات الأمالغم" },
      { id: "cons_s7", titleEn: "Class I & II cavity preparation for amalgam restoration", titleAr: "شيت 7: تحضير حفر الصنف الأول والثاني" },
      { id: "cons_s8", titleEn: "GIC", titleAr: "شيت 8: حشوات الجلاس أينومر (GIC)" },
      { id: "cons_s9", titleEn: "Matrices and wedges", titleAr: "شيت 9: المساند والأوتاد (Matrices & wedges)" },
      { id: "cons_s10", titleEn: "Composite resin restoration", titleAr: "شيت 10: حشوات الكومبوزيت التجميلية" },
      { id: "cons_s11", titleEn: "Pulp protection", titleAr: "شيت 11: حماية لب السن" },
      { id: "cons_s12", titleEn: "Non carries lesion", titleAr: "شيت 12: الآفات غير التسوسية" }
    ]
  }
];

// INITIAL ACADEMIC QUESTION BANK MAPPED TO LECTURE SHEETS
const INITIAL_DENTAL_QUESTIONS = [
  // 1. ORAL HISTOLOGY SHEETS
  {
    id: "q_oh_5_1",
    subjectId: "subj_oral_histology",
    sheetId: "oh_s5",
    topic: "Enamel",
    type: "MCQ",
    questionTextEn: "What cells synthesize and secrete the organic matrix of enamel during amelogenesis?",
    questionTextAr: "ما هي الخلايا التي تصنع وتفرز المادة العضوية للمينا أثناء تكون المينا؟",
    optionsEn: ["Odontoblasts", "Ameloblasts", "Cementoblasts", "Osteoblasts"],
    optionsAr: ["خلايا مصورات العاج", "خلايا مصورات المينا (Ameloblasts)", "خلايا مصورات الملاط", "خلايا مصورات العظم"],
    correctOptionIndex: 1,
    explanationEn: "Ameloblasts derived from inner enamel epithelium synthesize and secrete enamel matrix proteins.",
    explanationAr: "تفرز خلايا مصورات المينا (Ameloblasts) بروتينات مصفوفة المينا.",
    difficulty: "Easy",
    yearLabel: "Sheet 5"
  },
  {
    id: "q_oh_6_1",
    subjectId: "subj_oral_histology",
    sheetId: "oh_s6",
    topic: "Dentin",
    type: "MCQ",
    questionTextEn: "Which structural line in dentin represents daily incremental organic matrix deposition?",
    questionTextAr: "ما هي خطوط النمو التزايدي اليومي المميزة في عاج الأسنان؟",
    optionsEn: ["Striae of Retzius", "Lines of Von Ebner", "Hunter-Schreger bands", "Contour lines of Owen"],
    optionsAr: ["خطوط ريتزيوس", "خطوط فون إبنر (Lines of Von Ebner)", "نطاقات هونتر-شريغر", "خطوط أوين"],
    correctOptionIndex: 1,
    explanationEn: "Lines of Von Ebner represent daily incremental dentin matrix deposition.",
    explanationAr: "تمثل خطوط فون إبنر الترسيب التزايدي اليومي للعاج.",
    difficulty: "Medium",
    yearLabel: "Sheet 6"
  },

  // 2. CROWN & BRIDGE SHEETS
  {
    id: "q_cb_3_1",
    subjectId: "subj_crown_bridge",
    sheetId: "cb_s3",
    topic: "Principles of tooth preparation",
    type: "MCQ",
    questionTextEn: "Which finish line design is indicated for all-ceramic crowns to resist occlusal forces?",
    questionTextAr: "أي شكل حافة إنهاء (Finish line) يوصى به لتركيبات السيراميك الكاملة؟",
    optionsEn: ["Feather edge", "90-degree Shoulder", "Knife edge", "Subgingival bevel"],
    optionsAr: ["حافة رقيقة", "كتف قائمة 90 درجة (90° Shoulder)", "حافة سكين", "شطب تحت اللثة"],
    correctOptionIndex: 1,
    explanationEn: "A 90-degree radial shoulder margin provides bulk for porcelain strength.",
    explanationAr: "يوفر خط الإنهاء القائم (Shoulder 90°) سماكة كافية لتركيبات السيراميك.",
    difficulty: "Medium",
    yearLabel: "Sheet 3"
  },

  // 3. PROSTHODONTICS SHEETS
  {
    id: "q_pros_15_1",
    subjectId: "subj_prosthodontics",
    sheetId: "pros_s15",
    topic: "Dental surveyor & surveying",
    type: "MCQ",
    questionTextEn: "What is the main purpose of surveying diagnostic casts for RPD design?",
    questionTextAr: "ما هو الهدف الأساسي من تخطيط النموذج (Surveying) عند تصميم الاستعاضة الجزئية المتحركة؟",
    optionsEn: ["Determine tooth shade", "Identify path of placement and height of contour undercuts", "Measure canal length", "Evaluate enamel"],
    optionsAr: ["تحديد لون الأسنان", "تحديد مسار الإدخال (Path of placement) ومناطق التثبيت", "قياس طول الجذر", "تقييم المينا"],
    correctOptionIndex: 1,
    explanationEn: "Surveying identifies the path of placement, height of contour, and retentive undercuts.",
    explanationAr: "يساعد جهاز التخطيط على إيجاد مسار الإدخال والتثبيت المناسب.",
    difficulty: "Hard",
    yearLabel: "Sheet 15"
  },

  // 4. PHARMACOLOGY SHEETS
  {
    id: "q_ph_2_1",
    subjectId: "subj_pharmacology",
    sheetId: "ph_s2",
    topic: "Autonomic nerve system",
    type: "MCQ",
    questionTextEn: "Why is Epinephrine added to local anesthetic cartridges in dental procedures?",
    questionTextAr: "لماذا يضاف الإبينفرين (الأدرينالين) إلى مخدر الليدوكايين الموضعي في عيادة الأسنان؟",
    optionsEn: ["Increase blood flow", "Local vasoconstriction to prolong anesthesia duration", "Act as a sedative", "Increase saliva"],
    optionsAr: ["زيادة النزيف", "قبض الأوعية وتطويل مدة التخدير", "كمهدئ عام", "زيادة اللعاب"],
    correctOptionIndex: 1,
    explanationEn: "Epinephrine causes local vasoconstriction, prolonging anesthetic action and reducing surgical bleeding.",
    explanationAr: "يعمل الإبينفرين كقابض للأوعية الدموية في منطقة الحقن مما يزيد مدة البنج ويقلل النزيف.",
    difficulty: "Easy",
    yearLabel: "Sheet 2"
  },

  // 5. PATHOLOGY SHEETS
  {
    id: "q_path_4_1",
    subjectId: "subj_pathology",
    sheetId: "path_s4",
    topic: "Inflammation",
    type: "MCQ",
    questionTextEn: "Which inflammatory cell appears first in acute inflammation sites?",
    questionTextAr: "ما هي الخلية المناعية الرئيسية التي تظهر أولاً في موقع الالتهاب الحاد؟",
    optionsEn: ["Macrophage", "Neutrophil (PMN)", "Lymphocyte", "Plasma cell"],
    optionsAr: ["الخلية البلعمية", "الخلية المتعادلة (Neutrophil)", "الخلية اللمفاوية", "الخلية البلازمية"],
    correctOptionIndex: 1,
    explanationEn: "Neutrophils respond rapidly to acute inflammatory signals within 6-24 hours.",
    explanationAr: "تصل الخلايا المتعادلة (Neutrophils) أولاً إلى موقع الالتهاب الحاد.",
    difficulty: "Easy",
    yearLabel: "Sheet 4"
  },

  // 6. MICROBIOLOGY SHEETS
  {
    id: "q_mb_10_1",
    subjectId: "subj_microbiology",
    sheetId: "mb_s10",
    topic: "Sterilization and Disinfection",
    type: "MCQ",
    questionTextEn: "What standard autoclave temperature and pressure are required for sterilizing dental instruments?",
    questionTextAr: "ما هي درجة الحرارة والضغط والزمن القياسي في جهاز الأوتوكلاف لتعقيم أدوات الأسنان؟",
    optionsEn: ["100°C for 10 min", "121°C for 15-20 min at 15 psi", "160°C for 5 min", "80°C for 60 min"],
    optionsAr: ["100 مئوية 10 دقائق", "121 مئوية لمدة 15-20 دقيقة عند ضغط 15 باوند", "160 مئوية 5 دقائق", "80 مئوية 60 دقيقة"],
    correctOptionIndex: 1,
    explanationEn: "Autoclaving requires 121°C at 15 psi for 15-20 minutes to destroy all bacterial spores.",
    explanationAr: "يتطلب التعقيم بالأوتوكلاف 121 درجة مئوية تحت ضغط 15 باوند لمدة 15-20 دقيقة للقضاء على الأبواغ.",
    difficulty: "Easy",
    yearLabel: "Sheet 10"
  },

  // 7. CONSERVATIVE DENTISTRY SHEETS
  {
    id: "q_cons_6_1",
    subjectId: "subj_conservative",
    sheetId: "cons_s6",
    topic: "Amalgam",
    type: "MCQ",
    questionTextEn: "High-copper dental amalgams eliminate which weak corrosion-prone phase?",
    questionTextAr: "تلغي سبائك الأمالغم عالية النحاس (High-copper) أي مرحلة ضعيفة وعرضة للصدأ؟",
    optionsEn: ["Gamma-1 phase", "Gamma-2 phase (Sn8Hg)", "Gamma phase", "Epsilon phase"],
    optionsAr: ["مرحلة Gamma-1", "مرحلة Gamma-2 (Sn8Hg)", "مرحلة Gamma", "مرحلة Epsilon"],
    correctOptionIndex: 1,
    explanationEn: "High-copper alloys eliminate the corrosion-prone Gamma-2 tin-mercury phase.",
    explanationAr: "تلغي زيادة نسبة النحاس مرحلة Gamma-2 الأكثر عرضة للتآكل والصدأ.",
    difficulty: "Hard",
    yearLabel: "Sheet 6"
  }
];
