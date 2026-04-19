const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');
const search = '<td>${new Date(s.createdAt).toLocaleString(\'vi-VN\')}</td>';
const replace = '<td>${new Date(s.createdAt).toLocaleString(\'vi-VN\')}${s.timeTaken ? `<br><small style="color:#e67e22; font-weight: 500;">⏱ ${s.timeTaken}</small>` : \'\'}</td>';
html = html.replace(search, replace);

const scoreSearch = 'const resultText = s.quizType === \'thuchanhhk2\' ? \'<span style="color:#27ae60; font-weight:bold;">Đã xem/Hoàn thành</span>\' : `<b>${s.score}/${s.total}</b>`;';
const scoreReplace = 'const resultText = s.quizType === \'thuchanhhk2\' ? \'<span style="color:#27ae60; font-weight:bold;">Đã xem/Hoàn thành</span>\' : (s.total === 100 ? `<b style="color:#c0392b">${s.score}%</b>` : `<b>${s.score}/${s.total}</b>`);';
html = html.replace(scoreSearch, scoreReplace);

fs.writeFileSync('public/admin.html', html);
console.log('Update admin.html done');
