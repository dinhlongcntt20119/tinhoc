const fs = require('fs');

function processFile(file, quizType) {
  let content = fs.readFileSync('.' + file, 'utf8');

  // Insert Login CSS
  if (!content.includes('loginScreen')) {
    const loginCss = `
        #loginScreen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #0056b3, #004494); display: flex; justify-content: center; align-items: center; z-index: 3000; }
        .login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 400px; text-align: center; }
        .input-group { margin-bottom: 20px; text-align: left; }
        .input-group label { display: block; font-weight: bold; margin-bottom: 8px; color: #555; }
        .input-group input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
        .sub-title { font-size: 0.9rem; }
`;
    content = content.replace('</style>', loginCss + '</style>');

    const loginHtml = `
    <div id="loginScreen">
        <div class="login-box">
            <h2 style="color: #0056b3; margin-bottom:20px;"><i class="fas fa-user-graduate"></i> Học sinh Lớp 4</h2>
            <div class="input-group"><label>Họ và tên:</label><input type="text" id="studentName" placeholder="Nhập họ tên..."></div>
            <div class="input-group"><label>Lớp:</label><input type="text" id="studentClass" placeholder="Ví dụ: 4A"></div>
            <button class="btn btn-check" style="width: 100%; margin: 0;" onclick="startQuiz()">Vào làm bài</button>
        </div>
    </div>
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
    
    // Replace existing header or body start with loginHtml
    if (content.includes('<header style')) {
        content = content.replace(/<header style=".*?<\/header>/s, loginHtml);
    } else if (content.includes('<header')) {
        content = content.replace(/<header>.*?<\/header>/s, loginHtml);
    } else {
        content = content.replace('<body>', '<body>\n' + loginHtml);
    }
  }

  // Hide main page initially
  if (!content.includes('style="display:none" class="page"')) {
      content = content.replace('class="page"', 'class="page" id="mainPage" style="display:none"');
      content = content.replace('class="container"', 'class="container" id="mainPage" style="display:none"');
  }

  // Insert startQuiz JS
  if (!content.includes('function startQuiz()')) {
      const jsTop = `
      let studentInfo = { name: "", class: "" };
      function startQuiz() {
          const name = document.getElementById('studentName').value.trim();
          const className = document.getElementById('studentClass').value.trim();
          if(!name || !className) { alert("Vui lòng nhập đủ Họ tên và Lớp!"); return; }
          studentInfo.name = name;
          studentInfo.class = className;
          document.getElementById('displayInfo').innerText = name + " - " + className;
          document.getElementById('loginScreen').style.display = 'none';
          document.getElementById('mainHeader').style.display = 'flex';
          const mainPage = document.getElementById('mainPage');
          if(mainPage) mainPage.style.display = 'block';
      }
      `;
      content = content.replace('<script>', '<script>\n' + jsTop);
  }

  // Insert Firebase imports + fetch config at bottom before </body>
  if (!content.includes('firebase-config.js')) {
      const fbScript = `
    <script type="module">
        import { db } from '../firebase-config.js';
        import { collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
        
        window.firebaseDB = db;
        window.firebaseAddDoc = addDoc;
        window.firebaseCollection = collection;

        // Auto apply global shuffle setting
        getDoc(doc(db, "settings", "quizConfig")).then(snap => {
            if (snap.exists() && snap.data().shuffle) {
                if (typeof window.triggerGlobalShuffle === 'function') {
                    window.triggerGlobalShuffle();
                }
            }
        });
    </script>
    <script>
        async function submitToFirebase(score, total, answersLog) {
            if(!window.firebaseDB) return;
            const btn = document.querySelector('.btn-check') || document.querySelector('.btn-submit');
            const originalText = btn ? btn.innerText : '';
            if(btn) { btn.innerText = 'Đang nộp bài...'; btn.disabled = true; }
            try {
                await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, "submissions"), {
                    studentName: studentInfo.name,
                    studentClass: studentInfo.class,
                    quizType: "${quizType}",
                    score: score,
                    total: total,
                    answers: answersLog,
                    schoolId: "tin-hoc-4",
                    createdAt: new Date().toISOString()
                });
                alert("Nộp bài thành công!");
            } catch (e) {
                alert("Lỗi nộp bài: " + e.message);
            }
            if(btn) { btn.innerText = originalText; btn.disabled = false; }
        }
    </script>
      `;
      content = content.replace('</body>', fbScript + '\n</body>');
  }

  fs.writeFileSync('.' + file, content, 'utf8');
}

processFile('/public/SGK/ontaphk2.html', 'ontaphk2');
processFile('/public/VBT/vbtontaphk2.html', 'vbtontaphk2');
console.log('Processed injected login & firebase setup');
