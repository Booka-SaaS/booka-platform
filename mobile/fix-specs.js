const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.spec.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Skip if already processed or if it's a service/guard spec
      if (content.includes('provideHttpClient()') || !content.includes('ComponentFixture')) {
        continue;
      }

      // Add imports
      content = content.replace(
        "import { ComponentFixture, TestBed } from '@angular/core/testing';",
        "import { ComponentFixture, TestBed } from '@angular/core/testing';\nimport { provideHttpClient } from '@angular/common/http';\nimport { provideRouter } from '@angular/router';"
      );

      // Add providers to TestBed
      content = content.replace(
        /imports: \[([^\]]+)\]\s*\}/,
        "imports: [$1],\n      providers: [provideHttpClient(), provideRouter([])]\n    }"
      );

      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${fullPath}`);
    }
  }
}

const srcPath = path.join(__dirname, 'src', 'app');
processDir(path.join(srcPath, 'pages'));
processDir(path.join(srcPath, 'components'));
