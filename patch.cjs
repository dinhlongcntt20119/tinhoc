const fs = require('fs');
let html = fs.readFileSync('public/VBT/vbtontaphk2.html', 'utf8');

// Insert login overlay
let bodyTag = html.indexOf('<div class="page">');
let overlay = `
<div id="login-overlay" style="position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,86,179,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center;">
    <div style="background: white; padding: 40px; border-radius: 10px; width: 400px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <h2 style="text-align: center; color: #0056b3; margin-top: 0;"><i class="fas fa-user-graduate"></i> Học sinh Lớp 4</h2>
        <div style="margin-bottom: 20px;">
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Họ và tên:</label>
            <input type="text" id="studentName" placeholder="Nhập họ tên..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px;">
        </div>
        <div style="margin-bottom: 20px;">
             <label style="font-weight: bold; display: block; margin-bottom: 5px;">Lớp:</label>
             <input type="text" id="studentClass" placeholder="Ví dụ: 4A" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 16px;">
        </div>
        <button onclick="startTest()" style="width: 100%; padding: 12px; background: #f0f0f0; color: #333; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; transition: background 0.3s; font-size: 16px;">Vào làm bài</button>
    </div>
</div>
<script>
let startTime = null;
let stdName = '';
let stdClass = '';

function startTest() {
    stdName = document.getElementById('studentName').value.trim();
    stdClass = document.getElementById('studentClass').value.trim();
    if(!stdName || !stdClass) {
        alert('Vui lòng nhập đầy đủ Họ tên và Lớp!');
        return;
    }
    document.getElementById('login-overlay').style.display = 'none';
    startTime = new Date();
}
</script>
`;

html = html.substring(0, bodyTag) + overlay + html.substring(bodyTag);

// Modify checkRadioGroup to add .correct / .wrong
html = html.replace("options[i].closest('.q10-box').style.backgroundColor = '#eafaf1';", "options[i].closest('.q10-box').style.backgroundColor = '#eafaf1'; options[i].closest('.q10-box').classList.add('correct');");
html = html.replace("options[i].closest('.q10-box').style.backgroundColor = '#fdedec';", "options[i].closest('.q10-box').style.backgroundColor = '#fdedec'; options[i].closest('.q10-box').classList.add('wrong');");

// Modify checkAll to calculate score
let checkAllEnd = html.indexOf('alert("Đã kiểm tra bài làm. Các phần sai sẽ được khoanh đỏ');
if (checkAllEnd !== -1) {
    let newCheckAllEnd = `
        let endTime = new Date();
        let timeTakenSec = Math.floor((endTime - startTime) / 1000);
        let timeStr = Math.floor(timeTakenSec / 60) + " phút " + (timeTakenSec % 60) + " giây";
        
        let numCorrect = document.querySelectorAll('.correct, .correct-ans').length;
        let numWrong = document.querySelectorAll('.wrong, .wrong-ans, .missing-alert').length; // including missing ones if missing-alert still there
        
        // Count q10-box for right calculations mostly handled above?
        let totalItems = numCorrect + numWrong;
        let scoreInfo = numCorrect + " điểm";

        let resultMsg = "Đã kiểm tra xong bài làm!\\nĐúng: " + numCorrect + " ý\\nSai/Thiếu: " + numWrong + " ý\\nThời gian làm bài: " + timeStr;

        if (window.saveToFirebase) {
            window.saveToFirebase(stdName, stdClass, scoreInfo, timeStr).then(() => {
                alert(resultMsg + "\\n\\n[Hệ thống đã lưu kết quả của bạn!]");
            }).catch(e => {
                alert(resultMsg + "\\n\\n(Lỗi khi lưu kết quả: " + e.message + ")");
            });
        } else {
            alert(resultMsg);
        }
`;
    // Find the end of `checkAll` function
    let checkAllEndBracket = html.indexOf('}', checkAllEnd);
    html = html.substring(0, checkAllEnd) + newCheckAllEnd + html.substring(checkAllEndBracket);
}

// Append Firebase logic at the very end
let firebaseScript = `
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
  
  fetch('/firebase-applet-config.json').then(res => res.json()).then(config => {
      const app = initializeApp(config);
      const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
      
      window.saveToFirebase = async function(name, cls, score, time) {
          try {
              let colRef = collection(db, 'exercises_results');
              await addDoc(colRef, {
                  studentName: name,
                  studentClass: cls,
                  score: score,
                  timeTaken: time,
                  lesson: 'Ôn tập HK 2',
                  timestamp: serverTimestamp()
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

html = html.replace('</body>', '');
html = html.replace('</html>', '');
html += firebaseScript;

fs.writeFileSync('public/VBT/vbtontaphk2.html', html);
console.log('Done patching vbtontaphk2.html');
