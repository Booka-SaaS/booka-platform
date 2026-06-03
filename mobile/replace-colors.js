const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.html')) results.push(file);
          next();
        }
      });
    })();
  });
};

walk('./src/app', (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    content = content.replace(/indigo-600/g, 'primary');
    content = content.replace(/indigo-700/g, 'primary');
    content = content.replace(/indigo-500/g, 'primary/80');
    content = content.replace(/indigo-400/g, 'primary/60');
    content = content.replace(/indigo-200/g, 'primary/30');
    content = content.replace(/indigo-100/g, 'primary/20');
    content = content.replace(/indigo-50/g, 'primary/10');
    
    // Convert slate-50 background to the new surface token for full fidelity
    content = content.replace(/bg-slate-50/g, 'bg-surface');

    // Add translucent toolbar formatting
    content = content.replace(/<ion-toolbar>/g, '<ion-toolbar class="bg-surface/90 backdrop-blur-md">');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated:', path.relative(__dirname, file));
    }
  });
});
