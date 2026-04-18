const fs = require('fs');

// Patch ontaphk2.html
let content2 = fs.readFileSync('./public/SGK/ontaphk2.html', 'utf8');
content2 = content2.replace(/document\.getElementById\('scoreDisplay'\)\.innerText = \`\$\{score\}\/\$\{activeQuestions\.length\}\`;/, 
`document.getElementById('scoreDisplay').innerText = score + '/' + activeQuestions.length;
            // Generate answers log
            let ansLog = "";
            activeQuestions.forEach((q, index) => {
                const selected = document.querySelector(\`input[name="q\${index}"]:checked\`);
                ansLog += \`Câu \${index+1}: \${selected ? "Đã trả lời" : "Bỏ qua"} - Đúng: \${q.a[q.correct]}\\n\`;
            });
            setTimeout(() => { if (typeof submitToFirebase === 'function') submitToFirebase(score, activeQuestions.length, ansLog); }, 500);
            `);
fs.writeFileSync('./public/SGK/ontaphk2.html', content2, 'utf8');

// Patch vbtontaphk2.html
let content3 = fs.readFileSync('./public/VBT/vbtontaphk2.html', 'utf8');
content3 = content3.replace(/alert\("Chúc mừng bạn đã hoàn thành bài tập!"\);/,
`// Generate answers log
            let score = document.querySelectorAll('.correct').length;
            let total = document.querySelectorAll('.correct').length + document.querySelectorAll('.wrong').length;
            let ansLog = "Bài tự luận VBT (hệ thống chấm kết hợp kéo/thả và điền từ). Số ý đúng: " + score;
            setTimeout(() => { if (typeof submitToFirebase === 'function') submitToFirebase(score, total || 30, ansLog); }, 500);
            alert("Chúc mừng bạn đã hoàn thành bài tập!");
            `);
fs.writeFileSync('./public/VBT/vbtontaphk2.html', content3, 'utf8');
