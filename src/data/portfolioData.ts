import { Project, SkillItem, ExperienceItem, Certificate } from '../types';

export const PERSONAL_INFO = {
  name: "KISHAN H.P",
  firstName: "KISHAN",
  lastName: "H.P",
  title: "Frontend Developer & UI/UX Designer",
  roles: [
    "Frontend Developer",
    "UI/UX Designer",
    "Full Stack Web Developer",
    " Exploring AI & Machine Learning"
  ],
  location: "Mysuru, Karnataka, India",
  locationShort: "Mysuru, Karnataka",
  coordinates: "12.2958° N, 76.6394° E",
  email: "kishanhp18@gmail.com",
  phone: "8431926645",
  college: {
    name: "Maharaja Institute of Technology Tandavapura",
    shortName: "MIT Tandavapura",
    url: "https://mitt.edu.in/",
  },
  heroTagline: "I build digital experiences where design, technology and interaction meet.",
  aboutHeadline: "I design and build digital experiences that feel as good as they function.",
  aboutDescription: "KISHAN H.P is a frontend developer, UI/UX designer and full stack web developer based in Mysuru, Karnataka. Bridging the divide between high-fidelity aesthetics and robust engineering, he crafts visceral interfaces with cinematic pacing and performance-first architecture.",
  socials: {
    github: "https://github.com/KishanHP1808",
    linkedin: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    instagram: "https://www.instagram.com/kishan_h.p.shaiva?stkn=eWhsY3BtNnhsZDg4",
    instagramHandle: "kishan_h.p.shaiva",
    leetcode: "https://leetcode.com/u/Kishan_H_P",
    leetcodeUsername: "Kishan_HP",
    googleDriveCertificates: "https://drive.google.com/drive/folders/1RqCIJMREGOfOVoxlt33iGVFRvRwHIpnZ?usp=drive_link"
  }
};

export const CERTIFICATES_DRIVE_CONFIG = {
  folderId: "1RqCIJMREGOfOVoxlt33iGVFRvRwHIpnZ",
  url: "https://drive.google.com/drive/folders/1RqCIJMREGOfOVoxlt33iGVFRvRwHIpnZ?usp=drive_link",
  embedUrl: "https://drive.google.com/embeddedfolderview?id=1RqCIJMREGOfOVoxlt33iGVFRvRwHIpnZ#grid",
  embedListUrl: "https://drive.google.com/embeddedfolderview?id=1RqCIJMREGOfOVoxlt33iGVFRvRwHIpnZ#list",
  title: "Official Google Drive Certificate Vault",
  description: "Live cloud drive repository hosting Kishan's authentic certificates, degree credentials, and technical accreditations. Uploads to this Google Drive are instantly reflected in real-time."
};

export const FOCUS_AREAS = [
  {
    title: "Frontend Development",
    number: "01",
    desc: "Architecting responsive, high-fps interactive web applications using React, Next.js, and TypeScript with GPU-accelerated motion."
  },
  {
    title: "UI/UX Design",
    number: "02",
    desc: "Translating ambiguous problem spaces into deliberate design systems, ergonomic wireframes, and high-contrast editorial layouts in Figma."
  },
  {
    title: "Web Development",
    number: "03",
    desc: "Constructing end-to-end full stack solutions powered by Node.js, Python, Django, RESTful endpoints, and relational architectures."
  },
  {
    title: "Interactive Experiences",
    number: "04",
    desc: "Orchestrating micro-interactions, canvas shaders, mask transitions, and kinetic typography that command visceral attention."
  },
  {
    title: "Responsive Design",
    number: "05",
    desc: "Pixel-perfect mathematical scales and typographic rhythm across ultra-wide monitors, laptops, tablets, and handheld devices."
  },
  {
    title: "Creative Development",
    number: "06",
    desc: "Blending creative coding, GSAP scroll choreographies, custom audio-visual feedback, and spatial art direction."
  }
];

export const HOBBIES = [
  {
    id: "capturing-pictures",
    title: "Capturing Pictures",
    category: "Photography & Lens Framing",
    tagline: "Freezing ephemeral moments, street light, and architectural geometry through visual composition.",
    iconName: "Camera",
    accentColor: "#00f0ff",
    details: [
      "Golden hour contrast and natural depth of field",
      "Architectural symmetry & geometric perspective framing",
      "Street candid moments & monochrome contrasts"
    ]
  },
  {
    id: "drawing-portrait",
    title: "Drawing Portraits",
    category: "Fine Art & Hand Sketching",
    tagline: "Handcrafting lifelike pencil sketches, facial anatomy, tonal values, and expressive human emotion on paper.",
    iconName: "Palette",
    accentColor: "#a855f7",
    details: [
      "Realistic pencil shading, cross-hatching, and graphite gradients",
      "Expressive facial anatomy and dynamic gaze capture",
      "Organic hand-drawn artistry that directly mirrors his custom signature"
    ]
  },
  {
    id: "movies",
    title: "Movies & Cinema",
    category: "Cinematography & Narrative",
    tagline: "Studying visual rhythm, color grading palettes, director cuts, and atmospheric pacing in world cinema.",
    iconName: "Film",
    accentColor: "#f59e0b",
    details: [
      "Analyzing cinematography, framing, and aspect-ratio shifts",
      "Immersive film scores and spatial sound design",
      "Translating cinematic visual storytelling into web design"
    ]
  },
  {
    id: "exploring-places",
    title: "Exploring Places",
    category: "Travel & Heritage Discovery",
    tagline: "Wandering historic monuments, quiet forest pathways, vibrant city lanes, and unexplored horizons.",
    iconName: "Compass",
    accentColor: "#10b981",
    details: [
      "Heritage temple architecture across Karnataka and beyond",
      "Unplanned road trips and scenic elevation viewpoints",
      "Absorbing regional cultures, craftsmanship, and local cuisines"
    ]
  },
  {
    id: "and-much-more",
    title: "And Much More",
    category: "Creative Coding & Soundscapes",
    tagline: "Synthesizing ambient beats, exploring AI models, experimenting with physics shaders, and late-night curiosity.",
    iconName: "Sparkles",
    accentColor: "#ec4899",
    details: [
      "Curating ambient lo-fi and cinematic synth soundscapes",
      "Testing emerging generative AI & real-time canvas shaders",
      "Continuous algorithmic challenges and problem solving"
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "agri-guard",
    number: "01",
    title: "AGRIGUARD",
    subtitle: "AI-Powered Crop Pathology Defense & Agricultural Intelligence Suite",
    category: "Full Stack • Computer Vision & AgroTech",
    year: "2026",
    role: "Full Stack Architect & Lead AI/UI Engineer",
    technologies: ["Python", "Machine Learning", "FastAPI / Django", "React", "Tailwind CSS", "Vercel Deployment"],
    description: "An intelligent agricultural safeguarding suite diagnosing crop diseases, analyzing soil metrics, and providing predictive yield defense with real-time field telemetry.",
    longDescription: "AgriGuard transforms digital crop protection by connecting advanced agricultural computer vision models with an ergonomic, field-ready user interface. Farmers and agronomists can upload leaf imagery or monitor live crop health feeds to receive sub-second disease classification, preventative treatment protocols, and soil moisture telemetry with zero latency.",
    highlights: [
      "High-accuracy leaf pathology detection with instant diagnostic treatment guides",
      "Live deployment on Vercel with sub-second API inference response times",
      "Ergonomic mobile-first responsive interface engineered for bright outdoor field lighting",
      "Localized weather risk projections and automated pest outbreak alert triggers"
    ],
    challenge: "Running computer vision inference models and delivering actionable farming advice over unpredictable rural cellular connections without sluggish page loads.",
    solution: "Implemented lightweight model quantization, edge caching, and an optimistic UI on React with automated offline diagnostic caching.",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1600&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#00f0ff",
    liveUrl: "https://agri-guard-mocha.vercel.app/",
    githubUrl: "https://github.com/KishanHP1808/crop-disease-detection"
  },
  {
    id: "football-auction",
    number: "02",
    title: "FOOTBALL AUCTION",
    subtitle: "High-Concurrency Real-Time Player Bidding Arena",
    category: "Full Stack • Real-Time Engine",
    year: "2026",
    role: "Full Stack Architect",
    technologies: ["Python", "Django", "WebSockets", "React", "Tailwind CSS", "PostgreSQL", "Vercel Deployment"],
    description: "An adrenaline-fueled sports auction arena handling multi-room simultaneous bids, salary-cap validations, and real-time live audience broadcasting.",
    longDescription: "Engineered for high-stakes sports management leagues, Football Auction brings the drama of the transfer market to life. Featuring synchronized live clocks, automated budget deductions, dynamic player stat cards, and sound-reactive countdowns, it creates an electric stadium atmosphere.",
    highlights: [
      "Sub-20ms real-time bid synchronization across concurrent bidders on Vercel",
      "Automated financial constraint enforcement and squad chemistry analytics",
      "Interactive player card reveal animations with custom sound cues",
      "Full administrative oversight with instant round pause and rollback capabilities"
    ],
    challenge: "Preventing race conditions during split-second bid submissions at zero seconds on the countdown clock while streaming live state to hundreds of spectators.",
    solution: "Implemented Redis pub/sub locks on the Django ASGI backend with optimistic UI updates in React, ensuring atomic bid validation without state drift.",
    image: "/images/messi-4k.jpg",
    secondaryImage: "/images/messi-4k-action.jpg",
    accentColor: "#00e5ff",
    liveUrl: "https://football-auction-three.vercel.app/",
    githubUrl: "https://github.com/KishanHP1808/football-auction"
  },
  {
    id: "research-assistant",
    number: "03",
    title: "AI ASSISTANT",
    subtitle: "Autonomous Knowledge Retrieval & Multi-Document Synthesis Engine",
    category: "AI Engineering • Full Stack",
    year: "2026",
    role: "Full Stack & AI Engineer",
    technologies: ["Python", "LLMs / NLP", "FastAPI", "React", "TypeScript", "Tailwind CSS", "Vercel Deployment"],
    description: "An intelligent autonomous research companion capable of deep literature indexing, semantic cross-referencing, and instantaneous citation synthesis.",
    longDescription: "AI Assistant accelerates academic and technical inquiries. It parses dense research papers, whitepapers, and unstructured data corpuses into interactive knowledge graphs, generates structured executive summaries with source verification, and answers complex multi-hop queries with exact bibliographic anchors.",
    highlights: [
      "Multi-document vector embedding pipeline with semantic citation verification",
      "Zero-hallucination grounded retrieval with direct source-paragraph highlighting",
      "Interactive markdown canvas with exportable research briefs and mind maps",
      "Live deployment on Vercel with streaming response generation for zero wait times"
    ],
    challenge: "Preventing cognitive fatigue when synthesizing 50+ page PDFs with conflicting terminologies and complex equations.",
    solution: "Engineered a retrieval-augmented synthesis pipeline that breaks queries into sub-hypotheses and renders side-by-side verification citations.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    accentColor: "#38bdf8",
    liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
    githubUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant"
  }
];

export const SKILLS: SkillItem[] = [
  {
    name: "Python",
    category: "Backend",
    level: "Expert",
    highlight: "Autonomous AI agents, FastAPI microservices, Django 5 ORM, and ML models",
    gitWorks: [
      {
        repoName: "KishanHP1808/Personal-Research-Assistant",
        repoUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant",
        roleOrUsage: "Core Language & Multi-Agent AI Engine",
        primaryLanguage: "Python",
        stars: 1,
        liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
        keyImplementations: [
          "Built multi-agent research pipelines leveraging LangChain and Tavily Search API",
          "Engineered asynchronous FastAPI microservices with streaming report outputs",
          "Automated structured PDF and markdown documentation synthesis via ReportLab"
        ]
      },
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Django 5 Backend & Computer Vision Logic",
        primaryLanguage: "Python / JS",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Constructed Django 5 REST Framework backend with comprehensive agricultural database",
          "Authored automated database seeding script (seed_database.py) with regional crop schemas",
          "Dockerized backend deployment architecture configured for Vercel and cloud hosting"
        ]
      },
      {
        repoName: "KishanHP1808/ML-project",
        repoUrl: "https://github.com/KishanHP1808/ML-project",
        roleOrUsage: "Machine Learning Notebooks & Algorithm Evaluation",
        primaryLanguage: "Jupyter Notebook / Python",
        stars: 1,
        keyImplementations: [
          "Neural network modeling in Jupyter with loss visualization and accuracy benchmarks",
          "Telco customer churn prediction utilizing Scikit-learn Logistic Regression",
          "Decision tree classification and multi-variable house price regression analysis"
        ]
      }
    ]
  },
  {
    name: "Django & DRF",
    category: "Backend",
    level: "Proficient",
    highlight: "Django 5, Django REST Framework, SQLite ORM models, seed scripts, Docker deployments",
    gitWorks: [
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Backend Framework & REST Architecture",
        primaryLanguage: "Python / Django",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Engineered Django 5 REST Framework API endpoints for leaf disease diagnostic payloads",
          "Architected comprehensive crop database with regional Indian agricultural data",
          "Created modular manage.py configurations, requirements.txt, and vercel.json deployment"
        ]
      }
    ]
  },
  {
    name: "FastAPI",
    category: "Backend",
    level: "Advanced",
    highlight: "Asynchronous ASGI API architecture, Pydantic validation, streaming responses, and LangChain integration",
    gitWorks: [
      {
        repoName: "KishanHP1808/Personal-Research-Assistant",
        repoUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant",
        roleOrUsage: "High-Performance Async API Gateway",
        primaryLanguage: "Python / FastAPI",
        stars: 1,
        liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
        keyImplementations: [
          "Designed sub-second asynchronous endpoints streaming AI research tokens directly to client",
          "Implemented strict Pydantic schemas validating multi-document research queries",
          "Orchestrated background research workers and automated report compilation tasks"
        ]
      }
    ]
  },
  {
    name: "Machine Learning",
    category: "AI & ML",
    level: "Advanced",
    highlight: "Neural network models, decision trees, logistic regression, predictive data pipelines & evaluation",
    gitWorks: [
      {
        repoName: "KishanHP1808/ML-project",
        repoUrl: "https://github.com/KishanHP1808/ML-project",
        roleOrUsage: "Model Engineering & Predictive Analysis",
        primaryLanguage: "Jupyter Notebook",
        stars: 1,
        keyImplementations: [
          "Trained multi-layer Neural Network Model (Neural_network_Model.ipynb) for feature classification",
          "Implemented Decision Tree algorithms on Iris Flower dataset with visual branch analysis",
          "Conducted end-to-end Logistic Regression on Telco churn data with confusion matrix evaluation",
          "Formulated predictive House Price Regression models with exploratory data analysis"
        ]
      },
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Computer Vision Pathology Diagnosis",
        primaryLanguage: "Python / AI",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "AI-driven leaf disease classification across commercial and industrial agricultural crops",
          "Predictive treatment protocol recommendations linked directly to detected symptoms"
        ]
      }
    ]
  },
  {
    name: "LangChain & Agents",
    category: "AI & ML",
    level: "Advanced",
    highlight: "Autonomous multi-agent workflows, tool execution, Tavily web search integration & literature synthesis",
    gitWorks: [
      {
        repoName: "KishanHP1808/Personal-Research-Assistant",
        repoUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant",
        roleOrUsage: "Autonomous Agent Orchestration",
        primaryLanguage: "Python",
        stars: 1,
        liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
        keyImplementations: [
          "Constructed autonomous research agents delegating query decomposition and web scraping",
          "Integrated Tavily Search API for targeted factual web retrieval and verification",
          "Chained multi-prompt synthesis steps into publication-ready executive technical briefs"
        ]
      }
    ]
  },
  {
    name: "JavaScript",
    category: "Frontend",
    level: "Mastery",
    highlight: "350K+ lines of real-time client code, WebSocket sync, DOM performance & sound engines",
    gitWorks: [
      {
        repoName: "KishanHP1808/football-auction",
        repoUrl: "https://github.com/KishanHP1808/football-auction",
        roleOrUsage: "Real-Time Interactive Bidding Engine",
        primaryLanguage: "JavaScript",
        stars: 2,
        liveUrl: "https://football-auction-three.vercel.app/",
        keyImplementations: [
          "Authored 350K+ lines of responsive client logic and player parsing algorithms",
          "Implemented dynamic countdown timers, sound fx triggers, and multi-team roster state",
          "Created custom World Cup 2026 player data parser (parse_players.js, wc2026_players.js)"
        ]
      },
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Interactive Client & PWA Logic",
        primaryLanguage: "JavaScript",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Implemented client-side camera streaming, image upload drag-and-drop, and PWA service worker (sw.js)",
          "Interactive diagnostic charting and symptom inspection views"
        ]
      }
    ]
  },
  {
    name: "Node.js & WebSockets",
    category: "Backend",
    level: "Advanced",
    highlight: "Real-time socket synchronization, concurrent bidding locks, room state arbitration & timers",
    gitWorks: [
      {
        repoName: "KishanHP1808/football-auction",
        repoUrl: "https://github.com/KishanHP1808/football-auction",
        roleOrUsage: "Live Multiplayer Auction Server",
        primaryLanguage: "JavaScript / Node.js",
        stars: 2,
        liveUrl: "https://football-auction-three.vercel.app/",
        keyImplementations: [
          "Engineered Node.js server.js synchronizing real-time auction bidding across multiple connected clients",
          "Managed atomic bid submission locks preventing race conditions during final countdown seconds",
          "Automated purse deduction and roster validation broadcasts across connected team rooms"
        ]
      }
    ]
  },
  {
    name: "React",
    category: "Frontend",
    level: "Mastery",
    highlight: "React 18/19, concurrent features, custom hooks, memoization & state management",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Component Architecture & Kinetic Interfaces",
        primaryLanguage: "TypeScript / React",
        stars: 1,
        keyImplementations: [
          "Engineered bespoke reactive design system with GPU-accelerated motion and spatial layouts",
          "Optimized state selectors, sub-frame animation performance, and mobile touch targets"
        ]
      }
    ]
  },
  {
    name: "TypeScript",
    category: "Frontend",
    level: "Advanced",
    highlight: "Strict type safety, generics, discriminated unions, maintainable interfaces",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Type System Architecture",
        primaryLanguage: "TypeScript",
        stars: 1,
        keyImplementations: [
          "Defined strict interfaces, discriminated union types, and modular data contracts",
          "Zero runtime type regressions with complete end-to-end linting verification"
        ]
      }
    ]
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: "Expert",
    highlight: "Custom design systems, arbitrary values, dark-mode choreography, micro-utility design",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Editorial Utility Styling",
        primaryLanguage: "CSS / Tailwind",
        stars: 1,
        keyImplementations: [
          "Crafted high-contrast dark-mode editorial aesthetics with mathematical spacing scales",
          "Custom glow animations, kinetic marquee banners, and fluid responsive grid viewports"
        ]
      }
    ]
  },
  {
    name: "HTML5 & CSS3",
    category: "Frontend",
    level: "Expert",
    highlight: "Semantic structure, responsive layouts, custom stylesheets, canvas rendering & dark theme aesthetics",
    gitWorks: [
      {
        repoName: "KishanHP1808/football-auction",
        repoUrl: "https://github.com/KishanHP1808/football-auction",
        roleOrUsage: "Stadium Theme & Sound Responsive Styling",
        primaryLanguage: "HTML / CSS",
        stars: 2,
        liveUrl: "https://football-auction-three.vercel.app/",
        keyImplementations: [
          "Authored 38K+ lines of custom CSS establishing high-contrast neon stadium lighting",
          "Responsive player card grid layouts and audio feedback visualizers"
        ]
      },
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Agricultural Dashboard UI & PWA Templates",
        primaryLanguage: "HTML / CSS",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Engineered 190K+ lines of custom CSS and semantic HTML templates for field inspections",
          "Full mobile-friendly touch responsiveness designed for outdoor sunlight legibility"
        ]
      }
    ]
  },
  {
    name: "C++",
    category: "Tools & Architecture",
    level: "Advanced",
    highlight: "Algorithmic problem solving, data structures, competitive programming & optimization",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Core Algorithms & Computational Foundations",
        primaryLanguage: "C++",
        stars: 1,
        keyImplementations: [
          "Featured core programming language on GitHub profile tech stack",
          "Implemented complex data structures, graph traversals, and dynamic programming algorithms",
          "Rigorous asymptotic time and space complexity optimizations"
        ]
      }
    ]
  },
  {
    name: "C",
    category: "Tools & Architecture",
    level: "Proficient",
    highlight: "Low-level memory management, pointer arithmetic, system calls, and embedded programming",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Systems & Memory Programming",
        primaryLanguage: "C",
        stars: 1,
        keyImplementations: [
          "Featured core systems language on GitHub profile tech stack",
          "Manual heap memory allocation, bitwise manipulations, and pointer arithmetic",
          "Systems programming fundamentals interfacing with OS architecture"
        ]
      }
    ]
  },
  {
    name: "Docker & DevOps",
    category: "Tools & Architecture",
    level: "Proficient",
    highlight: "Multi-stage container builds, Docker Compose, cloud environment isolation, Vercel & cloud CI/CD",
    gitWorks: [
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Containerization & Cloud Deploy",
        primaryLanguage: "Dockerfile / YAML",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Authored production Dockerfile and docker-compose.yml for reproducible Django builds",
          "Configured Vercel continuous deployment pipeline (vercel.json)"
        ]
      },
      {
        repoName: "KishanHP1808/Personal-Research-Assistant",
        repoUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant",
        roleOrUsage: "Microservice Container Runtime",
        primaryLanguage: "Dockerfile / YAML",
        stars: 1,
        liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
        keyImplementations: [
          "Configured optimized Python Docker container runtime with cached dependencies",
          "Deployed Vercel web service with environment isolation for LLM search credentials"
        ]
      }
    ]
  },
  {
    name: "Arduino & IoT",
    category: "Tools & Architecture",
    level: "Proficient",
    highlight: "Microcontroller C/C++ firmware, sensor interfacing, hardware prototyping & serial telemetry",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Hardware & Embedded Systems Experimentation",
        primaryLanguage: "C++ / Arduino",
        stars: 1,
        keyImplementations: [
          "Featured in GitHub bio: 'Experimenting with Arduino and hardware projects'",
          "Prototyped sensor-driven hardware loops interfacing microcontrollers with software dashboards",
          "Serial telemetry data acquisition and physical computing prototypes"
        ]
      }
    ]
  },
  {
    name: "Git & GitHub",
    category: "Tools & Architecture",
    level: "Advanced",
    highlight: "CI/CD pipelines, actions, contribution workflows, repository governance & code reviews",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808/KishanHP1808",
        roleOrUsage: "Automated Workflows & Profile Governance",
        primaryLanguage: "GitHub Actions / Markdown",
        stars: 1,
        keyImplementations: [
          "Engineered automated GitHub Actions snake contribution workflow generator",
          "Governed 9 public repositories with comprehensive README documentation and release tags",
          "Active GitHub activity maintaining consistent commit cadence and version history"
        ]
      }
    ]
  },
  {
    name: "REST APIs",
    category: "Backend",
    level: "Expert",
    highlight: "Clean RESTful contract design, rate-limiting, error schemas, caching & pagination",
    gitWorks: [
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Agricultural REST Endpoints",
        primaryLanguage: "Python / DRF",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Constructed modular REST endpoints for crop disease diagnosis and treatments",
          "Integrated database queries with serialized JSON response schemas"
        ]
      },
      {
        repoName: "KishanHP1808/Personal-Research-Assistant",
        repoUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant",
        roleOrUsage: "Async Search & Report Endpoints",
        primaryLanguage: "Python / FastAPI",
        stars: 1,
        liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
        keyImplementations: [
          "Streamed REST query routes with background task dispatching for automated report generation",
          "Robust HTTP error formatting and input sanitization"
        ]
      }
    ]
  },
  {
    name: "UI/UX Design",
    category: "Design",
    level: "Mastery",
    highlight: "User journey mapping, visual hierarchy, cognitive load reduction, design tokens",
    gitWorks: [
      {
        repoName: "KishanHP1808/football-auction",
        repoUrl: "https://github.com/KishanHP1808/football-auction",
        roleOrUsage: "Stadium Atmosphere UI/UX Design",
        primaryLanguage: "UI/UX & CSS",
        stars: 2,
        liveUrl: "https://football-auction-three.vercel.app/",
        keyImplementations: [
          "Designed high-adrenaline stadium auction experience with visual countdown tension",
          "Ergonomic budget displays and live roster chemistry metrics"
        ]
      },
      {
        repoName: "KishanHP1808/Personal-Research-Assistant",
        repoUrl: "https://github.com/KishanHP1808/Personal-Research-Assistant",
        roleOrUsage: "Distraction-Free Research UX",
        primaryLanguage: "UI/UX & HTML/CSS",
        stars: 1,
        liveUrl: "https://ai-assistant-orcin-alpha.vercel.app/",
        keyImplementations: [
          "Engineered cognitive-load minimizing academic reading layout",
          "Instant citation inspectability and exportable clean document formats"
        ]
      }
    ]
  },
  {
    name: "Figma",
    category: "Design",
    level: "Expert",
    highlight: "Design systems, auto-layout mastery, interactive prototyping & developer handoff",
    gitWorks: [
      {
        repoName: "KishanHP1808/KishanHP1808",
        repoUrl: "https://github.com/KishanHP1808",
        roleOrUsage: "Design Systems & High-Fidelity Prototyping",
        primaryLanguage: "Figma / Design Tokens",
        stars: 1,
        keyImplementations: [
          "Prototyped end-to-end design tokens, typography scales, and dark-mode color palettes",
          "Directly translated Figma layouts into responsive web applications with sub-frame fluidness"
        ]
      }
    ]
  },
  {
    name: "Responsive Web Design",
    category: "Design",
    level: "Mastery",
    highlight: "Fluid typographic scales, sub-pixel grid alignment, touch-first ergonomics",
    gitWorks: [
      {
        repoName: "KishanHP1808/crop-disease-detection",
        repoUrl: "https://github.com/KishanHP1808/crop-disease-detection",
        roleOrUsage: "Mobile-First Field Usability",
        primaryLanguage: "Responsive Design",
        stars: 1,
        liveUrl: "https://agri-guard-mocha.vercel.app/",
        keyImplementations: [
          "Engineered touch-first mobile layouts for field farmers under bright outdoor glare",
          "Adaptive cards, camera viewport scaling, and progressive web app responsive views"
        ]
      }
    ]
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    year: "2026",
    period: "PRESENT",
    role: "Full Stack & Advanced Frontend Developer",
    company: "Creative Digital Labs & Independent Projects",
    type: "Full Stack • Architecture",
    description: "Spearheading modern full-stack web applications, architecting responsive real-time client systems, and exploring high-fidelity motion choreography with GSAP and WebGL.",
    achievements: [
      "Engineered real-time data streaming architectures cutting latency to under 50ms",
      "Created scalable component libraries adopted across multi-platform client portals",
      "Pioneered cinematic dark-mode editorial visual standards for web applications"
    ],
    technologies: ["React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "GSAP"]
  },
  {
    year: "2025",
    period: "2024 – 2025",
    role: "UI/UX Designer & Web Developer",
    company: "Digital Product Initiatives",
    type: "UI/UX • Frontend Engineering",
    description: "Crafted bespoke user interfaces in Figma and translated high-fidelity prototypes into production-grade, responsive web applications with micro-interactions.",
    achievements: [
      "Designed full design systems including color tokens, typography scales, and modular cards",
      "Integrated Python/Django backends with dynamic WebSocket bidding arenas",
      "Optimized Core Web Vitals to consistent 95+ performance scores"
    ],
    technologies: ["Figma", "React", "Python", "Django", "Tailwind CSS", "REST APIs"]
  },
  {
    year: "2024",
    period: "2023 – 2024",
    role: "Frontend Developer & Creative Coder",
    company: "Academic & Open Source Endeavors",
    type: "Frontend • Interactive Labs",
    description: "Built foundational full-stack applications, computer vision measurement tools, and interactive canvas experiments rooted in mathematical precision.",
    achievements: [
      "Developed custom Canvas-based dimensional metrology tools for optical analysis",
      "Authored accessible open-source React components and layout utilities",
      "Conducted extensive research in typography systems and responsive ergonomics"
    ],
    technologies: ["JavaScript", "HTML5 Canvas", "CSS3", "Python", "Git", "REST APIs"]
  }
];

export const CERTIFICATES: Certificate[] = [
  {
    id: "meta-frontend",
    number: "01",
    title: "Meta Certified Front-End Developer Professional",
    issuer: "Meta (Facebook Technologies)",
    issueDate: "2025",
    credentialId: "META-FED-849201",
    credentialUrl: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    category: "Frontend & Architecture",
    skills: ["React", "JavaScript", "Next.js", "UI Engineering", "UX Principles", "Web Performance"],
    description: "Comprehensive industry accreditation certifying expertise in client-side architecture, React state engines, accessible UI patterns, and cross-platform web optimization.",
    badge: "HONORS VERIFIED"
  },
  {
    id: "google-ux",
    number: "02",
    title: "Google UX Design Professional Specialization",
    issuer: "Google Career Certificates",
    issueDate: "2025",
    credentialId: "GGL-UXD-319504",
    credentialUrl: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    category: "UI/UX & Design Systems",
    skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Interaction Design", "Usability Testing"],
    description: "Professional certification validating human-centered interface design, empathetic UX research, rapid high-fidelity prototyping, and design system governance in Figma.",
    badge: "INDUSTRY STANDARD"
  },
  {
    id: "fullstack-render",
    number: "03",
    title: "Full Stack Web Engineering & Cloud Deployment",
    issuer: "HackerRank & freeCodeCamp",
    issueDate: "2025",
    credentialId: "HCKR-FS-910482",
    credentialUrl: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    category: "Full Stack & Cloud",
    skills: ["Node.js", "Python / Django", "REST APIs", "PostgreSQL", "WebSocket", "Vercel & Cloud Infrastructure"],
    description: "Rigorous verification of full-stack system design, database modeling, secure JWT authentication, real-time WebSocket communication, and CI/CD deployment pipelines.",
    badge: "GOLD BADGE"
  },
  {
    id: "deeplearning-ai",
    number: "04",
    title: "Machine Learning & Neural Architectures Specialization",
    issuer: "DeepLearning.AI / Coursera",
    issueDate: "2024",
    credentialId: "DLAI-ML-772390",
    credentialUrl: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    category: "AI & Machine Learning",
    skills: ["Python", "Computer Vision", "TensorFlow / PyTorch", "Model Quantization", "NLP / Vector Retrieval"],
    description: "Specialized accreditation in foundational neural networks, computer vision classification algorithms (applied directly in AgriGuard), and prompt/retrieval pipelines.",
    badge: "DISTINCTION"
  },
  {
    id: "typescript-react",
    number: "05",
    title: "Advanced TypeScript & React Concurrent Patterns",
    issuer: "Frontend Masters",
    issueDate: "2024",
    credentialId: "FM-ATSR-502194",
    credentialUrl: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    category: "Frontend & Architecture",
    skills: ["TypeScript Generics", "React 18/19", "Concurrent Mode", "Memoization", "Custom Hooks", "AST & Tooling"],
    description: "Mastery credentials in enterprise-scale TypeScript static analysis, polymorphic React component typings, memory profiling, and high-framerate motion choreography.",
    badge: "MASTER LEVEL"
  },
  {
    id: "aws-cloud",
    number: "06",
    title: "AWS Certified Cloud Systems & Solutions Practitioner",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "2024",
    credentialId: "AWS-CCP-148892",
    credentialUrl: "https://www.linkedin.com/in/kishan-h-p-9766063b3",
    category: "Cloud & Infrastructure",
    skills: ["AWS S3", "EC2", "Lambda Serverless", "CloudFront CDN", "IAM Security", "Scalability Architectures"],
    description: "Cloud infrastructure credential validating secure multi-tier web application architecture, edge caching, serverless event-driven processing, and cloud cost governance.",
    badge: "OFFICIAL ACCREDITED"
  }
];
