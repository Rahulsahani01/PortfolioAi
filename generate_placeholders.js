const fs = require('fs');
const path = require('path');
const https = require('https');

const templates = [
  'devPortfolio', 'Queenfolio', 'MinimalWriter', 'StudentGrad', 'DataPro', 
  'MarketingPro', 'ExecLeader', 'CreativeGrid', 'Freelancer', 'Founder',
  'FullStackDev', 'FrontendWizard', 'BackendArchitect', 'MobileDev', 'DevSecOps',
  'DataEngineer', 'UIUXDesigner', 'ProductDesigner', 'BrandStrategist', 'WebDesigner',
  'CreativeDirector', 'ProductManager', 'ScrumMaster', 'GrowthHacker', 'TechFounder',
  'StartupBDE', 'AIMLEngineer', 'CloudArchitect', 'QAEngineer', 'BlockchainDev'
];

const thumbnailsDir = path.join(__dirname, 'public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function generateMissingPlaceholders() {
  const colors = ['111111', '0D9488', '4F46E5', 'E11D48', 'D97706', '2563EB', '9333EA'];
  
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const imagePath = path.join(thumbnailsDir, `${template}.png`);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`Generating placeholder for ${template}...`);
      const bgColor = colors[i % colors.length];
      const text = encodeURIComponent(template);
      const url = `https://placehold.co/600x400/${bgColor}/FFFFFF/png?text=${text}`;
      
      try {
        await downloadImage(url, imagePath);
        console.log(`Saved ${template}.png`);
      } catch (err) {
        console.error(`Error downloading ${template}:`, err.message);
      }
    }
  }
}

generateMissingPlaceholders().then(() => console.log('Done!'));
