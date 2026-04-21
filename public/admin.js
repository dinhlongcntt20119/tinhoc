import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const ADMIN_EMAIL = "dinhlongcntt20119@gmail.com";

let db, auth;
let submissions = [];

// Navigation State
let currentView = 'grade'; // 'grade' | 'class' | 'student'
let selectedGrade = null;
let selectedClass = null;
let currentPage = 1;
const itemsPerPage = 20;

async function init() {
    const configRes = await fetch('/firebase-applet-config.json');
    const firebaseConfig = await configRes.json();
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
        experimentalForceLongPolling: true
    }, firebaseConfig.firestoreDatabaseId);

    const provider = new GoogleAuthProvider();

    // Elements
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminEmailEl = document.getElementById('admin-email');
    
    const searchInput = document.getElementById('search-input');
    const detailModal = document.getElementById('detail-modal');
    const closeModal = document.getElementById('close-modal');

    loginBtn.onclick = () => signInWithPopup(auth, provider);
    logoutBtn.onclick = () => signOut(auth);
    closeModal.onclick = () => detailModal.classList.add('hidden');
    
    detailModal.onclick = (e) => {
        if (e.target === detailModal) detailModal.classList.add('hidden');
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.email === ADMIN_EMAIL) {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                adminEmailEl.innerText = user.email;
                startListening();
            } else {
                alert("Bạn không có quyền truy cập trang này!");
                signOut(auth);
            }
        } else {
            loginSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
        }
    });

    function startListening() {
        const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
        onSnapshot(q, (snapshot) => {
            submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateStats();
            renderCurrentView();
        });
    }

    function updateStats() {
        document.getElementById('total-submissions').innerText = submissions.length;
        document.getElementById('unique-students').innerText = new Set(submissions.map(s => s.studentName)).size;
        document.getElementById('total-classes').innerText = new Set(submissions.map(s => s.studentClass)).size;
        
        const avg = submissions.length > 0 
            ? Math.round(submissions.reduce((a, b) => a + (b.score / b.totalQuestions), 0) / submissions.length * 100) 
            : 0;
        document.getElementById('avg-score').innerText = `${avg}%`;
    }

    // Breadcrumb and View Switching logic
    document.getElementById('bc-home').onclick = () => {
        if(currentView !== 'grade') {
            currentView = 'grade';
            selectedGrade = null;
            selectedClass = null;
            renderCurrentView();
        }
    };

    document.getElementById('bc-grade').onclick = () => {
        if(currentView === 'student') {
            currentView = 'class';
            selectedClass = null;
            renderCurrentView();
        }
    };

    window.selectGrade = (grade) => {
        selectedGrade = grade;
        currentView = 'class';
        renderCurrentView();
    };

    window.selectClass = (cls) => {
        selectedClass = cls;
        currentView = 'student';
        currentPage = 1;
        renderCurrentView();
    };

    function updateBreadcrumbs() {
        const breadcrumbs = document.getElementById('breadcrumbs');
        const bcSep1 = document.getElementById('bc-sep-1');
        const bcGrade = document.getElementById('bc-grade');
        const bcSep2 = document.getElementById('bc-sep-2');
        const bcClass = document.getElementById('bc-class');

        if (currentView === 'grade') {
            breadcrumbs.classList.add('hidden');
        } else if (currentView === 'class') {
            breadcrumbs.classList.remove('hidden');
            bcSep1.classList.remove('hidden');
            bcGrade.classList.remove('hidden');
            bcGrade.innerText = `Khối ${selectedGrade}`;
            bcGrade.classList.add('text-slate-800');
            bcGrade.disabled = true;
            bcSep2.classList.add('hidden');
            bcClass.classList.add('hidden');
        } else if (currentView === 'student') {
            breadcrumbs.classList.remove('hidden');
            bcSep1.classList.remove('hidden');
            bcGrade.classList.remove('hidden');
            bcGrade.innerText = `Khối ${selectedGrade}`;
            bcGrade.classList.remove('text-slate-800');
            bcGrade.disabled = false;
            bcSep2.classList.remove('hidden');
            bcClass.classList.remove('hidden');
            bcClass.innerText = `Lớp ${selectedClass}`;
        }
    }

    function renderCurrentView() {
        updateBreadcrumbs();
        
        document.getElementById('grade-view').classList.add('hidden');
        document.getElementById('class-view').classList.add('hidden');
        document.getElementById('student-view').classList.add('hidden');

        if (currentView === 'grade') {
            document.getElementById('grade-view').classList.remove('hidden');
            renderGradeView();
        } else if (currentView === 'class') {
            document.getElementById('class-view').classList.remove('hidden');
            renderClassView();
        } else if (currentView === 'student') {
            document.getElementById('student-view').classList.remove('hidden');
            renderStudentView();
        }
    }

    function renderGradeView() {
        const gradeView = document.getElementById('grade-view');
        const grades = [3, 4, 5];
        
        gradeView.innerHTML = grades.map(g => {
            const count = new Set(submissions.filter(s => s.grade == g).map(s => s.studentName)).size;
            const subCount = submissions.filter(s => s.grade == g).length;
            
            return `
                <button onclick="window.selectGrade(${g})" 
                    class="bg-[#0388e5] text-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:bg-[#0277cc] transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center group border border-[#026cbb]">
                    <svg class="w-12 h-12 mb-4 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <h3 class="text-2xl font-black mb-1">Khối ${g}</h3>
                    <p class="text-sm font-medium opacity-80">${count} học sinh (${subCount} bài)</p>
                </button>
            `;
        }).join('');
    }

    function renderClassView() {
        const classGrid = document.getElementById('class-grid');
        // Get unique classes for this grade that have submissions
        // Wait, what if there are no submissions yet for some classes? We might want to construct the list manually based on standard classes (4A->4H) or based on existing facts.
        // Let's rely on data that actually exists, but sort it logically.
        let classes = [...new Set(submissions.filter(s => s.grade == selectedGrade).map(s => s.studentClass))].sort();
        
        if (classes.length === 0) {
            classGrid.innerHTML = '<div class="w-full text-center py-10 text-gray-400 italic">Chưa có dữ liệu lớp học cho khối này.</div>';
            return;
        }

        classGrid.innerHTML = classes.map(c => {
            const count = new Set(submissions.filter(s => s.grade == selectedGrade && s.studentClass === c).map(s => s.studentName)).size;
            
            return `
                <button onclick="window.selectClass('${c}')" 
                    class="bg-white border-2 border-[#1565C0] text-[#1565C0] rounded-2xl py-6 px-10 flex flex-col items-center justify-center hover:bg-[#1565C0] hover:text-white transition-all shadow-sm hover:shadow-md md:w-auto w-[calc(50%-0.5rem)]">
                    <span class="text-2xl font-black mb-1">${c}</span>
                    <span class="text-sm font-medium text-inherit opacity-80">${count} học sinh</span>
                </button>
            `;
        }).join('');
    }

    function renderStudentView() {
        const resultsBody = document.getElementById('results-body');
        const searchVal = searchInput.value.toLowerCase();
        document.getElementById('table-title').innerText = `Danh sách học sinh - Lớp ${selectedClass}`;

        let filtered = submissions.filter(s => 
            s.grade == selectedGrade && 
            s.studentClass === selectedClass
        );

        if (searchVal) {
            filtered = filtered.filter(s => 
                s.studentName.toLowerCase().includes(searchVal) || 
                s.lessonTitle.toLowerCase().includes(searchVal)
            );
        }

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const paginatedData = filtered.slice(startIdx, endIdx);

        // Update Pagination UI
        document.getElementById('page-info').innerText = `Hiển thị ${totalItems > 0 ? startIdx + 1 : 0}-${Math.min(endIdx, totalItems)} trên ${totalItems}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;

        if (paginatedData.length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="8" class="p-10 text-center text-gray-400">Không tìm thấy kết quả nào.</td></tr>';
            document.getElementById('select-all-checkbox').checked = false;
            window.updateDeleteBtnState();
            return;
        }

        resultsBody.innerHTML = paginatedData.map(s => {
            const date = s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleString('vi-VN') : 'Đang xử lý...';
            const percent = Math.round((s.score / s.totalQuestions) * 100);
            const scoreColor = percent >= 80 ? 'text-green-600' : (percent >= 50 ? 'text-orange-500' : 'text-red-500');

            return `
                <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-4 text-center">
                        <input type="checkbox" value="${s.id}" class="student-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" onchange="window.updateDeleteBtnState()">
                    </td>
                    <td class="px-4 py-4 font-semibold text-slate-800">
                        <button onclick="window.viewDetails('${s.id}')" class="hover:text-blue-600 hover:underline transition-all text-left">
                            ${s.studentName}
                        </button>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 font-bold">${s.studentClass}</td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-600">${s.lessonTitle.split('/').pop()}</td>
                    <td class="px-6 py-4 text-center text-sm">${s.grade}</td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-3 py-1 rounded-full bg-gray-100 font-bold text-sm ${scoreColor}">
                            ${s.score}/${s.totalQuestions}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-400 font-mono">${date}</td>
                    <td class="px-6 py-4 text-right">
                        <button onclick="window.deleteSubmission('${s.id}')" class="text-red-400 hover:text-red-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        const selectAllCb = document.getElementById('select-all-checkbox');
        if (selectAllCb) selectAllCb.checked = false;
        if (window.updateDeleteBtnState) window.updateDeleteBtnState();
    }

    searchInput.oninput = () => {
        currentPage = 1;
        renderStudentView();
    };

    document.getElementById('prev-page').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderStudentView();
        }
    };

    document.getElementById('next-page').onclick = () => {
        currentPage++;
        renderStudentView();
    };

    // Keep existing modal and delete logic
    window.viewDetails = (id) => {
        const s = submissions.find(x => x.id === id);
        if (!s) return;
        const modalStudentName = document.getElementById('modal-student-name');
        const modalLessonTitle = document.getElementById('modal-lesson-title');
        const modalContent = document.getElementById('modal-content');
        
        modalStudentName.innerText = s.studentName;
        modalLessonTitle.innerText = `${s.lessonTitle.split('/').pop()} - Lớp ${s.studentClass} - Khối ${s.grade}`;
        
        const scorePercent = Math.round(s.score / s.totalQuestions * 100);
        const scoreColorClass = scorePercent >= 80 ? 'bg-green-50 border-green-100 text-green-800' : (scorePercent >= 50 ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-red-50 border-red-100 text-red-800');

        let html = `
            <div class="${scoreColorClass} p-6 rounded-3xl border mb-6 flex justify-between items-center">
                <div>
                    <div class="text-xs font-bold uppercase tracking-widest opacity-60">Kết quả tổng quát</div>
                    <div class="text-3xl font-black">${s.score} / ${s.totalQuestions} (${scorePercent}%)</div>
                </div>
                <div class="text-4xl">
                    ${scorePercent >= 80 ? '🌟' : (scorePercent >= 50 ? '👍' : '📚')}
                </div>
            </div>
            <div class="space-y-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Chi tiết câu trả lời</div>
                    <div class="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">Sắp xếp theo thứ tự câu hỏi</div>
                </div>
        `;

        if (s.quizDetails && Array.isArray(s.quizDetails)) {
            s.quizDetails.forEach((item) => {
                const isCorrect = item.isCorrect;
                const statusColor = isCorrect ? 'border-green-200' : (item.selected ? 'border-red-200' : 'border-gray-200');
                const statusIcon = isCorrect ? '✅' : (item.selected ? '❌' : '⚪');
                
                html += `
                    <div class="bg-white p-4 rounded-2xl border ${statusColor} shadow-sm space-y-2">
                        <div class="flex justify-between items-start gap-3">
                            <span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0">CÂU ${item.qNum}</span>
                            <p class="text-sm font-semibold text-slate-800 flex-grow">${item.qText || 'Đang cập nhật nội dung câu hỏi...'}</p>
                            <span class="shrink-0">${statusIcon}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-50">
                            <div>
                                <div class="text-[10px] text-gray-400 uppercase font-bold">Học sinh chọn</div>
                                <div class="text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-slate-700'}">${item.answerText || item.selected || 'N/A'}</div>
                            </div>
                            ${!isCorrect ? `
                            <div>
                                <div class="text-[10px] text-gray-400 uppercase font-bold">Đáp án đúng</div>
                                <div class="text-sm font-bold text-blue-600">${item.correctAnswer?.toUpperCase() || 'N/A'}</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        } else if (s.details) {
            html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-2">';
            Object.entries(s.details).forEach(([key, val]) => {
                html += `
                    <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                        <span class="text-xs font-bold text-gray-500">${key.toUpperCase()}</span>
                        <span class="text-sm font-bold text-slate-700">${val.toUpperCase()}</span>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<p class="text-sm text-gray-400 italic text-center py-10">Không có dữ liệu chi tiết cho bài làm này.</p>';
        }

        html += '</div>';
        document.getElementById('modal-content').innerHTML = html;
        document.getElementById('detail-modal').classList.remove('hidden');
    };

    window.deleteSubmission = async (id) => {
        if (confirm("Chắc chắn muốn xóa kết quả này?")) {
            const btn = event?.currentTarget;
            if (btn) btn.disabled = true;
            try {
                await deleteDoc(doc(db, "submissions", id));
                // onSnapshot will handle the UI update automatically
            } catch (err) {
                console.error("Delete failed:", err);
                alert(`Xóa thất bại. Lỗi: ${err.message}`);
                if (btn) btn.disabled = false;
            }
        }
    };

    window.toggleSelectAll = (source) => {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(cb => cb.checked = source.checked);
        window.updateDeleteBtnState();
    };

    window.updateDeleteBtnState = () => {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        const btn = document.getElementById('delete-selected-btn');
        const countSpan = document.getElementById('selected-count');
        const selectAllCb = document.getElementById('select-all-checkbox');
        
        const allCheckboxes = document.querySelectorAll('.student-checkbox');

        if (checkboxes.length > 0) {
            btn.classList.remove('hidden');
            countSpan.innerText = checkboxes.length;
        } else {
            btn.classList.add('hidden');
        }

        if (allCheckboxes.length > 0 && checkboxes.length === allCheckboxes.length) {
            selectAllCb.checked = true;
        } else {
            selectAllCb.checked = false;
        }
    };

    window.deleteSelectedSubmissions = async () => {
        const checkboxes = document.querySelectorAll('.student-checkbox:checked');
        if (checkboxes.length === 0) return;

        if (confirm(`Bạn có chắc chắn muốn xóa ${checkboxes.length} kết quả đã chọn?`)) {
            const btn = document.getElementById('delete-selected-btn');
            btn.disabled = true;
            btn.innerHTML = 'Đang xóa...';
            
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < checkboxes.length; i++) {
                const id = checkboxes[i].value;
                try {
                    await deleteDoc(doc(db, "submissions", id));
                    successCount++;
                } catch (err) {
                    console.error("Delete failed for ID " + id, err);
                    failCount++;
                }
            }

            if (failCount > 0) {
                alert(`Đã xóa thành công ${successCount} mục. Có ${failCount} mục bị lỗi.`);
            }

            // Reset UI
            btn.innerHTML = `Xóa mục đã chọn (<span id="selected-count">0</span>)`;
            btn.disabled = false;
            document.getElementById('select-all-checkbox').checked = false;
            window.updateDeleteBtnState();
        }
    };
}

init();

