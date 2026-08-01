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
  originalPrice?: string;
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
    id: "setup",
    icon: "flash_on",
    title: "Fast & Easy Setup",
    description: "Simply enter your details and let our platform instantly generate a stunning, professional structure for you.",
  },
  {
    id: "template",
    icon: "palette",
    title: "Pick a Template",
    description: "Select from a variety of beautifully designed, mobile-responsive templates tailored to your specific profession.",
  },
  {
    id: "publish",
    icon: "rocket_launch",
    title: "Publish Instantly",
    description: "Change templates and update your details on the fly. Your portfolio goes live instantly on our global CDN.",
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
    id: "pro-6mo",
    name: "Pro (6 Months)",
    price: "₹250",
    originalPrice: "₹499",
    period: "6 mo",
    features: [
      "Publish to Live URL",
      "Custom Subdomain (name.portfolioai.com)",
      "Premium Layout Templates",
      "SEO & Analytics Dashboard",
      "6 Months of Uninterrupted Access",
    ],
    ctaText: "Go Pro",
    isPopular: true,
  },
  {
    id: "pro-1yr",
    name: "Ultra (1 Year)",
    price: "₹499",
    originalPrice: "₹999",
    period: "year",
    features: [
      "Publish to Live URL",
      "Custom Subdomain (name.portfolioai.com)",
      "Premium Layout Templates",
      "SEO & Analytics Dashboard",
      "Priority Customer Support",
      "1 Year of Uninterrupted Access",
    ],
    ctaText: "Go Pro Now",
    isPopular: false,
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
