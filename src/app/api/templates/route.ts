import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const collectionPath = path.join(process.cwd(), 'src/resumetemplateCollection');
    
    if (!fs.existsSync(collectionPath)) {
      return NextResponse.json({ templates: [] });
    }

    const folders = fs.readdirSync(collectionPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Basic mapping to create a Template object for the UI
    const templates = folders.map(folder => {
      let title = folder;
      let imageSrc = `/thumbnails/${folder}.png`;
      let description = `A beautiful template for your next big project.`;
      let tags = ['Portfolio'];

      // dynamic mapping
      const configMap: Record<string, { title: string, imageSrc: string, description: string, tags: string[] }> = {
        'devPortfolio': { title: 'Modern Developer', imageSrc: '/template-modern-dev.png', description: 'A robust, high-performance layout designed for software engineers.', tags: ['Development', 'Top Rated'] },
        'Queenfolio': { title: 'Creative Designer', imageSrc: '/template-creative-designer.png', description: 'Dynamic grids and bold typography for designers.', tags: ['Design', 'Creative'] },
        'MinimalWriter': { title: 'Minimal Writer', imageSrc: '/template-minimal.png', description: 'Elegant serif typography.', tags: ['Writing', 'Minimal'] },
        'StudentGrad': { title: 'Student Graduate', imageSrc: '/template-student.png', description: 'Structured, academic-focused layout.', tags: ['Student', 'Academic'] },
        'DataPro': { title: 'Data Professional', imageSrc: '/template-modern-dev.png', description: 'Dark mode Jupyter-style aesthetic.', tags: ['Data', 'Dark Mode'] },
        'MarketingPro': { title: 'Marketing Specialist', imageSrc: '/template-creative-designer.png', description: 'Bright, high-energy layout.', tags: ['Marketing', 'Colorful'] },
        'ExecLeader': { title: 'Corporate Executive', imageSrc: '/template-minimal.png', description: 'Formal, timeline-based layout.', tags: ['Executive', 'Corporate'] },
        'CreativeGrid': { title: 'Creative Artist', imageSrc: '/template-creative-designer.png', description: 'Masonry-style layout for visual projects.', tags: ['Art', 'Design'] },
        'Freelancer': { title: 'Independent Consultant', imageSrc: '/template-modern-dev.png', description: 'Trustworthy design highlighting services.', tags: ['Freelance', 'Consulting'] },
        'Founder': { title: 'Startup Founder', imageSrc: '/template-modern-dev.png', description: 'Sleek dark mode with neon accents.', tags: ['Startup', 'Dark Mode'] },
        'FullStackDev': { title: 'Full Stack Engineer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Full Stack Engineer.', tags: ['IT', 'Tech'] },
        'FrontendWizard': { title: 'Frontend Developer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Frontend Developer.', tags: ['IT', 'Tech'] },
        'BackendArchitect': { title: 'Backend Architect', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Backend Architect.', tags: ['IT', 'Tech'] },
        'MobileDev': { title: 'Mobile App Developer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Mobile App Developer.', tags: ['IT', 'Tech'] },
        'DevSecOps': { title: 'DevSecOps Engineer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for DevSecOps Engineer.', tags: ['IT', 'Tech'] },
        'DataEngineer': { title: 'Data Engineer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Data Engineer.', tags: ['IT', 'Tech'] },
        'UIUXDesigner': { title: 'UI/UX Researcher', imageSrc: '/template-modern-dev.png', description: 'Professional layout for UI/UX Researcher.', tags: ['IT', 'Tech'] },
        'ProductDesigner': { title: 'Product Designer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Product Designer.', tags: ['IT', 'Tech'] },
        'BrandStrategist': { title: 'Brand Strategist', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Brand Strategist.', tags: ['IT', 'Tech'] },
        'WebDesigner': { title: 'Web Designer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Web Designer.', tags: ['IT', 'Tech'] },
        'CreativeDirector': { title: 'Creative Director', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Creative Director.', tags: ['IT', 'Tech'] },
        'ProductManager': { title: 'Product Manager', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Product Manager.', tags: ['IT', 'Tech'] },
        'ScrumMaster': { title: 'Scrum Master', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Scrum Master.', tags: ['IT', 'Tech'] },
        'GrowthHacker': { title: 'Growth Hacker', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Growth Hacker.', tags: ['IT', 'Tech'] },
        'TechFounder': { title: 'Tech Founder', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Tech Founder.', tags: ['IT', 'Tech'] },
        'StartupBDE': { title: 'Startup BDE', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Startup BDE.', tags: ['IT', 'Tech'] },
        'AIMLEngineer': { title: 'AI/ML Engineer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for AI/ML Engineer.', tags: ['IT', 'Tech'] },
        'CloudArchitect': { title: 'Cloud Architect', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Cloud Architect.', tags: ['IT', 'Tech'] },
        'QAEngineer': { title: 'QA Automation Engineer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for QA Automation Engineer.', tags: ['IT', 'Tech'] },
        'BlockchainDev': { title: 'Web3 Developer', imageSrc: '/template-modern-dev.png', description: 'Professional layout for Web3 Developer.', tags: ['IT', 'Tech'] },
      };

      if (configMap[folder]) {
        title = configMap[folder].title;
        imageSrc = `/thumbnails/${folder}.png`;
        description = configMap[folder].description;
        tags = configMap[folder].tags;
      }

      return {
        id: folder,
        title,
        description,
        tags,
        imageSrc
      };
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error reading templates directory:', error);
    return NextResponse.json({ error: 'Failed to read templates' }, { status: 500 });
  }
}
