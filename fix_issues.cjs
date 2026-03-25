const fs = require('fs');
const path = require('path');

// 1. Fix SGK/ontaphk1.html
const ontaphk1Path = path.join(__dirname, 'SGK', 'ontaphk1.html');
if (fs.existsSync(ontaphk1Path)) {
    let content = fs.readFileSync(ontaphk1Path, 'utf8');
    
    // Remove the newly added header
    content = content.replace(/<header style="background: linear-gradient[\s\S]*?<\/header>/, '');
    
    // Update the mainHeader to look like the newly added header but keep the student info
    const newMainHeader = `
    <header id="mainHeader" style="display:none; background: linear-gradient(135deg, #0056b3, #00a8ff); color: white; padding: 15px 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div class="header-content" style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <a href="../index.html" style="text-decoration: none; color: white;">
                <div style="font-family: 'Source Code Pro', monospace; font-size: 1.5rem; font-weight: bold;"><i class="fas fa-laptop-code fa-beat" style="color: #ffeb3b; margin-right: 8px;"></i> TIN HỌC 4</div>
            </a>
            <div style="font-size: 0.9rem; opacity: 0.9; text-align: right;">
                <div>GV - Nguyễn Đình Bạch Long</div>
                <div class="sub-title" style="margin-top: 5px;">Học sinh: <span id="displayInfo" style="color: #ffeb3b; font-weight: bold;"></span></div>
            </div>
        </div>
    </header>
`;
    content = content.replace(/<header id="mainHeader"[\s\S]*?<\/header>/, newMainHeader);
    
    fs.writeFileSync(ontaphk1Path, content, 'utf8');
    console.log('Fixed SGK/ontaphk1.html');
}

// 2. Update icon in all HTML files
const dirs = ['SGK', 'VBT'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace old icon with lively icon
        content = content.replace(/<i class="fas fa-laptop-code"><\/i> TIN HỌC 4/g, '<i class="fas fa-laptop-code fa-beat" style="color: #ffeb3b; margin-right: 8px;"></i> TIN HỌC 4');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated icon in ${dir}/${file}`);
    });
});

// 3. Update icon in src/App.tsx
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
if (fs.existsSync(appTsxPath)) {
    let content = fs.readFileSync(appTsxPath, 'utf8');
    content = content.replace(/<i className="fas fa-laptop-code"><\/i> TIN HỌC 4/g, '<i className="fas fa-laptop-code fa-beat" style={{color: \'#ffeb3b\', marginRight: \'8px\'}}></i> TIN HỌC 4');
    fs.writeFileSync(appTsxPath, content, 'utf8');
    console.log('Updated icon in src/App.tsx');
}
