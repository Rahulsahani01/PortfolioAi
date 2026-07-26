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
  profilePhoto?: string;
  contact?: {
    email: string;
    phone?: string;
    location?: string;
  };
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolioUrl?: string;
    leetcode?: string;
    hackerrank?: string;
  };
  resumeUrl?: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration?: string;
    description: string;
    technologies?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    duration?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
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
  name: "John Doe",
  title: "Professional Title",
  summary: "A brief professional summary highlighting your key skills, experience, and what you are looking for in your next role.",
  profilePhoto: "",
  contact: {
    email: "email@example.com",
    phone: "+1 234 567 8900",
    location: "City, Country",
  },
  social: {
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    twitter: "https://twitter.com/username",
    portfolioUrl: "https://yourwebsite.com",
  },
  resumeUrl: "https://link-to-your-resume.pdf",
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  experience: [
    {
      company: "Company Name",
      role: "Job Title",
      description: "Describe your responsibilities, key achievements, and the impact you had in this role.",
      technologies: ["Tech 1", "Tech 2"],
    }
  ],
  education: [
    {
      institution: "Institution Name",
      degree: "Degree Name",
      fieldOfStudy: "Field of Study",
    },
  ],
  projects: [
    {
      name: "Project Name",
      description: "A short description of the project, what it solves, and its core features.",
      techStack: ["Tech 1", "Tech 2"],
      liveUrl: "https://project-demo.com",
      githubUrl: "https://github.com/username/project",
    }
  ],
};
