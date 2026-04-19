const fs = require('fs');
let cfg = fs.readFileSync('firestore.rules', 'utf8');
const target = `(data.quizType == 'vbtontaphk2' && data.keys().hasAll(['studentName', 'studentClass', 'quizType', 'score', 'total', 'schoolId', 'createdAt']) && 
                data.score is number && data.total is number) ||`;
const rep = `(data.quizType == 'vbtontaphk2' && data.keys().hasAll(['studentName', 'studentClass', 'quizType', 'score', 'total', 'timeTaken', 'schoolId', 'createdAt']) && 
                data.score is number && data.total is number && data.timeTaken is string && data.timeTaken.size() <= 100) ||`;
cfg = cfg.replace(target, rep);
fs.writeFileSync('firestore.rules', cfg);
console.log("Updated:", cfg.includes('timeTaken'));
