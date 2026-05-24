const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Fix "accessed before declared" by changing const fetchX = async () => to async function fetchX()
            content = content.replace(/const\s+(fetch\w+)\s*=\s*async\s*\(\)\s*=>\s*\{/g, 'async function $1() {');
            
            // Same for loadX
            content = content.replace(/const\s+(load\w+)\s*=\s*async\s*\(\)\s*=>\s*\{/g, 'async function $1() {');

            fs.writeFileSync(fullPath, content, 'utf8');
        }
    }
}

processDir('f:/xampp/htdocs/school-erp/frontend/src/pages');
console.log('Done fixing hoisting bugs.');
