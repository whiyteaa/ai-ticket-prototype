/* 原型访问密码门：防止公网路人直接访问（演示级防护，非服务端安全）*/
/* 修改密码：把新密码的 SHA-256 hex 写入下方 PWD_HASH 后重新部署（明文不进仓库）*/
(function () {
  var PWD_HASH = 'd964f9a6fe8de8d6489b7854b5f61666c209ae9f9dd13ae3b3637bcad526145a';
  var KEY = 'ai_ticket_gate_ok';
  async function sha(s){
    var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(function(x){return x.toString(16).padStart(2,'0')}).join('');
  }
  try {
    if (sessionStorage.getItem(KEY) === '1') return;
  } catch (e) { /* sessionStorage 不可用时退化为每次都要输入 */ }

  var style = document.createElement('style');
  style.textContent = [
    '#gate-mask{position:fixed;inset:0;z-index:99999;background:linear-gradient(160deg,#EEF2FB,#F6F7F9);display:flex;align-items:center;justify-content:center;font-family:"Noto Sans SC Variable","PingFang SC","Microsoft YaHei",system-ui,sans-serif;}',
    '#gate-box{width:340px;background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(29,33,41,.16);padding:30px 28px;text-align:center;}',
    '#gate-ic{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#2454FF,#4d74ff);color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 14px;}',
    '#gate-box h1{font-size:17px;color:#1D2129;margin:0 0 6px;}',
    '#gate-box p{font-size:12px;color:#86909C;margin:0 0 18px;}',
    '#gate-in{width:100%;box-sizing:border-box;border:1.5px solid #E3E7EF;border-radius:10px;padding:11px 13px;font-size:14px;outline:none;text-align:center;letter-spacing:1px;}',
    '#gate-in:focus{border-color:#2454FF;box-shadow:0 0 0 3px rgba(36,84,255,.12);}',
    '#gate-btn{width:100%;margin-top:12px;border:0;border-radius:10px;background:#2454FF;color:#fff;font-size:14px;font-weight:600;padding:11px;cursor:pointer;}',
    '#gate-btn:hover{background:#1a40e0;}',
    '#gate-err{font-size:12px;color:#f53f3f;height:16px;margin-top:9px;}',
    '#gate-foot{font-size:11px;color:#C0C7D2;margin-top:10px;}'
  ].join('');
  document.head.appendChild(style);

  document.documentElement.style.visibility = 'hidden';
  function show() {
    var mask = document.createElement('div');
    mask.id = 'gate-mask';
    mask.innerHTML = '<div id="gate-box">'
      + '<div id="gate-ic">🛠</div>'
      + '<h1>智能售后工单助手 · 原型</h1>'
      + '<p>内部评审演示，请输入访问密码</p>'
      + '<input id="gate-in" type="password" placeholder="访问密码" autocomplete="off"/>'
      + '<button id="gate-btn">进入原型</button>'
      + '<div id="gate-err"></div>'
      + '<div id="gate-foot">受保护的演示环境 · 2026</div>'
      + '</div>';
    document.body.appendChild(mask);
    document.documentElement.style.visibility = '';
    var body = document.body.children;
    for (var i = 0; i < body.length; i++) { if (body[i] !== mask && body[i].tagName !== 'SCRIPT' && body[i].tagName !== 'STYLE') body[i].style.visibility = 'hidden'; }
    var input = document.getElementById('gate-in');
    input.focus();
    function unlock() {
      sha(input.value).then(function(h){
        if (h === PWD_HASH) {
          try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
          location.reload();
        } else {
          document.getElementById('gate-err').textContent = '密码不正确，请重试';
          input.value = ''; input.focus();
        }
      });
    }
    document.getElementById('gate-btn').onclick = unlock;
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') unlock(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
})();
