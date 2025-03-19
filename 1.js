let arr = [ /* 你的原始数组数据保持不变 */ ];

// 遍历数组发送请求
arr.forEach((item) => {
    fetch("https://products-api-o2o-prod.gs-souvenir.com/retailer/page/saveOrUpdatePageImg", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuaWNrTmFtZSI6IiIsImlkIjo0NDcsImV4cCI6MTc0MjA5MDQwN30.c3J_GEc5m3eDShWGzYUjH__YoG_tPWFhkSA7z4TYO2M",
            "Referer": "https://o2omanage.o2o.co/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify({
            "proId": 512,
            "language": "en-us",
            "id": "",
            "pageId": 132215,
            "url": item.img,
            "contentTitle": item.alt,
            "contentSubtitle": item.txt,
            "title": "",
            "alt": item.alt
        }),
        "method": "POST"
    });
});

// 提示信息
console.log('已开始批量发送请求，打开开发者工具查看网络请求状态');