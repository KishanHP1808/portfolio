import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'kn';

export interface Translations {
  navbar: {
    mysuru: string;
    mysuru_label: string;
    mit_college: string;
    mit_college_short: string;
    work: string;
    about: string;
    skills: string;
    experience: string;
    certificates: string;
    contact: string;
    talk_to_him: string;
    talk_short: string;
    resume: string;
    sign_in: string;
    saved: string;
    menu: string;
    close: string;
    esc: string;
    nav_archive: string;
    language_switch_prompt: string;
    lang_en: string;
    lang_kn: string;
    theme_light: string;
    theme_dark: string;
    theme_tooltip: string;
  };
  hero: {
    available_for_hire: string;
    location: string;
    role: string;
    college_tag: string;
    tagline: string;
    bio: string;
    explore_work: string;
    get_in_touch: string;
    talk_to_him: string;
    download_resume: string;
    scroll_down: string;
  };
  projects: {
    curated_badge: string;
    section_title: string;
    section_subtitle: string;
    open_case_study: string;
    deployed_vercel: string;
    deployed_render: string;
    live_production: string;
    project_label: string;
    agriguard_subtitle: string;
    agriguard_desc: string;
    football_subtitle: string;
    football_desc: string;
    assistant_subtitle: string;
    assistant_desc: string;
  };
  about: {
    badge: string;
    title: string;
    manifesto: string;
    bio_p1: string;
    bio_p2: string;
    location_label: string;
    college_label: string;
    focus_title: string;
    hobbies_title: string;
  };
  skills: {
    badge: string;
    title: string;
    all: string;
    frontend: string;
    backend: string;
    design: string;
    tools: string;
    ai_ml: string;
    github_repos: string;
    level_expert: string;
    level_advanced: string;
    level_proficient: string;
  };
  experience: {
    badge: string;
    title: string;
  };
  certificates: {
    badge: string;
    title: string;
    view_all_drive: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    form_name: string;
    form_name_placeholder: string;
    form_email: string;
    form_email_placeholder: string;
    form_msg: string;
    form_msg_placeholder: string;
    send_btn: string;
    sending: string;
    sent_success: string;
    mysuru_location: string;
    back_to_top: string;
    made_with_passion: string;
  };
  backToTop: {
    label: string;
    tooltip: string;
  };
  floatingNav: {
    back: string;
    back_to_top: string;
    top: string;
    phase: string;
    phases: Record<string, string>;
  };
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    navbar: {
      mysuru: 'MYSURU',
      mysuru_label: 'MYSURU [IST]',
      mit_college: 'Maharaja Institute of Technology Tandavapura',
      mit_college_short: 'MIT Tandavapura',
      work: 'WORK',
      about: 'ABOUT',
      skills: 'SKILLS',
      experience: 'EXPERIENCE',
      certificates: 'CERTIFICATES',
      contact: 'CONTACT',
      talk_to_him: 'TALK TO HIM',
      talk_short: 'TALK',
      resume: 'RESUME',
      sign_in: 'SIGN IN',
      saved: 'PROFILE',
      menu: 'MENU',
      close: 'CLOSE',
      esc: 'ESC',
      nav_archive: 'NAVIGATION & ARCHIVE',
      language_switch_prompt: 'Switch to Kannada (ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ)',
      lang_en: 'EN',
      lang_kn: 'ಕನ್ನಡ',
      theme_light: 'LIGHT',
      theme_dark: 'DARK',
      theme_tooltip: 'Switch theme',
    },
    hero: {
      available_for_hire: 'AVAILABLE FOR HIRE',
      location: 'MYSURU, KARNATAKA, INDIA',
      role: 'FRONTEND DEVELOPER & UI/UX DESIGNER',
      college_tag: 'Computer Science Engineering • MIT Tandavapura',
      tagline: 'I build digital experiences where design, technology, and interaction meet.',
      bio: 'Creative technologist and frontend engineer with a focus on immersive 3D/canvas physics, responsive typography, and sub-frame interaction mechanics.',
      explore_work: 'EXPLORE WORK',
      get_in_touch: 'GET IN TOUCH',
      talk_to_him: 'TALK TO HIM',
      download_resume: 'DOWNLOAD RESUME',
      scroll_down: 'SCROLL TO EXPLORE',
    },
    projects: {
      curated_badge: 'CURATED SELECTIONS',
      section_title: 'FEATURED WORK',
      section_subtitle: 'High-concurrency distributed engines, autonomous AI agents, and reactive web applications.',
      open_case_study: 'OPEN CASE STUDY',
      deployed_vercel: 'DEPLOYED ON VERCEL',
      deployed_render: 'DEPLOYED ON RENDER',
      live_production: 'LIVE PRODUCTION',
      project_label: 'PROJECT',
      agriguard_subtitle: 'AI-Powered Crop Pathology Defense & Agricultural Intelligence Suite',
      agriguard_desc: 'An intelligent agricultural safeguarding suite diagnosing crop diseases, analyzing soil metrics, and providing predictive yield defense with real-time field telemetry.',
      football_subtitle: 'High-Concurrency Real-Time Player Bidding Arena',
      football_desc: 'An adrenaline-fueled sports auction arena handling multi-room simultaneous bids, salary-cap validations, and real-time live audience broadcasting.',
      assistant_subtitle: 'Autonomous Knowledge Retrieval & Multi-Document Synthesis Engine',
      assistant_desc: 'An intelligent autonomous research companion capable of deep literature indexing, semantic cross-referencing, and instantaneous citation synthesis.',
    },
    about: {
      badge: 'EDITORIAL MONOGRAPH',
      title: 'ABOUT ME',
      manifesto: 'I believe websites should not merely function—they should evoke emotion, command attention, and perform with zero friction.',
      bio_p1: 'I am a Frontend Developer and UI/UX Designer based in Mysuru, Karnataka, dedicated to bridging raw technical horsepower with high-aesthetic design choreography.',
      bio_p2: 'Based in the heritage tech hub of Mysuru, Karnataka, Kishan approaches every interface as both a gallery installation and a precision tool. He rejects the compromise between visual grandeur and runtime velocity, ensuring every layout responds with sub-frame fluidness.',
      location_label: 'Mysuru, Karnataka, India',
      college_label: 'Maharaja Institute of Technology Tandavapura',
      focus_title: 'AREAS OF RIGOR',
      hobbies_title: 'CREATIVE PERSPECTIVE',
    },
    skills: {
      badge: 'TECHNICAL ARSENAL',
      title: 'CAPABILITIES',
      all: 'ALL DISCIPLINES',
      frontend: 'FRONTEND',
      backend: 'BACKEND',
      design: 'DESIGN & UI/UX',
      tools: 'TOOLS & ARCHITECTURE',
      ai_ml: 'AI & ML',
      github_repos: 'GITHUB CODE REPOSITORIES',
      level_expert: 'Expert',
      level_advanced: 'Advanced',
      level_proficient: 'Proficient',
    },
    experience: {
      badge: 'CHRONOLOGY',
      title: 'EXPERIENCE',
    },
    certificates: {
      badge: 'VERIFIED CREDENTIALS',
      title: 'CERTIFICATES',
      view_all_drive: 'EXPLORE FULL CREDENTIAL ARCHIVE ON GOOGLE DRIVE',
    },
    contact: {
      badge: 'COMMUNICATION PROTOCOL',
      title: "LET'S BUILD SOMETHING EXTRAORDINARY",
      subtitle: 'Have a project in mind, seeking full-stack excellence, or want to explore collaboration? Drop an inquiry.',
      form_name: 'YOUR NAME',
      form_name_placeholder: 'John Doe / Recruiter Name',
      form_email: 'YOUR EMAIL ADDRESS',
      form_email_placeholder: 'name@company.com',
      form_msg: 'PROJECT SCOPE / MESSAGE',
      form_msg_placeholder: 'Tell me about your product, project timeline, or open engineering role...',
      send_btn: 'SEND MESSAGE',
      sending: 'TRANSMITTING...',
      sent_success: 'MESSAGE TRANSMITTED SUCCESSFULLY! KISHAN WILL RESPOND SHORTLY.',
      mysuru_location: 'Mysuru, Karnataka, India (12.2958° N, 76.6394° E)',
      back_to_top: 'BACK TO TOP',
      made_with_passion: 'CRAFTED WITH PRECISION IN MYSURU, KARNATAKA',
    },
    backToTop: {
      label: 'TOP',
      tooltip: 'Back to Top (Hero)',
    },
    floatingNav: {
      back: 'BACK TO',
      back_to_top: 'BACK TO TOP',
      top: 'TOP',
      phase: 'PHASE',
      phases: {
        hero: 'INITIATION',
        work: 'FEATURED WORK',
        skills: 'CAPABILITIES',
        experience: 'EXPERIENCE',
        certificates: 'CERTIFICATES',
        about: 'ABOUT ME',
        contact: 'CONTACT',
      },
    },
  },
  kn: {
    navbar: {
      mysuru: 'ಮೈಸೂರು',
      mysuru_label: 'ಮೈಸೂರು [IST]',
      mit_college: 'ಮಹಾರಾಜ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ ಆಫ್ ಟೆಕ್ನಾಲಜಿ ತಾಂಡವಪುರ, ಮೈಸೂರು',
      mit_college_short: 'MIT ತಾಂಡವಪುರ',
      work: 'ಕೆಲಸಗಳು',
      about: 'ಪರಿಚಯ',
      skills: 'ಕೌಶಲ್ಯಗಳು',
      experience: 'ಅನುಭವ',
      certificates: 'ಪ್ರಮಾಣಪತ್ರಗಳು',
      contact: 'ಸಂಪರ್ಕ',
      talk_to_him: 'ಕಿಶನ್ ಜೊತೆ ಮಾತನಾಡಿ',
      talk_short: 'ಮಾತನಾಡಿ',
      resume: 'ರೆಸ್ಯೂಮೆ',
      sign_in: 'ಸೈನ್ ಇನ್',
      saved: 'ಪ್ರೊಫೈಲ್',
      menu: 'ಮೆನು',
      close: 'ಮುಚ್ಚಿ',
      esc: 'ESC (ಮುಚ್ಚಿ)',
      nav_archive: 'ನ್ಯಾವಿಗೇಷನ್ & ದಾಖಲೆಗಳು',
      language_switch_prompt: 'Switch to English (ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಾಯಿಸಿ)',
      lang_en: 'EN',
      lang_kn: 'ಕನ್ನಡ',
      theme_light: 'ಲೈಟ್ ಮೋಡ್',
      theme_dark: 'ಡಾರ್ಕ್ ಮೋಡ್',
      theme_tooltip: 'ಥೀಮ್ ಬದಲಾಯಿಸಿ',
    },
    hero: {
      available_for_hire: 'ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳಿಗೆ ಲಭ್ಯವಿದ್ದಾರೆ',
      location: 'ಮೈಸೂರು, ಕರ್ನಾಟಕ, ಭಾರತ',
      role: 'ಫ್ರಂಟ್-ಎಂಡ್ ಡೆವಲಪರ್ & UI/UX ವಿನ್ಯಾಸಕಾರ',
      college_tag: 'ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ & ಇಂಜಿನಿಯರಿಂಗ್ • MIT ತಾಂಡವಪುರ, ಮೈಸೂರು',
      tagline: 'ವಿನ್ಯಾಸ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಪರಸ್ಪರ ಕ್ರಿಯೆ ಒಂದಾಗುವ ಅದ್ಭುತ ಡಿಜಿಟಲ್ ಅನುಭವಗಳನ್ನು ರೂಪಿಸುತ್ತೇನೆ.',
      bio: 'ಅತ್ಯುನ್ನತ 3D/ಕ್ಯಾನ್ವಾಸ್ ತಂತ್ರಜ್ಞಾನ, ಸ್ಪಂದಿಸುವ ಟೈಪೋಗ್ರಫಿ ಮತ್ತು ವೇಗದ ಬಳಕೆದಾರ ಅನುಭವವನ್ನು ರಚಿಸುವ ಮೈಸೂರಿನ ಸೃಜನಶೀಲ ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್.',
      explore_work: 'ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
      get_in_touch: 'ಸಂಪರ್ಕಿಸಿ',
      talk_to_him: 'ಕಿಶನ್ ಜೊತೆ ಮಾತನಾಡಿ',
      download_resume: 'ರೆಸ್ಯೂಮೆ ಡೌನ್‌ಲೋಡ್',
      scroll_down: 'ಕೆಳಗೆ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ',
    },
    projects: {
      curated_badge: 'ಆಯ್ದ ಮುಖ್ಯ ಯೋಜನೆಗಳು',
      section_title: 'ಆಯ್ದ ಕೆಲಸಗಳು (FEATURED WORK)',
      section_subtitle: 'ಹೆಚ್ಚಿನ ವೇಗದ ತಂತ್ರಜ್ಞಾನ, ಸ್ವಾಯತ್ತ ಎಐ ಏಜೆಂಟ್‌ಗಳು ಮತ್ತು ನೈಜ-ಸಮಯದ ವೆಬ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು.',
      open_case_study: 'ಪ್ರಾಜೆಕ್ಟ್ ವಿವರ ನೋಡಿ',
      deployed_vercel: 'ವರ್ಸೆಲ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗಿದೆ (VERCEL)',
      deployed_render: 'ರೆಂಡರ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗಿದೆ (RENDER)',
      live_production: 'ಲೈವ್ ಅಪ್ಲಿಕೇಶನ್ (LIVE)',
      project_label: 'ಪ್ರಾಜೆಕ್ಟ್',
      agriguard_subtitle: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಕೃಷಿ ರಕ್ಷಾ ವೇದಿಕೆ',
      agriguard_desc: 'ರೈತರಿಗೆ ಬೆಳೆ ರೋಗಗಳನ್ನು ಸುಲಭವಾಗಿ ಪತ್ತೆಹಚ್ಚಲು, ಮಣ್ಣಿನ ಸ್ಥಿತಿ ವಿಶ್ಲೇಷಿಸಲು ಮತ್ತು ಅಧಿಕ ಇಳುವರಿ ಪಡೆಯಲು ನೆರವಾಗುವ ನೈಜ ಸಮಯದ ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆ.',
      football_subtitle: 'ನೈಜ-ಸಮಯದ ಆಟಗಾರರ ಹರಾಜು ಮತ್ತು ಬಿಡ್ಡಿಂಗ್ ಕ್ರೀಡಾ ವೇದಿಕೆ',
      football_desc: 'ಏಕಕಾಲಿಕ ಬಿಡ್ಡಿಂಗ್, ಬಜೆಟ್ ನಿರ್ವಹಣೆ ಮತ್ತು ನೈಜ ಸಮಯದ ಲೈವ್ ಪ್ರಸಾರವನ್ನು ನಿರ್ವಹಿಸುವ ರೋಮಾಂಚಕ ಕ್ರೀಡಾ ಹರಾಜು ವೇದಿಕೆ.',
      assistant_subtitle: 'ಸ್ವಾಯತ್ತ ಜ್ಞಾನ ಮರುಪಡೆಯುವಿಕೆ ಮತ್ತು ಬಹು-ದಾಖಲೆಗಳ ಸಂಶ್ಲೇಷಣಾ ಎಂಜಿನ್',
      assistant_desc: 'ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳು ಮತ್ತು ವರದಿಗಳನ್ನು ಆಳವಾಗಿ ವಿಶ್ಲೇಷಿಸಿ ನಿಖರವಾದ ಸಾರಾಂಶ ಮತ್ತು ಉಲ್ಲೇಖಗಳನ್ನು ಒದಗಿಸುವ ಬುದ್ಧಿವಂತ ಎಐ ಸಂಶೋಧನಾ ಸಹಾಯಕ.',
    },
    about: {
      badge: 'ವೈಯಕ್ತಿಕ ಪರಿಚಯ ಮತ್ತು ದೃಷ್ಟಿಕೋನ',
      title: 'ನನ್ನ ಬಗ್ಗೆ',
      manifesto: 'ವೆಬ್‌ಸೈಟ್‌ಗಳು ಕೇವಲ ಕೆಲಸ ಮಾಡುವುದಷ್ಟೇ ಅಲ್ಲದೆ, ನೋಡಲು ಅತ್ಯಂತ ಸುಂದರವಾಗಿ, ಆಕರ್ಷಕವಾಗಿ ಮತ್ತು ತಡೆರಹಿತವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸಬೇಕು ಎಂದು ನಾನು ನಂಬುತ್ತೇನೆ.',
      bio_p1: 'ನಾನು ಮೈಸೂರಿನ ಫ್ರಂಟ್-ಎಂಡ್ ಡೆವಲಪರ್ ಮತ್ತು UI/UX ವಿನ್ಯಾಸಕಾರನಾಗಿದ್ದು, ಅತ್ಯಾಧುನಿಕ ತಾಂತ್ರಿಕ ಸಾಮರ್ಥ್ಯವನ್ನು ಆಕರ್ಷಕ ವಿನ್ಯಾಸದೊಂದಿಗೆ ಸಂಯೋಜಿಸಲು ಸಮರ್ಪಿತನಾಗಿದ್ದೇನೆ.',
      bio_p2: 'ಕರ್ನಾಟಕದ ಸಾಂಸ್ಕೃತಿಕ ರಾಜಧಾನಿ ಮೈಸೂರಿನಲ್ಲಿ ನೆಲೆಸಿರುವ ಕಿಶನ್, ಪ್ರತಿಯೊಂದು ಇಂಟರ್ಫೇಸ್ ಅನ್ನು ಕಲಾತ್ಮಕವಾಗಿ ಹಾಗೂ ನಿಖರ ಸಾಧನದಂತೆ ರೂಪಿಸುತ್ತಾರೆ. ವೇಗ, ಸೌಂದರ್ಯ ಮತ್ತು ಸರಳತೆಗೆ ಮೊದಲ ಆದ್ಯತೆ ನೀಡುತ್ತಾರೆ.',
      location_label: 'ಮೈಸೂರು, ಕರ್ನಾಟಕ, ಭಾರತ',
      college_label: 'ಮಹಾರಾಜ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ ಆಫ್ ಟೆಕ್ನಾಲಜಿ ತಾಂಡವಪುರ, ಮೈಸೂರು',
      focus_title: 'ಮುಖ್ಯ ಪರಿಣತಿಯ ಕ್ಷೇತ್ರಗಳು',
      hobbies_title: 'ವೈಯಕ್ತಿಕ ಆಸಕ್ತಿ ಮತ್ತು ಹವ್ಯಾಸಗಳು',
    },
    skills: {
      badge: 'ತಾಂತ್ರಿಕ ಸಾಮರ್ಥ್ಯಗಳು',
      title: 'ಕೌಶಲ್ಯಗಳು & ಪರಿಣತಿ',
      all: 'ಎಲ್ಲಾ ಕೌಶಲ್ಯಗಳು',
      frontend: 'ಫ್ರಂಟ್-ಎಂಡ್',
      backend: 'ಬ್ಯಾಕ್‌ಎಂಡ್',
      design: 'ವಿನ್ಯಾಸ & UI/UX',
      tools: 'ಪರಿಕರಗಳು & ಆರ್ಕಿಟೆಕ್ಚರ್',
      ai_ml: 'ಎಐ & ಮಷಿನ್ ಲರ್ನಿಂಗ್',
      github_repos: 'ಗಿಟ್‌ಹಬ್ ಕೋಡ್ ರೆಪೊಸಿಟರಿಗಳು',
      level_expert: 'ತಜ್ಞ (Expert)',
      level_advanced: 'ಉನ್ನತ (Advanced)',
      level_proficient: 'ಪ್ರವೀಣ (Proficient)',
    },
    experience: {
      badge: 'ವೃತ್ತಿಪರ ಪಯಣ',
      title: 'ಅನುಭವ ಮತ್ತು ಸಾಧನೆಗಳು',
    },
    certificates: {
      badge: 'ದೃಢೀಕೃತ ಪ್ರಮಾಣಪತ್ರಗಳು',
      title: 'ಪ್ರಮಾಣಪತ್ರಗಳು & ಗೌರವಗಳು',
      view_all_drive: 'ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಎಲ್ಲಾ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    },
    contact: {
      badge: 'ಸಂಪರ್ಕ ಮತ್ತು ಮಾತುಕತೆ',
      title: 'ಒಟ್ಟಾಗಿ ಅದ್ಭುತವಾದದ್ದನ್ನು ನಿರ್ಮಿಸೋಣ',
      subtitle: 'ನಿಮ್ಮಲ್ಲಿ ಹೊಸ ಯೋಜನೆಯ ಕಲ್ಪನೆ ಇದೆಯೇ, ನೇಮಕ ಮಾಡಿಕೊಳ್ಳಲು ಬಯಸುವಿರಾ ಅಥವಾ ಮಾತನಾಡಲು ಇಚ್ಛಿಸುವಿರಾ? ಸಂದೇಶ ಕಳುಹಿಸಿ.',
      form_name: 'ನಿಮ್ಮ ಹೆಸರು',
      form_name_placeholder: 'ನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ಕಂಪನಿಯ ಹೆಸರು',
      form_email: 'ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ',
      form_email_placeholder: 'name@company.com',
      form_msg: 'ಯೋಜನೆಯ ವಿವರ / ಸಂದೇಶ',
      form_msg_placeholder: 'ನಿಮ್ಮ ಯೋಜನೆ, ಸಮಯಾವಧಿ ಅಥವಾ ಉದ್ಯೋಗದ ಅವಕಾಶದ ಬಗ್ಗೆ ತಿಳಿಸಿ...',
      send_btn: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
      sending: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
      sent_success: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಂದೇಶ ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿದೆ. ಕಿಶನ್ ಶೀಘ್ರದಲ್ಲೇ ಪ್ರತಿಕ್ರಿಯಿಸಲಿದ್ದಾರೆ.',
      mysuru_location: 'ಮೈಸೂರು, ಕರ್ನಾಟಕ, ಭಾರತ (12.2958° N, 76.6394° E)',
      back_to_top: 'ಮೇಲಕ್ಕೆ ಹೋಗಿ',
      made_with_passion: 'ಮೈಸೂರು, ಕರ್ನಾಟಕದಲ್ಲಿ ಅತ್ಯಂತ ಪ್ರೀತಿಯಿಂದ ರೂಪಿಸಲಾಗಿದೆ',
    },
    backToTop: {
      label: 'ಮೇಲಕ್ಕೆ',
      tooltip: 'ಪುಟದ ಆರಂಭಕ್ಕೆ ಹಿಂತಿರುಗಿ (Back to Top)',
    },
    floatingNav: {
      back: 'ಹಿಂದಕ್ಕೆ',
      back_to_top: 'ಮೇಲಕ್ಕೆ ಹೋಗಿ',
      top: 'ಮೇಲಕ್ಕೆ',
      phase: 'ಹಂತ',
      phases: {
        hero: 'ಪ್ರಾರಂಭ',
        work: 'ಯೋಜನೆಗಳು',
        skills: 'ಕೌಶಲ್ಯಗಳು',
        experience: 'ಅನುಭವ',
        certificates: 'ಪ್ರಮಾಣಪತ್ರಗಳು',
        about: 'ಪರಿಚಯ',
        contact: 'ಸಂಪರ್ಕ',
      },
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isKannada: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'kishan_portfolio_lang';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'kn' || saved === 'en') {
        return saved;
      }
    } catch {
      // Local storage unavailable
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: TRANSLATIONS[language],
    isKannada: language === 'kn',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
