const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'resumetemplateCollection');

const templates = [
  // Engineering (6) - Mostly Terminal / Vibrant
  { id: 'FullStackDev', title: 'Full Stack Engineer', layout: 'terminal', bg: 'bg-[#0f172a]', text: 'text-slate-300', font: 'Fira Code', primary: 'text-sky-400', secondary: 'border-sky-500/30' },
  { id: 'FrontendWizard', title: 'Frontend Developer', layout: 'vibrant', bg: 'bg-[#faf5ff]', text: 'text-purple-950', font: 'Outfit', primary: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text', secondary: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl' },
  { id: 'BackendArchitect', title: 'Backend Architect', layout: 'terminal', bg: 'bg-black', text: 'text-green-500', font: 'JetBrains Mono', primary: 'text-green-400', secondary: 'border-green-800 bg-[#0a0a0a]' },
  { id: 'MobileDev', title: 'Mobile App Developer', layout: 'corporate', bg: 'bg-gray-50', text: 'text-gray-800', font: 'Inter', primary: 'bg-blue-600 text-white', secondary: 'bg-white border border-gray-200 rounded-2xl shadow-sm' },
  { id: 'DevSecOps', title: 'DevSecOps Engineer', layout: 'terminal', bg: 'bg-[#050505]', text: 'text-red-500', font: 'Space Mono', primary: 'text-red-400', secondary: 'border-red-900/50 bg-black' },
  { id: 'DataEngineer', title: 'Data Engineer', layout: 'corporate', bg: 'bg-slate-50', text: 'text-slate-700', font: 'Roboto', primary: 'bg-slate-800 text-white', secondary: 'bg-white border border-slate-200' },

  // Design (5) - Mostly Editorial / Vibrant
  { id: 'UIUXDesigner', title: 'UI/UX Researcher', layout: 'editorial', bg: 'bg-[#F9F7F1]', text: 'text-[#2C2A25]', font: 'Lora', primary: 'text-[#B45309]', secondary: 'border-b border-[#2C2A25]/10' },
  { id: 'ProductDesigner', title: 'Product Designer', layout: 'editorial', bg: 'bg-white', text: 'text-black', font: 'Epilogue', primary: 'text-black', secondary: 'border-2 border-black' },
  { id: 'BrandStrategist', title: 'Brand Strategist', layout: 'editorial', bg: 'bg-[#E5E5E5]', text: 'text-[#111]', font: 'Playfair Display', primary: 'text-[#111]', secondary: 'bg-[#F5F5F5] border border-[#CCC]' },
  { id: 'WebDesigner', title: 'Web Designer', layout: 'vibrant', bg: 'bg-blue-50', text: 'text-blue-900', font: 'Syne', primary: 'text-blue-600', secondary: 'bg-white shadow-xl rounded-[2rem]' },
  { id: 'CreativeDirector', title: 'Creative Director', layout: 'editorial', bg: 'bg-[#0a0a0a]', text: 'text-zinc-200', font: 'Helvetica', primary: 'text-white', secondary: 'border-t border-zinc-800' },

  // Product & Strategy (5) - Mostly Corporate / Editorial
  { id: 'ProductManager', title: 'Product Manager', layout: 'corporate', bg: 'bg-[#F8FAFC]', text: 'text-slate-800', font: 'Inter', primary: 'bg-teal-700 text-white', secondary: 'bg-white border border-slate-200 rounded-lg shadow-sm' },
  { id: 'ScrumMaster', title: 'Scrum Master', layout: 'corporate', bg: 'bg-white', text: 'text-gray-800', font: 'Roboto', primary: 'bg-indigo-600 text-white', secondary: 'bg-gray-50 border border-gray-100 rounded' },
  { id: 'GrowthHacker', title: 'Growth Hacker', layout: 'vibrant', bg: 'bg-[#0f172a]', text: 'text-slate-300', font: 'Outfit', primary: 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text', secondary: 'bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl' },
  { id: 'TechFounder', title: 'Tech Founder', layout: 'corporate', bg: 'bg-[#000000]', text: 'text-gray-300', font: 'Plus Jakarta Sans', primary: 'bg-purple-600 text-white', secondary: 'bg-[#111] border border-zinc-800 rounded-xl' },
  { id: 'StartupBDE', title: 'Startup BDE', layout: 'corporate', bg: 'bg-sky-50', text: 'text-sky-950', font: 'Inter', primary: 'bg-sky-800 text-white', secondary: 'bg-white border border-sky-100 rounded-xl shadow-sm' },

  // Specialized Tech (4) - Terminal / Corporate
  { id: 'AIMLEngineer', title: 'AI/ML Engineer', layout: 'terminal', bg: 'bg-[#050505]', text: 'text-gray-400', font: 'Space Mono', primary: 'text-emerald-400', secondary: 'border-emerald-900/30 bg-[#0a0a0a]' },
  { id: 'CloudArchitect', title: 'Cloud Architect', layout: 'corporate', bg: 'bg-[#f0f9ff]', text: 'text-sky-900', font: 'Inter', primary: 'bg-sky-700 text-white', secondary: 'bg-white border border-sky-100 shadow-md rounded-xl' },
  { id: 'QAEngineer', title: 'QA Automation Engineer', layout: 'corporate', bg: 'bg-white', text: 'text-gray-700', font: 'Roboto Mono', primary: 'bg-emerald-600 text-white', secondary: 'border-l-4 border-emerald-500 bg-gray-50' },
  { id: 'BlockchainDev', title: 'Web3 Developer', layout: 'terminal', bg: 'bg-[#0a0a0a]', text: 'text-purple-200', font: 'Outfit', primary: 'text-fuchsia-400', secondary: 'border-fuchsia-900/50 bg-[#111]' },
];

function generateTerminalLayout(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>{{name}} | ${t.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=${t.font.replace(/ /g, '+')}:wght@400;700&display=swap" rel="stylesheet">
  <style>body { font-family: '${t.font}', monospace; }</style>
  <link rel="stylesheet" href="style.css">
</head>
<body class="${t.bg} ${t.text} p-4 md:p-8">
  <div class="max-w-6xl mx-auto border ${t.secondary} rounded-lg overflow-hidden flex flex-col h-full min-h-[90vh]">
    <!-- Terminal Header -->
    <div class="bg-black/50 border-b ${t.secondary} px-4 py-2 flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-green-500"></div>
      <span class="ml-4 text-xs opacity-50">~/${t.title.toLowerCase().replace(/ /g, '_')} — bash</span>
    </div>
    
    <div class="p-6 md:p-10 flex-grow flex flex-col lg:flex-row gap-10">
      <!-- Left Sidebar (Profile) -->
      <aside class="lg:w-1/3 space-y-6">
        <div>
          <span class="${t.primary} font-bold text-xl">> whoami</span>
          <h1 class="text-4xl font-bold mt-2 text-white">{{name}}</h1>
          <p class="text-lg opacity-80 mt-1">${t.title}</p>
        </div>
        
        {{#if profilePhoto}}
        <img src="{{profilePhoto}}" alt="{{name}}" class="w-full max-w-[250px] border border-dashed ${t.secondary} p-1 grayscale hover:grayscale-0 transition duration-300">
        {{/if}}
        
        <div>
          <span class="${t.primary} font-bold">> cat bio.txt</span>
          <p class="mt-2 opacity-80 leading-relaxed text-sm">{{summary}}</p>
        </div>

        <div>
           <span class="${t.primary} font-bold">> contact_info</span>
           <ul class="mt-2 text-sm opacity-80 space-y-1">
             {{#if contact.email}}<li>Email: {{contact.email}}</li>{{/if}}
             {{#if contact.phone}}<li>Phone: {{contact.phone}}</li>{{/if}}
             {{#if contact.location}}<li>Location: {{contact.location}}</li>{{/if}}
           </ul>
        </div>
      </aside>

      <!-- Right Content (Data) -->
      <main class="lg:w-2/3 space-y-10">
        
        {{#if experience.length}}
        <section>
          <span class="${t.primary} font-bold text-xl">> ls -la ./experience</span>
          <div class="mt-4 space-y-6 border-l-2 ${t.secondary} pl-4">
            {{#each experience}}
            <div>
              <h3 class="text-white font-bold">{{this.role}} @ <span class="${t.primary}">{{this.company}}</span></h3>
              <p class="text-xs opacity-60 mb-2">[{{this.duration}}]</p>
              <p class="text-sm opacity-80">{{this.description}}</p>
            </div>
            {{/each}}
          </div>
        </section>
        {{/if}}

        {{#if projects.length}}
        <section>
          <span class="${t.primary} font-bold text-xl">> ./show_projects.sh</span>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {{#each projects}}
            <div class="border ${t.secondary} p-4 bg-black/20 hover:bg-black/40 transition">
              <h3 class="text-white font-bold">{{this.title}}</h3>
              <p class="text-sm opacity-70 mt-2 mb-4">{{this.description}}</p>
              {{#if this.technologies}}
              <div class="flex flex-wrap gap-2">
                {{#each this.technologies}}
                <span class="text-xs border ${t.secondary} px-2 py-1 opacity-80">{{this}}</span>
                {{/each}}
              </div>
              {{/if}}
            </div>
            {{/each}}
          </div>
        </section>
        {{/if}}

        {{#if skills.length}}
        <section>
           <span class="${t.primary} font-bold text-xl">> echo $SKILLS</span>
           <div class="mt-4 flex flex-wrap gap-2">
             {{#each skills}}
             <span class="text-sm bg-white/5 px-2 py-1 border ${t.secondary}">{{this}}</span>
             {{/each}}
           </div>
        </section>
        {{/if}}

      </main>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
}

function generateEditorialLayout(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>{{name}} | ${t.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=${t.font.replace(/ /g, '+')}:wght@300;400;600&display=swap" rel="stylesheet">
  <style>body { font-family: '${t.font}', serif; }</style>
  <link rel="stylesheet" href="style.css">
</head>
<body class="${t.bg} ${t.text} antialiased">
  
  <header class="max-w-5xl mx-auto px-6 pt-24 pb-12">
    <p class="text-sm tracking-widest uppercase mb-4 opacity-60">${t.title}</p>
    <h1 class="text-6xl md:text-8xl font-light tracking-tight leading-none mb-10 ${t.primary}">{{name}}</h1>
    
    <div class="flex flex-col md:flex-row gap-10 items-start">
      {{#if profilePhoto}}
      <img src="{{profilePhoto}}" alt="{{name}}" class="w-48 h-64 object-cover ${t.secondary}">
      {{/if}}
      <div class="max-w-xl">
        <p class="text-xl leading-relaxed opacity-80">{{summary}}</p>
        <div class="mt-8 flex gap-6 text-sm uppercase tracking-widest opacity-60">
          {{#if contact.email}}<span>{{contact.email}}</span>{{/if}}
          {{#if contact.location}}<span>{{contact.location}}</span>{{/if}}
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-12 space-y-32">
    
    {{#if experience.length}}
    <section>
      <h2 class="text-sm tracking-widest uppercase mb-12 opacity-50 ${t.secondary} pb-4">Selected Experience</h2>
      <div class="space-y-16">
        {{#each experience}}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-1">
            <p class="opacity-60 text-sm">{{this.duration}}</p>
          </div>
          <div class="md:col-span-3">
            <h3 class="text-2xl mb-2">{{this.role}}, <span class="italic">{{this.company}}</span></h3>
            <p class="opacity-80 leading-relaxed">{{this.description}}</p>
          </div>
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    {{#if projects.length}}
    <section>
      <h2 class="text-sm tracking-widest uppercase mb-12 opacity-50 ${t.secondary} pb-4">Featured Works</h2>
      <div class="space-y-20">
        {{#each projects}}
        <div>
          <h3 class="text-3xl mb-4">{{this.title}}</h3>
          <p class="text-lg opacity-80 leading-relaxed max-w-3xl mb-6">{{this.description}}</p>
          {{#if this.technologies}}
          <div class="flex gap-4 text-sm opacity-60 uppercase tracking-widest">
            {{#each this.technologies}}<span>{{this}}</span>{{/each}}
          </div>
          {{/if}}
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
      {{#if education.length}}
      <section>
        <h2 class="text-sm tracking-widest uppercase mb-8 opacity-50 ${t.secondary} pb-4">Education</h2>
        <div class="space-y-8">
          {{#each education}}
          <div>
            <h3 class="text-xl mb-1">{{this.degree}}</h3>
            <p class="opacity-70">{{this.institution}} &mdash; {{this.duration}}</p>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
      
      {{#if skills.length}}
      <section>
        <h2 class="text-sm tracking-widest uppercase mb-8 opacity-50 ${t.secondary} pb-4">Capabilities</h2>
        <ul class="space-y-2 opacity-80 text-lg">
          {{#each skills}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </section>
      {{/if}}
    </div>

  </main>
  
  <footer class="max-w-5xl mx-auto px-6 py-12 text-sm opacity-40 uppercase tracking-widest">
    &copy; {{name}}. All rights reserved.
  </footer>
  <script src="script.js"></script>
</body>
</html>`;
}

function generateCorporateLayout(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>{{name}} | ${t.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=${t.font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: '${t.font}', sans-serif; }</style>
  <link rel="stylesheet" href="style.css">
</head>
<body class="${t.bg} ${t.text} flex flex-col md:flex-row min-h-screen">
  
  <!-- Sidebar -->
  <aside class="${t.primary} md:w-80 p-8 flex flex-col justify-between shrink-0">
    <div>
      {{#if profilePhoto}}
      <img src="{{profilePhoto}}" alt="{{name}}" class="w-32 h-32 rounded-full border-4 border-white/20 mb-6 object-cover shadow-lg">
      {{/if}}
      <h1 class="text-3xl font-bold mb-2">{{name}}</h1>
      <p class="text-lg opacity-90 mb-6">{{title}}</p>
      
      <div class="space-y-2 text-sm opacity-80 mb-10">
        {{#if contact.email}}<p class="flex items-center gap-2">✉ {{contact.email}}</p>{{/if}}
        {{#if contact.phone}}<p class="flex items-center gap-2">☎ {{contact.phone}}</p>{{/if}}
        {{#if contact.location}}<p class="flex items-center gap-2">📍 {{contact.location}}</p>{{/if}}
      </div>
    </div>
    
    <div class="text-xs opacity-50 mt-10">
      &copy; {{name}}. Professional Profile.
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-grow p-8 md:p-12 lg:p-16 max-w-5xl space-y-16">
    
    <section>
      <h2 class="text-2xl font-bold mb-4 border-b pb-2 uppercase tracking-wide opacity-80">Professional Summary</h2>
      <p class="text-lg leading-relaxed opacity-90">{{summary}}</p>
    </section>

    {{#if experience.length}}
    <section>
      <h2 class="text-2xl font-bold mb-6 border-b pb-2 uppercase tracking-wide opacity-80">Experience</h2>
      <div class="space-y-6">
        {{#each experience}}
        <div class="p-6 ${t.secondary} transition hover:shadow-md">
          <div class="flex flex-col sm:flex-row justify-between mb-2">
            <h3 class="text-xl font-bold">{{this.role}}</h3>
            <span class="text-sm font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">{{this.duration}}</span>
          </div>
          <p class="text-lg font-medium mb-4 opacity-75">{{this.company}}</p>
          <p class="opacity-80">{{this.description}}</p>
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    {{#if projects.length}}
    <section>
      <h2 class="text-2xl font-bold mb-6 border-b pb-2 uppercase tracking-wide opacity-80">Key Initiatives</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {{#each projects}}
        <div class="p-6 ${t.secondary}">
          <h3 class="text-lg font-bold mb-3">{{this.title}}</h3>
          <p class="opacity-80 text-sm mb-4">{{this.description}}</p>
          {{#if this.technologies}}
          <div class="flex flex-wrap gap-1">
            {{#each this.technologies}}
            <span class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{this}}</span>
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
        <h2 class="text-xl font-bold mb-4 border-b pb-2 uppercase tracking-wide opacity-80">Core Competencies</h2>
        <div class="flex flex-wrap gap-2">
          {{#each skills}}
          <span class="px-3 py-1 text-sm font-medium ${t.secondary}">{{this}}</span>
          {{/each}}
        </div>
      </section>
      {{/if}}

      {{#if education.length}}
      <section>
        <h2 class="text-xl font-bold mb-4 border-b pb-2 uppercase tracking-wide opacity-80">Education</h2>
        <div class="space-y-4">
          {{#each education}}
          <div>
            <h3 class="font-bold">{{this.degree}}</h3>
            <p class="opacity-80 text-sm">{{this.institution}} &bull; {{this.duration}}</p>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
    </div>

  </main>
  <script src="script.js"></script>
</body>
</html>`;
}

function generateVibrantLayout(t) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>{{name}} | ${t.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=${t.font.replace(/ /g, '+')}:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>body { font-family: '${t.font}', sans-serif; }</style>
  <link rel="stylesheet" href="style.css">
</head>
<body class="${t.bg} ${t.text} overflow-x-hidden relative">
  <!-- Decorative Blobs -->
  <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-3xl -z-10 mix-blend-multiply"></div>
  <div class="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-500/20 blur-3xl -z-10 mix-blend-multiply"></div>
  <div class="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-3xl -z-10 mix-blend-multiply"></div>

  <header class="max-w-4xl mx-auto px-6 py-24 text-center">
    {{#if profilePhoto}}
    <img src="{{profilePhoto}}" alt="{{name}}" class="w-32 h-32 mx-auto rounded-[2rem] shadow-2xl mb-8 object-cover border-4 border-white/50">
    {{/if}}
    <h1 class="text-5xl md:text-7xl font-black mb-4 tracking-tight">Hi, I'm {{name}}.</h1>
    <h2 class="text-3xl md:text-5xl font-extrabold mb-8 ${t.primary}">${t.title}</h2>
    <p class="text-xl max-w-2xl mx-auto leading-relaxed opacity-80 font-medium">{{summary}}</p>
  </header>

  <main class="max-w-6xl mx-auto px-6 pb-24 space-y-24">
    
    {{#if projects.length}}
    <section>
      <h3 class="text-4xl font-black mb-12 text-center">My Work</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {{#each projects}}
        <div class="p-8 ${t.secondary} hover:-translate-y-2 transition-transform duration-300">
          <h4 class="text-2xl font-bold mb-4">{{this.title}}</h4>
          <p class="opacity-80 mb-6">{{this.description}}</p>
          {{#if this.technologies}}
          <div class="flex flex-wrap gap-2">
            {{#each this.technologies}}
            <span class="text-xs font-bold px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full">{{this}}</span>
            {{/each}}
          </div>
          {{/if}}
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    {{#if experience.length}}
    <section class="max-w-3xl mx-auto">
      <h3 class="text-4xl font-black mb-12 text-center">Experience</h3>
      <div class="space-y-8">
        {{#each experience}}
        <div class="p-8 ${t.secondary} relative overflow-hidden">
          <div class="absolute top-0 left-0 w-2 h-full ${t.primary} opacity-50"></div>
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-xl font-bold">{{this.role}}</h4>
            <span class="font-bold opacity-50">{{this.duration}}</span>
          </div>
          <p class="text-lg font-bold ${t.primary} mb-4">{{this.company}}</p>
          <p class="opacity-80">{{this.description}}</p>
        </div>
        {{/each}}
      </div>
    </section>
    {{/if}}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto text-center">
      {{#if skills.length}}
      <section>
        <h3 class="text-2xl font-black mb-8">Superpowers</h3>
        <div class="flex flex-wrap justify-center gap-3">
          {{#each skills}}
          <span class="px-5 py-3 ${t.secondary} font-bold text-sm hover:scale-105 transition-transform">{{this}}</span>
          {{/each}}
        </div>
      </section>
      {{/if}}

      <section>
        <h3 class="text-2xl font-black mb-8">Let's Connect</h3>
        <div class="p-8 ${t.secondary} flex flex-col justify-center h-full">
          {{#if contact.email}}<a href="mailto:{{contact.email}}" class="text-xl font-bold mb-4 hover:underline ${t.primary}">{{contact.email}}</a>{{/if}}
          {{#if contact.location}}<p class="opacity-80 font-medium">{{contact.location}}</p>{{/if}}
        </div>
      </section>
    </div>

  </main>
  <script src="script.js"></script>
</body>
</html>`;
}


if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Write the template directories
templates.forEach(t => {
  const tDir = path.join(templatesDir, t.id);
  if (!fs.existsSync(tDir)) fs.mkdirSync(tDir);

  let html = '';
  if (t.layout === 'terminal') html = generateTerminalLayout(t);
  else if (t.layout === 'editorial') html = generateEditorialLayout(t);
  else if (t.layout === 'corporate') html = generateCorporateLayout(t);
  else if (t.layout === 'vibrant') html = generateVibrantLayout(t);

  fs.writeFileSync(path.join(tDir, 'index.html'), html);
  fs.writeFileSync(path.join(tDir, 'style.css'), '/* Custom CSS */\n');
  fs.writeFileSync(path.join(tDir, 'script.js'), '// Custom JS\n');
  
  const dummyDataPath = path.join(templatesDir, 'devPortfolio', 'data.json');
  if (fs.existsSync(dummyDataPath)) {
    fs.copyFileSync(dummyDataPath, path.join(tDir, 'data.json'));
  }
});

console.log('Successfully regenerated 20 templates with vastly improved layouts.');
