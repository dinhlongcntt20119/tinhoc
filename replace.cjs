const fs = require('fs');
const files = ['/SGK/ontaphk2.html', '/SGK/ontaphk1.html'];

for (let file of files) {
  try {
    let content = fs.readFileSync('.' + file, 'utf8');

    // Remove old function renderQuiz
    content = content.replace(/function renderQuiz\(\) \{[\s\S]*?function submitQuiz\(\) \{[\s\S]*?resultModal'\)\.style\.display = 'flex';\n        }/, 
`        let activeQuestions = [...questions];
        let isShuffledOnce = false;

        function checkShuffle() {
            const urlParams = new URLSearchParams(window.location.search);
            const isShuffle = urlParams.get('shuffle') === '1' || localStorage.getItem('globalShuffle') === '1';
            
            if (isShuffle) {
                // Sắp xếp lại thứ tự câu hỏi
                activeQuestions.sort(() => Math.random() - 0.5);
                
                // Đảo đáp án từng câu
                activeQuestions.forEach(q => {
                    const shuffledOptions = [...q.a].map((opt, i) => ({ opt, originalIndex: i })).sort(() => Math.random() - 0.5);
                    q.a = shuffledOptions.map(item => item.opt);
                    q.correct = shuffledOptions.findIndex(item => item.originalIndex === q.correct);
                });
            }
        }

        function renderQuiz() {
            const container = document.getElementById('quiz-container');
            container.innerHTML = '';
            
            if (!isShuffledOnce) { checkShuffle(); isShuffledOnce = true; }
            
            activeQuestions.forEach((q, index) => {
                let html = \`<div class="quiz-card" id="card-\${index}">
                    <div class="q-title">\${q.q.replace(/Câu \\d+:/, \`Câu \${index + 1}:\`)}</div>
                    <div class="options-grid">\`;
                q.a.forEach((opt, i) => {
                    html += \`<label class="option-label" id="opt-\${index}-\${i}">
                                <input type="radio" name="q\${index}" value="\${i}"> \${opt}
                             </label>\`;
                });
                html += \`</div></div>\`;
                container.innerHTML += html;
            });
        }

        function submitQuiz() {
            let score = 0;
            activeQuestions.forEach((q, index) => {
                const selected = document.querySelector(\`input[name="q\${index}"]:checked\`);
                const card = document.getElementById(\`card-\${index}\`);
                card.querySelectorAll('.option-label').forEach(el => el.classList.remove('correct-answer', 'wrong-answer'));

                if (selected) {
                    const val = parseInt(selected.value);
                    if (val === q.correct) {
                        score++;
                        document.getElementById(\`opt-\${index}-\${val}\`).classList.add('correct-answer');
                    } else {
                        document.getElementById(\`opt-\${index}-\${val}\`).classList.add('wrong-answer');
                        document.getElementById(\`opt-\${index}-\${q.correct}\`).classList.add('correct-answer');
                    }
                } else {
                    document.getElementById(\`opt-\${index}-\${q.correct}\`).classList.add('correct-answer');
                }
            });

            document.getElementById('scoreDisplay').innerText = \`\${score}/\${activeQuestions.length}\`;
            
            let msg = "";
            let percent = score / activeQuestions.length;
            if(percent >= 0.9) msg = "Tuyệt vời! Em đã sẵn sàng cho kỳ thi.";
            else if(percent >= 0.6) msg = "Khá tốt! Em nắm được hầu hết kiến thức.";
            else msg = "Em cần ôn lại bài thêm nhé!";
            
            document.getElementById('feedbackText').innerText = msg;
            document.getElementById('resultModal').style.display = 'flex';
        }`);

    fs.writeFileSync('.' + file, content, 'utf8');
    console.log('Processed ' + file);
  } catch (e) {
    console.log('Error processing ' + file + ':', e.message);
  }
}
