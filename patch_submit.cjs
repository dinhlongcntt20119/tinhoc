const fs = require('fs');

try {
  let content = fs.readFileSync('public/SGK/ontaphk2.html', 'utf8');

  // Regex replacement for flexibility
  content = content.replace(/(function submitQuiz\(\)\s*\{[\s\S]*?let score = 0;)/, '$1\n            let answersLog = "";');
  content = content.replace(/(if\s*\(selected\)\s*\{\s*const val = parseInt\(selected\.value\);)/g, '$1\n                    answersLog += `Câu ${index + 1}: Chọn đáp án ${val + 1} - ${val === q.correct ? "ĐÚNG" : "SAI"}\\n`;');
  content = content.replace(/(\}\s*else\s*\{\s*)(document\.getElementById\(`opt-\$\{index\}-\$\{q\.correct\}`\)\.classList\.add\('correct-answer'\);)/g, '$1answersLog += `Câu ${index + 1}: Không chọn - SAI\\n`;\n                    $2');
  content = content.replace(/(document\.getElementById\('resultModal'\)\.style\.display = 'flex';\s*)\}/, '$1if(typeof submitToFirebase === "function") submitToFirebase(score, questions.length, answersLog);\n        }');

  fs.writeFileSync('public/SGK/ontaphk2.html', content);
  console.log("Patched ontaphk2.html successfully");
} catch (e) {
  console.error("Error patching:", e);
}
