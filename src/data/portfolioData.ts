export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  isPopular: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}

export const FEATURES: Feature[] = [
  {
    id: "upload",
    icon: "upload_file",
    title: "Upload Resume",
    description: "Drop your PDF or DOCX resume. Our parser extracts all your experience, skills, and projects in seconds.",
  },
  {
    id: "template",
    icon: "palette",
    title: "Pick a Template",
    description: "Choose from 4 beautifully designed, mobile-responsive layout templates optimized for conversion.",
  },
  {
    id: "publish",
    icon: "rocket_launch",
    title: "Publish Instantly",
    description: "Get a custom slug URL on our domain or connect your own custom domain. Hosted on a global fast CDN.",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Preview",
    price: "₹0",
    period: "forever",
    features: [
      "AI Resume Parsing",
      "Interactive Site Preview",
      "Standard Templates",
      "1 Saved Portfolio Draft",
    ],
    ctaText: "Get Started Free",
    isPopular: false,
  },
  {
    id: "pro",
    name: "Pro Publishing",
    price: "₹499",
    period: "month",
    features: [
      "Publish to Live URL",
      "Custom Subdomain (name.portfolioai.com)",
      "Connect Custom Domain",
      "Premium Layout Templates",
      "SEO & Analytics Dashboard",
      "Priority Customer Support",
    ],
    ctaText: "Go Pro Now",
    isPopular: true,
  },
];

export const TEMPLATES: Template[] = [
  {
    id: "modern-dev",
    name: "Modern Developer",
    category: "Developer",
    description: "Sleek, dark-mode inspired developer theme highlighting Git repos, tech stack tags, and timeline experience.",
    thumbnail: "/templates/modern-dev.png",
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    category: "Designer",
    description: "Visual grid layout template focused on project cards, high impact headings, and visual portfolios.",
    thumbnail: "/templates/creative-designer.png",
  },
  {
    id: "minimal",
    name: "Minimal Portfolio",
    category: "General",
    description: "A clean, high-legibility minimalist design with high-contrast typography and subtle borders.",
    thumbnail: "/templates/minimal.png",
  },
  {
    id: "student",
    name: "Student Portfolio",
    category: "Academic",
    description: "Highlights course works, internships, academic projects, and certifications in a modern card system.",
    thumbnail: "/templates/student.png",
  },
];

export const DUMMY_RESUME: ResumeData = {
  name: "Rahul Kumar",
  title: "Full Stack Engineer",
  summary: "Detail-oriented software developer with 3+ years of experience designing and deploying scalable web applications. Passionate about automated systems, clean interfaces, and cloud architectures.",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "CSS Modules", "Git"],
  experience: [
    {
      company: "TechCorp Solutions",
      role: "Software Engineer",
      duration: "2024 - Present",
      description: "Developed and maintained high-traffic web apps using Next.js. Reduced load times by 40% using advanced static rendering strategies.",
    },
    {
      company: "Innovate Labs",
      role: "Associate Frontend Developer",
      duration: "2023 - 2024",
      description: "Collaborated with design teams to build pixel-perfect UI component libraries. Integrated third-party REST APIs and GraphQL endpoints.",
    },
  ],
  education: [
    {
      institution: "State University of Technology",
      degree: "B.Tech in Computer Science",
      duration: "2019 - 2023",
    },
  ],
  projects: [
    {
      name: "PortfolioAI Builder",
      description: "An AI tool that generates full portfolio websites from a simple resume upload.",
      url: "https://portfolioai.com/demo",
    },
    {
      name: "TaskManager Dashboard",
      description: "A beautiful, Kanban-based productivity application built with TypeScript and drag-and-drop support.",
      url: "https://github.com/rahul/taskmanager",
    },
  ],
};
