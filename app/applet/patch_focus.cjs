const fs = require('fs');
let html = fs.readFileSync('public/VBT/vbtontaphk2.html', 'utf8');

// The new alert logic with focus
let newAlertLogic = `
<div id="custom-alert-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;">
    <div style="background: white; padding: 30px; border-radius: 10px; width: 350px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <p id="custom-alert-msg" style="font-size: 16px; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.5;"></p>
        <button onclick="closeCustomAlert()" style="padding: 10px 20px; background: #0056b3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Đóng</button>
    </div>
</div>
<script>
window.alert = function(msg) {
    document.getElementById('custom-alert-msg').textContent = msg;
    document.getElementById('custom-alert-overlay').style.display = 'flex';
};

function closeCustomAlert() {
    document.getElementById('custom-alert-overlay').style.display = 'none';
    const firstMissing = document.querySelector('.missing-alert');
    if (firstMissing) {
        firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus if it's an input/textarea
        const input = firstMissing.querySelector('input, textarea') || (firstMissing.tagName === 'INPUT' || firstMissing.tagName === 'TEXTAREA' ? firstMissing : null);
        if (input) {
            setTimeout(() => input.focus(), 500); 
        }
    }
}
</script>
`;

// Find the old alert block
let startPattern = '<div id="custom-alert-overlay"';
let startIdx = html.indexOf(startPattern);
let endPattern = '</script>';
let endIdx = html.indexOf(endPattern, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + newAlertLogic + html.substring(endIdx + 9);
}

fs.writeFileSync('public/VBT/vbtontaphk2.html', html);
console.log('Fixed alert focus logic!');
