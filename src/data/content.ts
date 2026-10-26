// All editable portfolio content lives here. Most of it comes from your resume (Sep 2026).

export const profile = {
  name: 'Hariharan',
  fullName: 'Hariharan Selvam',
  role: 'Full Stack Developer',
  email: 'hariiharanselvam@gmail.com',
  location: 'Coimbatore, India',
  github: 'https://github.com/Hariharan-ihub',
  linkedin: 'https://www.linkedin.com/in/your-handle', // TODO: the resume cuts the URL off, paste your full profile link
  /** Your hero photo at public/hero.jpg (a transparent PNG cut-out also works). If it is missing, the built-in cartoon is shown. */
  heroImage: '/hero.jpg',
  heroImageFallback: '/hero-cartoon.svg',
  /** Optional scroll-scrubbed frames. Generate with scripts/extract_frames.py. */
  heroFramesDir: '/hero-frames',
  heroFramesMobileDir: '/hero-frames-mobile',
  /** *word* renders as serif italic. */
  heroIntro: [
    'Hariharan here. I build *full-stack* products, *workflow automation* and *observability* platforms, with *GenAI and agents* where they genuinely help.',
    '2 years across React, Next.js, Node.js, TypeScript and MongoDB, now at SNS Square in Coimbatore.',
  ],
  roles: ['Full Stack Developer', 'MERN / Next.js Engineer', 'GenAI & Agentic AI Engineer', 'Observability Builder'],
  cvUrl: '/resume.pdf',
  /** Floating cards next to the photo. */
  badges: [
    { icon: '🏆', title: 'Databricks', sub: 'Certified GenAI Engineer' },
    { icon: '⚙️', title: '30+', sub: 'Integrations in the workflow builder' },
  ],
  heroLines: [
    'Hariharan.',
    'Building workflow, observability & AI-driven products.',
    'Expertise in Next.js, Node.js & Cloud.',
  ],
  certifications: [
    'Databricks Certified Generative AI Engineer Associate',
    'Agentic AI Course, Analytics Vidhya (RAG, LangChain, LangGraph, CrewAI, LangSmith)',
    'Anthropic: Claude Code in Action, Intro to MCP, Intro to Agent Skills',
  ],
}

export type Project = {
  title: string
  /** Short tagline shown on the card. */
  caption: string
  /** One or two lines shown inside the preview mock. */
  pitch: string
  /** Company and role, shown in the detail view. */
  org: string
  period: string
  /** Names must match entries in techKeys.ts (they drive the icon column). */
  tags: string[]
  /** Two colours for the card's left-to-right gradient. */
  gradient: [string, string]
  /** What you did, shown when the card is opened. */
  bullets: string[]
  link?: string
  /** Optional screenshot shown inside the device mock, e.g. '/projects/solution-builder.png'. */
  image?: string
}

export const projects: Project[] = [
  {
    title: 'Solution Builder',
    caption: 'No-code workflow automation',
    pitch: 'An n8n-style canvas that connects 30+ tools without backend code.',
    org: 'SNS Square Consultancy, Software Associate',
    period: 'Aug 2025 – Present',
    tags: ['Next.js', 'Node.js', 'TypeScript', 'AWS'],
    gradient: ['#d92b21', '#ff5a4f'],
    bullets: [
      'Developing an n8n-style visual workflow builder where users compose backend workflows by connecting 30+ tools and third-party integrations (Slack, Gmail, GitHub, Jira, AWS, Stripe) without writing backend code.',
      'Built on Next.js, Node.js and TypeScript, with AWS integrations.',
    ],
  },
  {
    title: 'Observability Platform',
    caption: 'Datadog-style monitoring',
    pitch: 'RUM, logs, error tracking and AI/LLM observability in one place.',
    org: 'SNS Square Consultancy, Software Associate',
    period: 'Aug 2025 – Present',
    tags: ['ClickHouse', 'Node.js', 'Docker', 'AWS'],
    gradient: ['#a31510', '#e5322d'],
    bullets: [
      'Engineered the monitoring module where users connect their own AWS credentials to track infrastructure and application health, metrics and alerts.',
      'Extended it into full-stack observability: frontend Real User Monitoring (RUM), centralized log monitoring, error tracking, and AI/LLM observability (token usage, cost and latency).',
      'Built ClickHouse-backed storage for high-volume logs and telemetry, and containerized the monitoring services with Docker for consistent deployment.',
    ],
  },
  {
    title: 'Milai',
    caption: 'AI-powered learning platform',
    pitch: 'Personalised roadmaps, a coding lab and an AI code evaluator.',
    org: 'SNS Square Consultancy, Software Associate',
    period: 'Aug 2025 – Present',
    tags: ['React', 'Node.js', 'MongoDB'],
    gradient: ['#26181a', '#e5322d'],
    bullets: [
      'Built AI-generated personalised learning roadmaps for learners targeting specific companies and job roles.',
      'Developed a LeetCode-style virtual coding lab with company-wise and role-wise practice problem sets.',
      'Engineered an in-house code compiler with an AI evaluation layer that compiles, executes and scores submitted code and returns feedback to learners.',
    ],
  },
  {
    title: 'HyreDragon',
    caption: 'AI hiring & proctored assessments',
    pitch: 'HireVue-style hiring with LLM-generated questions and reports.',
    org: 'SNS Square Consultancy, Junior Software Associate',
    period: 'Aug 2024 – Aug 2025',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    gradient: ['#ff5a4f', '#8f160f'],
    bullets: [
      'Built the job creation and interview-round configuration modules for a HireVue-style platform where HR teams hire candidates directly or through a public job marketplace.',
      'Implemented LLM-based generation of job descriptions, interview questions and candidate evaluation reports, reducing manual effort for recruiters.',
      'Designed a dynamic question-dataset generation system to keep assessment content fresh and role-relevant.',
    ],
  },
  {
    title: 'StartzyAI',
    caption: 'Startup idea validation',
    pitch: 'From concept to prototype with real stakeholder feedback.',
    org: 'SNS Square Consultancy, Junior Software Associate',
    period: 'Aug 2024 – Aug 2025',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    gradient: ['#3a1a1c', '#ff4a3d'],
    bullets: [
      'Built an idea-validation platform helping students and entrepreneurs validate use cases with real stakeholder feedback and move from concept to prototype.',
      'Developed the competitor analysis module with AI-driven auto-suggestion of relevant competitors.',
      'Built survey, customer segmentation, empathy map, SWOT analysis and Business Model Canvas modules powering user research and pitch-deck generation.',
    ],
  },
]

export type Service = {
  id: string
  title: string
  blurb: string
  /** One line of what this covers, shown on the card. */
  focus: string
  paragraphs: string[]
  hue: string
}

export const services: Service[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    blurb: 'MERN and Next.js products, end to end.',
    focus: 'Learning and hiring platforms, dashboards, REST APIs, real-time features.',
    paragraphs: [
      'I build web products with React or Next.js on the front end, Node.js, Express and TypeScript on the back end, and MongoDB underneath.',
      'That includes REST APIs, real-time features with Socket.IO, background jobs with Redis and BullMQ, and responsive, data-heavy dashboards.',
      'Two years of shipping across hiring, learning and startup tools means I am used to turning a loose idea into a working product.',
    ],
    hue: '#e5322d',
  },
  {
    id: 'workflow',
    title: 'Workflow Automation',
    blurb: 'Connect your tools without writing glue code.',
    focus: 'Visual workflow builders, third-party integrations, background job queues.',
    paragraphs: [
      'I am building an n8n-style visual workflow builder that connects 30+ tools and integrations, including Slack, Gmail, GitHub, Jira, AWS and Stripe.',
      'I can design the same kind of automation for your team: triggers, integrations, queues and the interface that lets non-developers use them.',
    ],
    hue: '#ff6a5e',
  },
  {
    id: 'observability',
    title: 'Observability & Monitoring',
    blurb: 'See how your apps and infra behave.',
    focus: 'RUM, centralized logs, error tracking, LLM token, cost and latency.',
    paragraphs: [
      'I work on a Datadog-style platform: infrastructure and application monitoring on AWS, frontend Real User Monitoring, centralized logs and error tracking.',
      'Telemetry lands in ClickHouse for fast queries on high volumes, and the services run in Docker for consistent deployment.',
      'I also cover AI and LLM observability: token usage, cost and latency.',
    ],
    hue: '#ff8f85',
  },
  {
    id: 'genai',
    title: 'GenAI & Agentic AI',
    blurb: 'LLM features that earn their place.',
    focus: 'Generated content, AI evaluation, RAG, agents and MCP integrations.',
    paragraphs: [
      'I integrate LLMs into real products: generated learning roadmaps, interview questions, evaluation reports and AI code evaluation.',
      'I am Databricks-certified in Generative AI and have worked through RAG, LangChain, LangGraph, CrewAI, LangSmith, AI agents and the Model Context Protocol.',
    ],
    hue: '#b81f19',
  },
]

/** How a project runs from first call to launch. */
export const process = [
  { title: 'Discover & Scope', text: 'Pin down the problem, the users and what "done" looks like before any code is written.' },
  { title: 'Design the System', text: 'Settle the data model, the API contracts and the integrations the product depends on.' },
  { title: 'Build & Test', text: 'Ship the full stack in small steps, with checks around the risky parts.' },
  { title: 'Deploy & Observe', text: 'Containerised releases with CI/CD, then logs and monitoring to keep improving it.' },
]

export const faq = [
  {
    q: 'What do you build?',
    a: 'Full-stack products on React / Next.js and Node.js, workflow automation, observability platforms and LLM-powered features.',
  },
  {
    q: 'Which stack do you work with?',
    a: 'JavaScript and TypeScript across React, Next.js, Node.js and Express, with MongoDB and ClickHouse for data, Redis and BullMQ for queues, and Socket.IO for real time.',
  },
  {
    q: 'Can you build the whole product, not just one part?',
    a: 'Yes. Front end, REST APIs, real-time features and the database, deployed with Docker, PM2 and Jenkins CI/CD, plus AWS integrations.',
  },
  {
    q: 'Do you work with AI?',
    a: 'Yes. LLM integration, RAG, prompt engineering, LangChain, LangGraph, CrewAI and the Model Context Protocol. I am Databricks-certified in Generative AI.',
  },
  {
    q: 'How do we get started?',
    a: 'Send a message through the contact form below with a short description of what you are building, and I will get back to you.',
  },
]
