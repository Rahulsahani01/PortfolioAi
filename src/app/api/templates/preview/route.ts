import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { apiFetch } from '../../../../lib/api'; // But apiFetch uses fetch. We can just use standard fetch.

export async function POST(req: Request) {
  try {
    const { templateId, siteId, token } = await req.json();

    if (!templateId) {
      return NextResponse.json({ error: 'Missing templateId' }, { status: 400 });
    }

    const templateDir = path.join(process.cwd(), 'src/resumetemplateCollection', templateId);
    const htmlPath = path.join(templateDir, 'index.html');

    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Inject CSS
    const cssPath = path.join(templateDir, 'style.css');
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      htmlContent = htmlContent.replace('<link rel="stylesheet" href="style.css">', `<style>\n${cssContent}\n</style>`);
    }

    // Inject JS
    const jsPath = path.join(templateDir, 'script.js');
    if (fs.existsSync(jsPath)) {
      const jsContent = fs.readFileSync(jsPath, 'utf-8');
      htmlContent = htmlContent.replace('<script src="script.js"></script>', `<script>\n${jsContent}\n</script>`);
    }

    const template = Handlebars.compile(htmlContent);

    let dataToInject = {};

    if (siteId) {
      // Fetch user data from backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/sites?siteId=${siteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const siteData = await res.json();
        const site = siteData.sites && siteData.sites[0];
        if (site && site.siteDetail && site.siteDetail.parsedData) {
          dataToInject = site.siteDetail.parsedData;
        }
      }
    } else {
      // Load dummy data
      const dataPath = path.join(templateDir, 'data.json');
      if (fs.existsSync(dataPath)) {
        dataToInject = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }
    }

    const compiledHtml = template(dataToInject);
    
    // Inject a base tag so relative assets like style.css load correctly from the public or template path.
    // Wait, the template assets are currently in `src/resumetemplateCollection`, which is not served by Next.js statically by default.
    // For preview, we might need a way to serve those assets. We can replace `href="style.css"` with a dynamic API route or just assume it's bundled.
    // To keep it simple, we'll serve the compiled HTML. 

    return NextResponse.json({ html: compiledHtml });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
