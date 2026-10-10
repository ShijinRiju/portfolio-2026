import { audio } from './audio.js';

export const projectsData = [
  {
    id: 'innercraft',
    title: 'Innercraft Web App',
    tagline: 'Full-stack printing e-commerce platform with browser-based interactive product customization.',
    client: 'Innercraft / Citymapia Pvt Ltd',
    role: 'Main Developer — Full Stack',
    year: '2024 — Present',
    awards: 'Production Release · Full Microservices Architecture',
    image: '/assets/images/innercraft.png',
    metricPrimary: 'Full Stack',
    metricLabel: 'Browser-based canvas customization engine',
    metricSecondary: 'Microservices',
    metricSecondaryLabel: 'PostgreSQL, MongoDB, RabbitMQ, Docker',
    overview: 'Innercraft is a commercial printing e-commerce ecosystem featuring an interactive browser-based product customizer, customer-facing storefront, and comprehensive administration portal. Built to handle complex print geometries, multi-layer artwork, and automated fulfillment workflows.',
    challenges: 'Allowing customers to upload, manipulate, vector-scale, and preview custom print designs directly in the browser while maintaining high performance and precise print-ready vector coordinates.',
    solution: 'Integrated Konva.js and Fabric.js for high-fidelity interactive 2D canvas manipulation. Engineered a scalable backend with .NET and REST microservices, RabbitMQ message brokers, Dockerized services, MinIO asset storage, and Traefik reverse proxy routing.',
    tech: ['React', '.NET', 'PostgreSQL', 'MongoDB', 'RabbitMQ', 'Docker', 'Konva.js', 'Fabric.js', 'MinIO', 'Traefik', 'Git CI/CD']
  },
  {
    id: 'mcp-orchestrator',
    title: 'MCP Orchestrator',
    tagline: 'Internal AI orchestration platform connecting multiple MCP clients and tools for voice and natural-language execution.',
    client: 'Internal AI Operations / Citymapia',
    role: 'Developer — Architecture & Implementation',
    year: '2024 — 2025',
    awards: 'Enterprise AI Innovation · Multi-Tool Protocol',
    image: '/assets/images/mcp-orchestrator.png',
    metricPrimary: 'FastMCP',
    metricLabel: 'Python AI orchestrator backend',
    metricSecondary: 'Multi-Model',
    metricSecondaryLabel: 'Claude, OpenAI, Gemini, ElevenLabs API',
    overview: 'An internal agentic architecture leveraging the Model Context Protocol (MCP) to turn natural-language and voice requests into automated enterprise workflows, database queries, and third-party service dispatches.',
    challenges: 'Unifying disparate APIs and enterprise database schemas into a standardized protocol that AI clients can safely discover, invoke, and chain with zero hallucinations.',
    solution: 'Engineered an asynchronous FastAPI + FastMCP service layer that manages tool registration, authentication, schema reflection, and multi-modal voice processing with ElevenLabs audio synthesis.',
    tech: ['Python', 'FastMCP', 'FastAPI', 'OpenAI API', 'Gemini API', 'ElevenLabs API', 'Claude', 'MCP Server']
  },
  {
    id: 'citymapia-worksuit',
    title: 'Citymapia WorkSuit',
    tagline: 'Enterprise employee management system interface with modular responsive components.',
    client: 'Citymapia Pvt Ltd',
    role: 'UI/UX & Frontend Developer',
    year: '2024',
    awards: 'Company-Wide Enterprise Tool',
    image: '/assets/images/citymapia-worksuit.png',
    metricPrimary: 'Modular UI',
    metricLabel: 'Reusable component library & screens',
    metricSecondary: '100% Responsive',
    metricSecondaryLabel: 'Optimized across desktop, tablet & mobile',
    overview: 'WorkSuit is Citymapia’s core internal management system covering staff scheduling, project attendance, role-based permissions, and payroll workflows.',
    challenges: 'Designing complex multi-role administrative screens that remain intuitive, uncluttered, and fast on all device form factors.',
    solution: 'Designed and built clean, human-centered UI patterns using modern HTML, CSS, JavaScript, and Bootstrap, ensuring high contrast, crisp typography, and seamless data tables.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'UI/UX Design', 'REST APIs']
  },
  {
    id: 'carbonmapia',
    title: 'Carbonmapia',
    tagline: 'Carbon emission monitoring and sustainability analytics web platform.',
    client: 'Citymapia GreenTech',
    role: 'UI/UX Developer',
    year: '2024',
    awards: 'GreenTech Initiative',
    image: '/assets/images/carbonmapia.png',
    metricPrimary: 'Real-Time',
    metricLabel: 'Emission analytics & tracking metrics',
    metricSecondary: 'Intuitive UX',
    metricSecondaryLabel: 'Interactive charts and reporting flows',
    overview: 'A digital platform engineered to calculate, track, and visualize organizational carbon emissions and environmental compliance data.',
    challenges: 'Structuring complex environmental metrics and audit data into actionable, visual dashboards that non-technical stakeholders can understand.',
    solution: 'Crafted the marketing website interface and application UI, combining minimalist clean charts with interactive reporting states and responsive card layouts.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Data Visualization', 'UI/UX']
  },
  {
    id: 'client-flagships',
    title: 'Client Web Flagships',
    tagline: 'Production web applications across healthcare, corporate, and organizational clients.',
    client: 'AllRise Health, AblyCare, Adencont, Access Corp',
    role: 'Frontend / UI Developer',
    year: '2024',
    awards: 'Multiple Client Launches',
    image: '/assets/images/client-websites.png',
    metricPrimary: '4+ Brands',
    metricLabel: 'Healthcare & corporate client platforms',
    metricSecondary: 'Fast Vitals',
    metricSecondaryLabel: 'Engineered for speed, accessibility & SEO',
    overview: 'Collaborated on end-to-end frontend interfaces for healthcare providers and organizational partners including AllRise Health, AblyCare, Adencont, and Access Corporation.',
    challenges: 'Balancing client-specific branding with rigorous performance standards, HIPAA/accessibility compliance, and responsive touchpoints.',
    solution: 'Built clean, maintainable frontend architectures with semantic HTML, modular styles, and optimized asset pipelines.',
    tech: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Frontend Tooling']
  }
];

export function initProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');
  const triggerBtns = document.querySelectorAll('[data-project-trigger]');

  let activeIndex = 0;

  function openProject(id) {
    const project = projectsData.find((p) => p.id === id);
    if (!project) return;

    activeIndex = projectsData.findIndex((p) => p.id === id);
    populateModal(project);

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    audio.playChime(520);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    audio.playClick();
  }

  function populateModal(p) {
    modal.querySelector('.modal-title').textContent = p.title;
    modal.querySelector('.modal-tagline').textContent = p.tagline;
    modal.querySelector('.modal-client').textContent = p.client;
    modal.querySelector('.modal-role').textContent = p.role;
    modal.querySelector('.modal-year').textContent = p.year;
    modal.querySelector('.modal-awards').textContent = p.awards;

    const img = modal.querySelector('.modal-image');
    if (img) {
      img.src = p.image;
      img.alt = p.title;
    }

    modal.querySelector('.modal-metric-primary').textContent = p.metricPrimary;
    modal.querySelector('.modal-metric-label').textContent = p.metricLabel;
    modal.querySelector('.modal-metric-secondary').textContent = p.metricSecondary;
    modal.querySelector('.modal-metric-secondary-label').textContent = p.metricSecondaryLabel;

    modal.querySelector('.modal-overview').textContent = p.overview;
    modal.querySelector('.modal-challenges').textContent = p.challenges;
    modal.querySelector('.modal-solution').textContent = p.solution;

    const techContainer = modal.querySelector('.modal-tech-pills');
    if (techContainer) {
      techContainer.innerHTML = p.tech
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');
    }
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-trigger');
      openProject(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  const prevBtn = modal.querySelector('.modal-nav-prev');
  const nextBtn = modal.querySelector('.modal-nav-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + projectsData.length) % projectsData.length;
      populateModal(projectsData[activeIndex]);
      audio.playClick();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % projectsData.length;
      populateModal(projectsData[activeIndex]);
      audio.playClick();
    });
  }
}
