const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'resumetemplateCollection');
const apiRoutePath = path.join(__dirname, 'src', 'app', 'api', 'templates', 'route.ts');

const templates = [
  // Engineering (6)
  { id: 'FullStackDev', title: 'Full Stack Engineer', bg: 'bg-white', text: 'text-gray-900', font: 'Inter', header: 'bg-indigo-600 text-white', accent: 'text-indigo-600', card: 'border-gray-200 bg-white shadow-sm' },
  { id: 'FrontendWizard', title: 'Frontend Developer', bg: 'bg-[#fff4f4]', text: 'text-gray-800', font: 'Outfit', header: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white', accent: 'text-pink-600', card: 'border-pink-100 bg-white shadow-md rounded-2xl' },
  { id: 'BackendArchitect', title: 'Backend Architect', bg: 'bg-[#111111]', text: 'text-gray-300', font: 'Fira Code', header: 'bg-black border-b border-green-900', accent: 'text-green-500', card: 'border border-green-900/50 bg-[#0a0a0a]' },
  { id: 'MobileDev', title: 'Mobile App Developer', bg: 'bg-gray-50', text: 'text-gray-800', font: 'Roboto', header: 'bg-white shadow-sm border-b', accent: 'text-blue-500', card: 'border border-gray-100 bg-white rounded-3xl p-6 shadow-xl' },
  { id: 'DevSecOps', title: 'DevSecOps Engineer', bg: 'bg-zinc-950', text: 'text-zinc-300', font: 'JetBrains Mono', header: 'bg-zinc-900 border-b-2 border-red-900', accent: 'text-red-500', card: 'border border-zinc-800 bg-zinc-900/50' },
  { id: 'DataEngineer', title: 'Data Engineer', bg: 'bg-slate-50', text: 'text-slate-800', font: 'Source Sans Pro', header: 'bg-slate-800 text-white', accent: 'text-sky-600', card: 'border border-slate-200 bg-white shadow-sm rounded-none' },

  // Design (5)
  { id: 'UIUXDesigner', title: 'UI/UX Researcher', bg: 'bg-[#faf9f6]', text: 'text-stone-800', font: 'Lora', header: 'bg-[#f0ece1] text-stone-900', accent: 'text-amber-700', card: 'border border-stone-200 bg-white rounded-xl' },
  { id: 'ProductDesigner', title: 'Product Designer', bg: 'bg-white', text: 'text-black', font: 'Epilogue', header: 'bg-white border-b-4 border-black text-black', accent: 'text-black font-bold', card: 'border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' },
  { id: 'BrandStrategist', title: 'Brand Strategist', bg: 'bg-[#f4f4f4]', text: 'text-gray-900', font: 'Playfair Display', header: 'bg-gray-900 text-white', accent: 'text-gray-600', card: 'border border-gray-300 bg-white' },
  { id: 'WebDesigner', title: 'Web Designer', bg: 'bg-blue-50', text: 'text-blue-900', font: 'Syne', header: 'bg-blue-600 text-white rounded-b-3xl', accent: 'text-blue-600', card: 'border-none bg-white shadow-lg rounded-3xl' },
  { id: 'CreativeDirector', title: 'Creative Director', bg: 'bg-black', text: 'text-white', font: 'Helvetica', header: 'bg-black border-b border-white/20', accent: 'text-gray-400', card: 'border border-white/10 bg-black' },

  // Product & Strategy (5)
  { id: 'ProductManager', title: 'Product Manager', bg: 'bg-gray-50', text: 'text-gray-800', font: 'Inter', header: 'bg-teal-700 text-white', accent: 'text-teal-600', card: 'border border-gray-200 bg-white rounded-lg shadow-sm' },
  { id: 'ScrumMaster', title: 'Scrum Master', bg: 'bg-slate-100', text: 'text-slate-800', font: 'Roboto', header: 'bg-slate-300 text-slate-900', accent: 'text-slate-700', card: 'border border-slate-300 bg-white shadow-md' },
  { id: 'GrowthHacker', title: 'Growth Hacker', bg: 'bg-[#0f172a]', text: 'text-slate-300', font: 'Outfit', header: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white', accent: 'text-emerald-400', card: 'border border-slate-800 bg-slate-900/80 shadow-2xl' },
  { id: 'TechFounder', title: 'Tech Founder', bg: 'bg-black', text: 'text-zinc-400', font: 'Plus Jakarta Sans', header: 'bg-transparent border-b border-zinc-800 text-white', accent: 'text-purple-500', card: 'border border-zinc-800 bg-zinc-950 rounded-2xl' },
  { id: 'StartupBDE', title: 'Startup BDE', bg: 'bg-sky-50', text: 'text-sky-950', font: 'Inter', header: 'bg-sky-900 text-white', accent: 'text-sky-600', card: 'border border-sky-100 bg-white rounded-xl shadow-sm' },

  // Specialized Tech (4)
  { id: 'AIMLEngineer', title: 'AI/ML Engineer', bg: 'bg-[#050505]', text: 'text-gray-400', font: 'Space Mono', header: 'bg-[#0a0a0a] text-emerald-400 border-b border-emerald-900/30', accent: 'text-emerald-500', card: 'border border-emerald-900/20 bg-[#0a0a0a]' },
  { id: 'CloudArchitect', title: 'Cloud Architect', bg: 'bg-[#f0f9ff]', text: 'text-sky-900', font: 'Inter', header: 'bg-white shadow-sm border-b text-sky-900', accent: 'text-sky-600', card: 'border border-sky-100 bg-white shadow-lg rounded-xl' },
  { id: 'QAEngineer', title: 'QA Automation Engineer', bg: 'bg-white', text: 'text-gray-700', font: 'Roboto Mono', header: 'bg-emerald-600 text-white', accent: 'text-emerald-600', card: 'border-l-4 border-emerald-500 bg-gray-50 p-4' },
  { id: 'BlockchainDev', title: 'Web3 Developer', bg: 'bg-[#0a0a0a]', text: 'text-purple-200', font: 'Outfit', header: 'bg-[#050505] border-b border-fuchsia-900 text-fuchsia-400', accent: 'text-cyan-400', card: 'border border-fuchsia-900/50 bg-[#111] rounded-2xl shadow-[0_0_15px_rgba(217,70,239,0.1)]' },
];

if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Write the template directories
templates.forEach(t => {
  const tDir = path.join(templatesDir, t.id);
  if (!fs.existsSync(tDir)) fs.mkdirSync(tDir);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>{{name}} | ${t.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=${t.font.replace(/ /g, '+')}:wght@300;400;500;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: '${t.font}', sans-serif; }
  </style>
  <link rel="stylesheet" href="style.css">
</head>
<body class="${t.bg} ${t.text}">
  
  <header class="${t.header} py-20 px-8 text-center relative overflow-hidden">
    <div class="max-w-4xl mx-auto relative z-10">
      {{#if profilePhoto}}
      <img src="{{profilePhoto}}" alt="{{name}}" class="w-32 h-32 mx-auto rounded-full mb-6 border-4 border-white/20 object-cover shadow-xl">
      {{/if}}
      <h1 class="text-5xl font-extrabold tracking-tight mb-4">{{name}}</h1>
      <p class="text-2xl font-semibold opacity-90 mb-8">{{title}}</p>
      <p class="max-w-2xl mx-auto text-lg leading-relaxed opacity-80">{{summary}}</p>
      
      <div class="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium opacity-80">
        {{#if contact.email}}<span>{{contact.email}}</span>{{/if}}
        {{#if contact.location}}<span>{{contact.location}}</span>{{/if}}
      </div>
    </div>
  </header>
  
  <main class="max-w-5xl mx-auto px-6 py-20 space-y-24">
    
    {{#if experience.length}}
    <section>
      <h2 class="text-3xl font-bold mb-10 ${t.accent} uppercase tracking-wider text-center">Experience</h2>
      <div class="space-y-8">
        {{#each experience}}
        <div class="p-8 ${t.card}">
          <div class="flex flex-col md:flex-row justify-between mb-4">
            <h3 class="text-xl font-bold">{{this.role}}</h3>
            <span class="font-semibold opacity-70">{{this.duration}}</span>
          </div>
          <p class="${t.accent} font-bold mb-4">{{this.company}}</p>
          <p class="opacity-80 leading-relaxed">{{this.description}}</p>
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    {{#if projects.length}}
    <section>
      <h2 class="text-3xl font-bold mb-10 ${t.accent} uppercase tracking-wider text-center">Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {{#each projects}}
        <div class="p-8 ${t.card} flex flex-col">
          <h3 class="text-xl font-bold mb-3">{{this.title}}</h3>
          <p class="opacity-80 leading-relaxed mb-6 flex-grow">{{this.description}}</p>
          {{#if this.technologies}}
          <div class="flex flex-wrap gap-2 mt-4">
            {{#each this.technologies}}
            <span class="text-xs font-semibold bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full">{{this}}</span>
            {{/each}}
          </div>
          {{/if}}
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      {{#if skills.length}}
      <section>
        <h2 class="text-2xl font-bold mb-8 ${t.accent} uppercase tracking-wider">Skills</h2>
        <div class="flex flex-wrap gap-3">
          {{#each skills}}
          <span class="px-4 py-2 ${t.card} font-medium text-sm">{{this}}</span>
          {{/each}}
        </div>
      </section>
      {{/if}}

      {{#if education.length}}
      <section>
        <h2 class="text-2xl font-bold mb-8 ${t.accent} uppercase tracking-wider">Education</h2>
        <div class="space-y-6">
          {{#each education}}
          <div class="p-6 ${t.card}">
            <h3 class="font-bold text-lg mb-1">{{this.degree}}</h3>
            <p class="opacity-80 mb-2">{{this.institution}}</p>
            <p class="text-sm font-semibold opacity-60">{{this.duration}}</p>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
    </div>
  </main>
  
  <footer class="py-12 text-center opacity-50 text-sm font-medium border-t border-black/10 dark:border-white/10">
    <p>&copy; {{name}} - ${t.title}</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(tDir, 'index.html'), html);
  fs.writeFileSync(path.join(tDir, 'style.css'), '/* Custom CSS */\n');
  fs.writeFileSync(path.join(tDir, 'script.js'), '// Custom JS\n');
  
  const dummyDataPath = path.join(templatesDir, 'devPortfolio', 'data.json');
  if (fs.existsSync(dummyDataPath)) {
    fs.copyFileSync(dummyDataPath, path.join(tDir, 'data.json'));
  }
});

console.log('Successfully generated 20 templates.');

// Update route.ts mapping
if (fs.existsSync(apiRoutePath)) {
  let routeContent = fs.readFileSync(apiRoutePath, 'utf-8');
  
  // Find where the mapping block ends to inject ours or we can just replace the whole mapping logic.
  // We'll replace the block that starts with `// specific mapping for devPortfolio` up to the `return {` line.
  
  let newMapping = `// dynamic mapping\n`;
  newMapping += `      const configMap: Record<string, { title: string, imageSrc: string, description: string, tags: string[] }> = {\n`;
  
  // Add original ones
  newMapping += `        'devPortfolio': { title: 'Modern Developer', imageSrc: '/template-modern-dev.png', description: 'A robust, high-performance layout designed for software engineers.', tags: ['Development', 'Top Rated'] },\n`;
  newMapping += `        'Queenfolio': { title: 'Creative Designer', imageSrc: '/template-creative-designer.png', description: 'Dynamic grids and bold typography for designers.', tags: ['Design', 'Creative'] },\n`;
  newMapping += `        'MinimalWriter': { title: 'Minimal Writer', imageSrc: '/template-minimal.png', description: 'Elegant serif typography.', tags: ['Writing', 'Minimal'] },\n`;
  newMapping += `        'StudentGrad': { title: 'Student Graduate', imageSrc: '/template-student.png', description: 'Structured, academic-focused layout.', tags: ['Student', 'Academic'] },\n`;
  newMapping += `        'DataPro': { title: 'Data Professional', imageSrc: '/template-modern-dev.png', description: 'Dark mode Jupyter-style aesthetic.', tags: ['Data', 'Dark Mode'] },\n`;
  newMapping += `        'MarketingPro': { title: 'Marketing Specialist', imageSrc: '/template-creative-designer.png', description: 'Bright, high-energy layout.', tags: ['Marketing', 'Colorful'] },\n`;
  newMapping += `        'ExecLeader': { title: 'Corporate Executive', imageSrc: '/template-minimal.png', description: 'Formal, timeline-based layout.', tags: ['Executive', 'Corporate'] },\n`;
  newMapping += `        'CreativeGrid': { title: 'Creative Artist', imageSrc: '/template-creative-designer.png', description: 'Masonry-style layout for visual projects.', tags: ['Art', 'Design'] },\n`;
  newMapping += `        'Freelancer': { title: 'Independent Consultant', imageSrc: '/template-modern-dev.png', description: 'Trustworthy design highlighting services.', tags: ['Freelance', 'Consulting'] },\n`;
  newMapping += `        'Founder': { title: 'Startup Founder', imageSrc: '/template-modern-dev.png', description: 'Sleek dark mode with neon accents.', tags: ['Startup', 'Dark Mode'] },\n`;
  
  // Add new 20
  templates.forEach(t => {
    newMapping += `        '${t.id}': { title: '${t.title}', imageSrc: '/template-modern-dev.png', description: 'Professional layout for ${t.title}.', tags: ['IT', 'Tech'] },\n`;
  });
  
  newMapping += `      };\n\n`;
  newMapping += `      if (configMap[folder]) {\n`;
  newMapping += `        title = configMap[folder].title;\n`;
  newMapping += `        imageSrc = configMap[folder].imageSrc;\n`;
  newMapping += `        description = configMap[folder].description;\n`;
  newMapping += `        tags = configMap[folder].tags;\n`;
  newMapping += `      }\n`;
  
  // Replace the old if-else chain
  const regex = /\/\/ specific mapping for devPortfolio[\s\S]*?(?=return \{)/;
  routeContent = routeContent.replace(regex, newMapping + '\n      ');
  
  fs.writeFileSync(apiRoutePath, routeContent);
  console.log('Successfully updated API route.ts mapping.');
}
