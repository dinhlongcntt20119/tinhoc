const fs = require('fs');

let content = fs.readFileSync('./public/SGK/ontaphk2.html', 'utf8');

content = content.replace(/let isShuffledOnce = false;/, 
`let isShuffledOnce = false;

        window.triggerGlobalShuffle = function() {
            if(!isShuffledOnce) {
                activeQuestions.sort(() => Math.random() - 0.5);
                activeQuestions.forEach(q => {
                    const shuffledOptions = [...q.a].map((opt, i) => ({ opt, originalIndex: i })).sort(() => Math.random() - 0.5);
                    q.a = shuffledOptions.map(item => item.opt);
                    q.correct = shuffledOptions.findIndex(item => item.originalIndex === q.correct);
                });
                isShuffledOnce = true;
                renderQuiz();
            }
        };`);

fs.writeFileSync('./public/SGK/ontaphk2.html', content, 'utf8');
