const fs = require('fs');
let html = fs.readFileSync('public/VBT/vbtontaphk2.html', 'utf8');

let customAlertCode = `
<div id="custom-alert-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;">
    <div style="background: white; padding: 30px; border-radius: 10px; width: 350px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <p id="custom-alert-msg" style="font-size: 16px; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.5;"></p>
        <button onclick="document.getElementById('custom-alert-overlay').style.display='none'" style="padding: 10px 20px; background: #0056b3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Đóng</button>
    </div>
</div>
<script>
window.alert = function(msg) {
    document.getElementById('custom-alert-msg').textContent = msg;
    document.getElementById('custom-alert-overlay').style.display = 'flex';
};
</script>
`;

let bodyTag = html.indexOf('<body>');
if (bodyTag !== -1) {
    html = html.substring(0, bodyTag + 6) + '\\n' + customAlertCode + html.substring(bodyTag + 6);
} else {
    let htmlStart = html.indexOf('</head>');
    html = html.substring(0, htmlStart + 7) + '\\n<body>' + customAlertCode + html.substring(htmlStart + 7);
}

fs.writeFileSync('public/VBT/vbtontaphk2.html', html);
console.log('Custom alert injected!');
