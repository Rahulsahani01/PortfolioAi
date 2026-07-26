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
      let imageSrc = `/${folder}.png`; // fallback
      let description = `A beautiful template for your next big project.`;
      let tags = ['Portfolio'];

      // specific mapping for devPortfolio
      if (folder === 'devPortfolio') {
        title = 'Modern Developer';
        imageSrc = '/template-modern-dev.png';
        description = 'A robust, high-performance layout designed for software engineers and technical leads.';
        tags = ['Development', 'Top Rated'];
      } else if (folder === 'Queenfolio') {
        title = 'Creative Designer';
        imageSrc = '/template-creative-designer.png';
        description = 'Dynamic grids and bold typography for UI/UX designers and art directors.';
        tags = ['Design', 'Creative'];
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
