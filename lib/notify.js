
// 用 level 来控制把消息发送到不同的 Bot
// 个人用法: INFO(正常消息), DEBUG(静音消息)
async function telegram(title, content, level = '') {
    return new Promise((resolve) => {
        const TG_BOT_TOKEN = process.env['TG_BOT_TOKEN' + (level ? `_${level}` : '')] || process.env.TG_BOT_TOKEN;
        const TG_USER_ID = process.env.TG_USER_ID;
        if (!TG_BOT_TOKEN || !TG_USER_ID) {
            resolve();
        }
        let config = {};
        if (process.env.ProxyUrl) {
            const ProxyAgent = require('https-proxy-agent');
            config = { httpsAgent: ProxyAgent(process.env.ProxyUrl) };
        }
        let text = title;
        if (content) {
            text += `\n\n${content}`;
        }

        const axios = require('axios');
        // https://core.telegram.org/bots/api#sendmessage
        axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, `chat_id=${TG_USER_ID}&text=${text}&disable_web_page_preview=true`, config).then((resp) => {
            if (resp.data.ok) {
                console.log('[Telegram]发送通知消息成功🎉。');
            }
            resolve(data);
        }).catch((err) => {
            console.error(`[Telegram]发送失败:`, err.message, '  不再尝试。');
            reject();
        });
    });
}

// 个人用来当作checklist使用
function bark(title, content, params={}) {
    return new Promise((resolve) => {
        const BARK_PUSH = process.env.BARK_PUSH;
        if (!BARK_PUSH) {
            resolve();
        }
        const axios = require('axios');
        let url = `${BARK_PUSH}/${title}/${content}`;
        if (Object.keys(params).length > 0) {
            const querystring = require('querystring');
            url += '?' + querystring.stringify(params);
        }
        axios.get(url).then((resp) => {
            if (resp.data.code == 200) {
                console.log('[Bark]发送通知消息成功🎉。');
                resolve(resp.data);
            } else {
                console.error('[Bark]失败:', resp.data.message);
                reject();
            }
        }).catch((err) => {
            console.error('[Bark]失败:', err.message);
            reject();
        });
    });
}

module.exports = {
    telegram,
    bark
}
