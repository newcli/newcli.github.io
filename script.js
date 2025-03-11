// 获取最近24小时的时间戳范围
function getTimeRange() {
    const now = new Date();
    const endAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 59, 59, 999).getTime();
    const startAt = endAt - (24 * 60 * 60 * 1000) + 1;
    return { startAt, endAt };
}

// 获取分享token
async function getShareToken() {
    try {
        const response = await fetch('https://us.umami.is/api/share/8wyuz6s73sMeOkDY', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch share token');
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('获取token失败:', error);
        throw error;
    }
}

// 获取访问统计数据
async function getStats(token) {
    const { startAt, endAt } = getTimeRange();
    const timezone = 'Asia/Shanghai';
    
    try {
        const response = await fetch(`https://us.umami.is/api/websites/b1179632-20e3-451e-86c9-6b3546f4e80d/stats?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=${encodeURIComponent(timezone)}&compare=false`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-umami-share-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        return {
            pageviews: data.pageviews.value,
            visitors: data.visitors.value
        };
    } catch (error) {
        console.error('获取统计数据失败:', error);
        throw error;
    }
}

// 加载统计数据
async function loadStats() {
    try {
        const token = await getShareToken();
        const stats = await getStats(token);
        
        document.getElementById('counter').innerHTML = 
            `PV: <strong>${stats.pageviews || 0}</strong>, UV: <strong>${stats.visitors || 0}</strong>`;
    } catch (error) {
        console.error('统计加载失败:', error);
        document.getElementById('counter').textContent = "统计不可用";
    }
}

// 立即执行一次加载
loadStats();

// 设置定时更新
setInterval(loadStats, 5 * 60 * 1000);