/**
 * Dentistoire Official Dental Curriculum Database
 * Includes 88 Lecture Sheets & Laboratory Quizzes across all dental subjects.
 */

const DENTAL_SUBJECTS_TAXONOMY = [
  {
    id: "subj_oral_histology",
    title: "Oral Histology",
    titleAr: "أنسجة الفم",
    labQuizName: "Oral Histology Laboratory Quiz",
    icon: "fa-solid fa-microscope",
    description: "Study of microanatomy of oral tissues, enamel, dentin, pulp, PDL, alveolar bone, and mucosa.",
    sheets: [
      { id: "oh_s1", title: "Embriology", summary: "General embryonic development of head and neck structures." },
      { id: "oh_s2", title: "Development of the face", summary: "Development of facial processes, maxilla, and mandible." },
      { id: "oh_s3", title: "Development of the mouth", summary: "Primary oral cavity and palate formation." },
      { id: "oh_s4", title: "Tooth development and growth", summary: "Bud, cap, bell stages, and root formation." },
      { id: "oh_s5", title: "Enamel", summary: "Amelogenesis, enamel rods, lines of Retzius, and mineralization." },
      { id: "oh_s6", title: "Dentin", summary: "Dentinogenesis, dentinal tubules, primary, secondary, and tertiary dentin." },
      { id: "oh_s7", title: "Cementum", summary: "Acellular and cellular cementum, CDEJ, and fibers attachment." },
      { id: "oh_s8", title: "Dental pulp", summary: "Pulp zones, fibroblasts, odontoblasts, blood vessels, and nerve supply." },
      { id: "oh_s9", title: "PDL", summary: "Periodontal ligament principal fiber groups, cells, and blood supply." },
      { id: "oh_s10", title: "Alveolar bone", summary: "Cortical plate, trabecular bone, bundle bone, and remodeling." },
      { id: "oh_s11", title: "Maxillary sinus", summary: "Histology of Schneiderian membrane and sinus relations." },
      { id: "oh_s12", title: "Eruption and shedding", summary: "Mechanism of tooth eruption, osteoclasts, and primary shedding." },
      { id: "oh_s13", title: "TMJ", summary: "Histology of condyle, articular disc, and synovial membrane." },
      { id: "oh_s14", title: "Oral mucosa & Gingiva", summary: "Masticatory, lining, and specialized oral mucosa." },
      { id: "oh_s15", title: "Salivary glands & Tonsils", summary: "Serous and mucous acini, ducts, and lymphoid tonsillar tissue." }
    ]
  },
  {
    id: "subj_crown_bridge",
    title: "Crown and Bridge",
    titleAr: "الاستعاضة الثابتة",
    labQuizName: "Crown and Bridge Laboratory Quiz",
    icon: "fa-solid fa-crown",
    description: "Principles of fixed prosthodontics, crown preparations, impression techniques, and bridgework.",
    sheets: [
      { id: "cb_s1", title: "Introduction", summary: "Terminology and indications of fixed prosthodontics." },
      { id: "cb_s2", title: "Instrument", summary: "Burs, handpieces, and finish line preparation instruments." },
      { id: "cb_s3", title: "Principles of tooth preparation", summary: "Retention, resistance, structural durability, and marginal integrity." },
      { id: "cb_s4", title: "Metal ceramic", summary: "PFM crown design, framework thickness, and porcelain bonding." },
      { id: "cb_s5", title: "Full coverage", summary: "Full veneer gold and ceramic crown preparations." },
      { id: "cb_s6", title: "Fluid control", summary: "Gingival retraction cords, displacement pastes, and moisture control." },
      { id: "cb_s7", title: "Impression material", summary: "Elastomeric impression materials: polyether, PVS, and polysulfide." },
      { id: "cb_s8", title: "Working cast and die", summary: "Pindex system, gypsum die stone materials, and die trimmers." },
      { id: "cb_s9", title: "Wax pattern", summary: "Inlay wax manipulation, margin carving, and stress release." },
      { id: "cb_s10", title: "Spruing & investing", summary: "Sprue attachment rules, reservoir placement, and phosphate investment." },
      { id: "cb_s11", title: "Casting", summary: "Burnout technique, induction casting machines, and metal cooling." },
      { id: "cb_s12", title: "Pontic", summary: "Sanitary, modified ridge lap, and ovate pontic designs." },
      { id: "cb_s13", title: "Retainer", summary: "Major retainers, partial coverage retainers, and pinledges." },
      { id: "cb_s14", title: "Connector", summary: "Rigid solder joints and non-rigid key-keyway connectors." }
    ]
  },
  {
    id: "subj_prosthodontics",
    title: "Prosthodontics",
    titleAr: "الاستعاضة المتحركة",
    labQuizName: "Prosthodontics Laboratory Quiz",
    icon: "fa-solid fa-teeth-open",
    description: "Complete dentures, removable partial dentures (RPD), surveyor analysis, and jaw relations.",
    sheets: [
      { id: "pros_s1", title: "Introduction", summary: "Edentulism and biomechanical objectives of removable prostheses." },
      { id: "pros_s2", title: "Anatomical landmarks", summary: "Maxillary and mandibular primary and secondary stress bearing areas." },
      { id: "pros_s3", title: "Impression", summary: "Preliminary and custom tray border molding impression techniques." },
      { id: "pros_s4", title: "Relief", summary: "Palatine raphe, incisive papilla, and torus relief zones." },
      { id: "pros_s5", title: "Occlusion blocks", summary: "Fox plane, rim contouring, and vertical dimension of occlusion." },
      { id: "pros_s6", title: "Mandibular movement", summary: "Bennett angle, condylar guidance, and Gothic arch tracing." },
      { id: "pros_s7", title: "Face bow", summary: "Orientation of maxillary cast to semi-adjustable articulators." },
      { id: "pros_s8", title: "Selection of teeth", summary: "SPA factors, shade guides, and mold selection." },
      { id: "pros_s9", title: "Arrangement", summary: "Balanced occlusion rules for complete denture tooth setup." },
      { id: "pros_s10", title: "Retention", summary: "Adhesion, cohesion, capillary attraction, and peripheral seal." },
      { id: "pros_s11", title: "Processing of complete denture", summary: "Flasking, dewaxing, acrylic packing, and heat polymerization." },
      { id: "pros_s12", title: "Repair, relining and rebasing of Complete Denture", summary: "Denture fracture repair and tissue reconditioning." },
      { id: "pros_s13", title: "Removable partial prosthodontic", summary: "Kennedy classification of partially edentulous arches." },
      { id: "pros_s14", title: "RPD competent Rest", summary: "Occlusal, cingulum, and incisal rest seat preparations." },
      { id: "pros_s15", title: "Dental surveyor & surveying", summary: "Path of insertion, surveying arm, carbon marker, and undercut gauges." },
      { id: "pros_s16", title: "Direct and indirect retainer", summary: "Clasp assemblies: Akers, Roach, and indirect retention mechanics." },
      { id: "pros_s17", title: "Major and minor connector", summary: "Palatal bars, lingual bars, and minor connector rigid placement." },
      { id: "pros_s18", title: "Denture base", summary: "Metal base vs acrylic resin base retention." },
      { id: "pros_s19", title: "Laboratory Procedures", summary: "Refractory cast duplication and metal framework casting." },
      { id: "pros_s20", title: "Biomechanics of Removable Partial Denture", summary: "Leverage classes, fulcrum lines, and stress distribution." }
    ]
  },
  {
    id: "subj_pharmacology",
    title: "Pharmacology",
    titleAr: "علم الأدوية",
    labQuizName: "Pharmacology Laboratory Quiz",
    icon: "fa-solid fa-pills",
    description: "Drug mechanisms, autonomic nervous system, local anesthetics, analgesics, and antibiotics in dentistry.",
    sheets: [
      { id: "ph_s1", title: "Introduction", summary: "Pharmacokinetics, absorption, distribution, metabolism, and excretion." },
      { id: "ph_s2", title: "Autonomic nerve system", summary: "Sympathetic vs parasympathetic receptors: alpha, beta, and muscarinic." },
      { id: "ph_s3", title: "Antimicrobial agent", summary: "Penicillins, amoxicillin, macrolides, and metronidazole dosing." },
      { id: "ph_s4", title: "Opioid analgesics", summary: "Codeine, tramadol, and NSAID co-prescription in dental pain." }
    ]
  },
  {
    id: "subj_pathology",
    title: "Pathology",
    titleAr: "علم الأمراض",
    labQuizName: "Pathology Laboratory Quiz",
    icon: "fa-solid fa-disease",
    description: "General pathology, cell injury, inflammation, tissue repair, neoplasia, and oral manifestations of disease.",
    sheets: [
      { id: "path_s1", title: "Introduction", summary: "Etiology, pathogenesis, and cellular response to injury." },
      { id: "path_s2", title: "Adaptation", summary: "Hypertrophy, hyperplasia, atrophy, metaplasia, and dysplasia." },
      { id: "path_s3", title: "Cell injury", summary: "Reversible vs irreversible cell injury, necrosis types, and apoptosis." },
      { id: "path_s4", title: "Inflammation", summary: "Acute vascular changes, leukocyte extravasation, and chemical mediators." },
      { id: "path_s5", title: "Tissue repair", summary: "Granulation tissue, wound healing by primary and secondary intention." },
      { id: "path_s6", title: "Circulatory", summary: "Hyperemia, congestion, edema, thrombosis, and embolism." },
      { id: "path_s7", title: "Neoplasia", summary: "Benign vs malignant tumors, grading, staging, and metastasis." },
      { id: "path_s8", title: "Cardiovascular", summary: "Atherosclerosis, hypertension, and infective endocarditis." },
      { id: "path_s9", title: "Gastrointestinal pathology", summary: "Peptic ulcer disease, inflammatory bowel disease, and hepatitis." },
      { id: "path_s10", title: "Granuloma", summary: "Tuberculosis, sarcoidosis, and foreign body granulomatous inflammation." },
      { id: "path_s11", title: "Oral manifestation of systemic desaise", summary: "Diabetes mellitus, anemia, and leukemia oral mucosal signs." }
    ]
  },
  {
    id: "subj_microbiology",
    title: "Microbiology",
    titleAr: "الأحياء الدقيقة",
    labQuizName: "Microbiology Laboratory Quiz",
    icon: "fa-solid fa-vial-virus",
    description: "Bacteriology, virology, mycology, immunology, sterilization, and oral microflora.",
    sheets: [
      { id: "mb_s1", title: "Introduction", summary: "Microbial classification and normal human microflora." },
      { id: "mb_s2", title: "Bacteriology", summary: "Bacterial cell wall structure: Gram positive vs Gram negative." },
      { id: "mb_s3", title: "Bacterial taxonomy", summary: "Staphylococci, Streptococci, Actinomyces, and Spirochetes." },
      { id: "mb_s4", title: "Bacterial pathogenicity", summary: "Exotoxins, endotoxins, biofilms, and virulence factors." },
      { id: "mb_s5", title: "Antimicrobial chemotherapy", summary: "Minimum inhibitory concentration (MIC) and bacterial resistance." },
      { id: "mb_s6", title: "Clinically important bacteria", summary: "Streptococcus mutans, Porphyromonas gingivalis, and Enterococcus faecalis." },
      { id: "mb_s7", title: "Immunology", summary: "Innate vs adaptive immunity, antibodies, and T-cell responses." },
      { id: "mb_s8", title: "complement system", summary: "Classical, lectin, and alternative complement pathways." },
      { id: "mb_s9", title: "Mycology", summary: "Candida albicans pathogenesis and oral candidiasis." },
      { id: "mb_s10", title: "Sterilization and Disinfection", summary: "Autoclaving parameters (121°C/15psi), chemical disinfectants, and indicators." },
      { id: "mb_s11", title: "Bacterial genetic", summary: "Plasmids, conjugation, transformation, and transduction." },
      { id: "mb_s12", title: "Virology", summary: "Herpes simplex virus (HSV), Hepatitis B (HBV), and HIV dental management." }
    ]
  },
  {
    id: "subj_conservative",
    title: "Operative Dentistry & Dental Materials",
    titleAr: "العلاج التحفظي ومواد الأسنان",
    labQuizName: "Dental Materials Laboratory Quiz",
    icon: "fa-solid fa-tooth",
    description: "Cavity preparations, amalgam, composite resin, GIC, pulp protection, and dental materials laboratory testing.",
    sheets: [
      { id: "cons_s1", title: "Introduction", summary: "Principles of operative dentistry and tooth conservation." },
      { id: "cons_s2", title: "Tooth histology", summary: "Structure of enamel, dentin, and pulp in cavity design." },
      { id: "cons_s3", title: "Instruments", summary: "Hand instruments: hatchets, hoes, excavators, and rotary handpieces." },
      { id: "cons_s4", title: "Dental caries part 1 and 2", summary: "Black's classification of dental caries and etiology." },
      { id: "cons_s5", title: "Principles", summary: "Black's steps of cavity preparation: outline, retention, resistance form." },
      { id: "cons_s6", title: "Amalgam", summary: "Dental amalgam alloy composition, trituration, condensation, and carving." },
      { id: "cons_s7", title: "Class I & II cavity preparation for amalgam restoration", summary: "Class I and Class II cavity preparations." },
      { id: "cons_s8", title: "GIC", summary: "Glass ionomer cement adhesion, fluoride release, and mixing technique." },
      { id: "cons_s9", title: "Matrices and wedges", summary: "Tofflemire matrix band placement, wooden wedge positioning." },
      { id: "cons_s10", title: "Composite resin restoration", summary: "Etch-and-rinse bonding agents, light curing, and incremental placement." },
      { id: "cons_s11", title: "Pulp protection", summary: "Cavity varnishes, liners (CaOH), and bases (ZOE, zinc phosphate)." },
      { id: "cons_s12", title: "Non carries lesion", summary: "Attrition, abrasion, erosion, and abfraction management." }
    ]
  }
];

// Attach QUIZZES to sheets
DENTAL_SUBJECTS_TAXONOMY.forEach(sub => {
  sub.sheets.forEach(sheet => {
    sheet.quizzes = [
      {
        question: `In ${sub.title} (${sheet.title}), what is the primary clinical objective during procedures?`,
        options: [
          "Preservation of remaining healthy tooth structure",
          "Excessive removal of enamel rods",
          "Ignoring gingival finish line margin",
          "Applying un-mixed restorative material"
        ],
        correctAnswer: 0,
        explanation: `In ${sub.title}, preserving sound natural tooth structure while achieving biological and mechanical stability is essential.`
      },
      {
        question: `Which instrument or material parameter is crucial in ${sub.title} ${sheet.title}?`,
        options: [
          "Controlling setting expansion and moisture contamination",
          "Over-heating the dental pulp without air-water coolant",
          "Using un-sterilized hand instruments",
          "Omitting occlusal registration"
        ],
        correctAnswer: 0,
        explanation: `Proper material manipulation and thermal/moisture control ensures longevity in ${sub.title}.`
      }
    ];
  });
});

// EXPLICIT GLOBAL WINDOW BINDINGS
window.DENTAL_SUBJECTS_TAXONOMY = DENTAL_SUBJECTS_TAXONOMY;
window.DENTISTOIRE_SUBJECTS = DENTAL_SUBJECTS_TAXONOMY;
"@

[System.IO.File]::WriteAllText('C:\Users\us\.gemini\antigravity\scratch\lecture_quiz_app\data.js', $dataJsClean, [System.Text.Encoding]::UTF8)
