const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/siteDetails/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Use precise regex to extract blocks
const extractBlock = (markerStart, markerEnd) => {
  // Regex looks for the comment e.g. {/* Skills */} up to the start of the next block or specific closing
  // We will define the regex manually for each block since we know exactly how they start and end.
};

const blocks = {
  personalInfo: content.substring(content.indexOf('                  {/* Personal Info */}'), content.indexOf('                  {/* Contact Info */}')),
  contactInfo: content.substring(content.indexOf('                  {/* Contact Info */}'), content.indexOf('                  {/* Social Links */}')),
  socialLinks: content.substring(content.indexOf('                  {/* Social Links */}'), content.indexOf('                  {/* Resume */}')),
  resume: content.substring(content.indexOf('                  {/* Resume */}'), content.indexOf('                  {/* Education */}')),
  education: content.substring(content.indexOf('                  {/* Education */}'), content.indexOf('                  {/* Skills */}')),
  skills: content.substring(content.indexOf('                  {/* Skills */}'), content.indexOf('                </div>\n\n                {/* Right Column – Experience */}')),
  experience: content.substring(content.indexOf('                  <div className={`${styles.card} ${styles.expCard}`}>'), content.indexOf('                  {/* Projects */}')),
  projects: content.substring(content.indexOf('                  {/* Projects */}'), content.indexOf('                </div>\n              </section>'))
};

const newLeftCol = blocks.personalInfo + blocks.contactInfo + blocks.skills + blocks.resume + blocks.education;
const newRightCol = `                  {/* Experience */}\n` + blocks.experience + blocks.projects + blocks.socialLinks;

const newContent = content.substring(0, content.indexOf('                  {/* Personal Info */}')) +
  newLeftCol +
  '                </div>\n\n                {/* Right Column */}\n                <div className={styles.rightCol}>\n' +
  newRightCol +
  '                </div>\n              </section>';

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Reordered successfully');
