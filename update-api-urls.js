const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchValue, replaceValue) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function findAndReplaceInDirectory(dir, searchValue, replaceValue, fileExtensions = ['.js', '.jsx', '.ts', '.tsx']) {
  let updatedCount = 0;

  function processDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (!['node_modules', '.git', 'build', 'dist'].includes(item)) {
          processDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (fileExtensions.includes(ext)) {
          if (replaceInFile(fullPath, searchValue, replaceValue)) {
            updatedCount++;
          }
        }
      }
    }
  }

  processDirectory(dir);
  return updatedCount;
}

// Update all localhost:5001 to localhost:5002 in the client directory
const clientDir = path.join(__dirname, 'client', 'src');
const searchValue = 'localhost:5001';
const replaceValue = 'localhost:5002';

console.log('🔄 Updating API URLs from localhost:5001 to localhost:5002...\n');

const updatedCount = findAndReplaceInDirectory(clientDir, searchValue, replaceValue);

console.log(`\n🎉 Update complete! Updated ${updatedCount} files.`);
