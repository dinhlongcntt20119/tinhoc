const fs = require('fs');
let html = fs.readFileSync('public/VBT/vbtontaphk2.html', 'utf8');

let newCheckAllEnd = `
        let endTime = new Date();
        let timeTakenSec = Math.floor((endTime - startTime) / 1000);
        let timeStr = Math.floor(timeTakenSec / 60) + " phút " + (timeTakenSec % 60) + " giây";
        
        let numCorrect = document.querySelectorAll('.correct, .correct-ans').length;
        let numWrong = document.querySelectorAll('.wrong, .wrong-ans, .missing-alert').length; 
        
        let totalItems = numCorrect + numWrong;
        if(totalItems === 0) totalItems = 30; // fallback

        let resultMsg = "Đã kiểm tra xong bài làm!\\nĐúng: " + numCorrect + " ý\\nSai/Thiếu: " + numWrong + " ý\\nThời gian làm bài: " + timeStr;

        if (window.saveToFirebase) {
            window.saveToFirebase(stdName, stdClass, numCorrect, totalItems, timeStr).then(() => {
                alert(resultMsg + "\\n\\n[Hệ thống đã lưu kết quả của bạn!]");
            }).catch(e => {
                alert(resultMsg + "\\n\\n(Lỗi khi lưu kết quả: " + e.message + ")");
            });
        } else {
            alert(resultMsg);
        }
`;

// Replace old script
// Find start and end of my injected block:
let startIndex = html.indexOf('let endTime = new Date();');
let endIndex = html.indexOf('if (window.saveToFirebase) {', startIndex);
let brkEndIndex = html.indexOf('alert(resultMsg);', endIndex);
brkEndIndex = html.indexOf('}', brkEndIndex) + 1; // End of if-else

if(startIndex !== -1 && brkEndIndex !== -1) {
    html = html.substring(0, startIndex) + newCheckAllEnd + html.substring(brkEndIndex);
}

// Modify the firebase script at the bottom
let newFirebaseScript = `
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
  
  fetch('/firebase-applet-config.json').then(res => res.json()).then(config => {
      const app = initializeApp(config);
      const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
      
      window.saveToFirebase = async function(name, cls, scoreNum, totalNum, timeStr) {
          try {
              let colRef = collection(db, 'submissions');
              await addDoc(colRef, {
                  studentName: name,
                  studentClass: cls,
                  quizType: 'vbtontaphk2',
                  schoolId: 'none',
                  score: Number(scoreNum),
                  total: Number(totalNum),
                  timeTaken: timeStr,
                  createdAt: new Date().toISOString()
              });
          } catch(e) {
              console.error("Lỗi Firebase: ", e);
              throw e;
          }
      };
  }).catch(e => console.log("Không thể khởi tạo Firebase:", e));
</script>
</body>
</html>`;

let scriptStart = html.indexOf('<script type="module">');
if(scriptStart !== -1) {
    html = html.substring(0, scriptStart) + newFirebaseScript;
}

fs.writeFileSync('public/VBT/vbtontaphk2.html', html);
console.log('Fixed score logic and firebase db logic!');
