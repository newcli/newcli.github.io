// 访问统计
async function loadStats() {
    try {
        const response = await fetch('https://cloud.umami.is/share/8wyuz6s73sMeOkDY/newcoder.life');
        const data = await response.json();
        document.getElementById('counter').textContent = `PV: ${data.pageviews.value}, UV: ${data.visitors.value}`;
    } catch (error) {
        console.error('统计加载失败:', error);
        document.getElementById('counter').textContent = "统计不可用";
    }
}

window.onload = loadStats;