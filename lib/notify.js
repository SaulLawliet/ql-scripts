
// 用 level 来控制把消息发送到不同的 Bot
// 个人用法: INFO(正常消息), DEBUG(静音消息)
async function telegram(title, content, level = '') {
    const TG_BOT_TOKEN = process.env['TG_BOT_TOKEN' + (level ? `_${level}` : '')] || process.env.TG_BOT_TOKEN;
    const TG_USER_ID = process.env.TG_USER_ID;

    if (TG_BOT_TOKEN && TG_USER_ID) {
        console.log('[Telegram]开始发送消息。');
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
        await axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, `chat_id=${TG_USER_ID}&text=${text}&disable_web_page_preview=true`, config).then((resp) => {
            if (resp.data.ok) {
                console.log('[Telegram]发送通知消息成功🎉。');
            }
        }).catch((err) => {
            console.error('[Telegram]失败:', err.message);
        });
    }
}

// 个人用来当作checklist使用
function bark(title, content, params={}) {
    const BARK_PUSH = process.env.BARK_PUSH;
    if (BARK_PUSH) {
        console.log('[Bark]开始发送消息。');
        const axios = require('axios');
        let url = `${BARK_PUSH}/${title}/${content}`;
        if (Object.keys(params).length > 0) {
            const querystring = require('querystring');
            url += '?' + querystring.stringify(params);
        }
        axios.get(url).then((resp) => {
            if (resp.data.code == 200) {
                console.log('[Bark]发送通知消息成功🎉。');
            } else {
                console.error('[Bark]失败:', resp.data.message);
            }
        }).catch((err) => {
            console.error('[Bark]失败:', err.message);
        });
    }
}

module.exports = {
    telegram,
    bark
}
