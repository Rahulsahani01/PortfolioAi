#!/bin/bash
cd src/resumetemplateCollection || exit 1

TEMPLATES=(
  "MinimalWriter"
  "StudentGrad"
  "DataPro"
  "MarketingPro"
  "ExecLeader"
  "CreativeGrid"
  "Freelancer"
  "Founder"
)

for t in "${TEMPLATES[@]}"; do
  mkdir -p "$t"
  cp devPortfolio/data.json "$t/"
  
  cat << 'EOF' > "$t/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>{{name}} | Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-white text-gray-900">
  <div class="max-w-4xl mx-auto p-8">
    <header class="py-12 border-b">
      <h1 class="text-4xl font-bold">{{name}}</h1>
      <p class="text-xl text-gray-600 mt-2">{{title}}</p>
    </header>
    
    <main class="py-12 space-y-16">
      <section>
        <h2 class="text-2xl font-semibold mb-4">About</h2>
        <p class="text-gray-700 leading-relaxed">{{summary}}</p>
      </section>

      {{#if experience.length}}
      <section>
        <h2 class="text-2xl font-semibold mb-6">Experience</h2>
        <div class="space-y-8">
          {{#each experience}}
          <div>
            <h3 class="text-xl font-medium">{{this.role}}</h3>
            <p class="text-gray-500 mb-2">{{this.company}} | {{this.duration}}</p>
            <p class="text-gray-700">{{this.description}}</p>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
      
      {{#if projects.length}}
      <section>
        <h2 class="text-2xl font-semibold mb-6">Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {{#each projects}}
          <div class="border p-6 rounded-lg">
            <h3 class="text-xl font-medium mb-2">{{this.title}}</h3>
            <p class="text-gray-700">{{this.description}}</p>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
      
      {{#if skills.length}}
      <section>
        <h2 class="text-2xl font-semibold mb-4">Skills</h2>
        <div class="flex flex-wrap gap-2">
          {{#each skills}}
          <span class="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">{{this}}</span>
          {{/each}}
        </div>
      </section>
      {{/if}}
      
      {{#if education.length}}
      <section>
        <h2 class="text-2xl font-semibold mb-6">Education</h2>
        <div class="space-y-6">
          {{#each education}}
          <div>
            <h3 class="text-xl font-medium">{{this.degree}}</h3>
            <p class="text-gray-600">{{this.institution}} | {{this.duration}}</p>
          </div>
          {{/each}}
        </div>
      </section>
      {{/if}}
    </main>
    
    <footer class="py-8 text-center text-gray-500 border-t">
      <p>&copy; {{name}} - Portfolio</p>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>
EOF

  echo "/* Custom CSS for $t */" > "$t/style.css"
  echo "// Custom JS for $t" > "$t/script.js"
done
echo "Scaffold complete"
