const fs=require('fs');fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
for(const f of['index.html','logic.js','sw.js','manifest.webmanifest','icon.svg'])fs.copyFileSync(f,'dist/'+f);console.log('dist/ gerado')
