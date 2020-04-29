import * as https from "https";
import * as queryString from "querystring";
import * as secret from "./private";
import md5 = require("md5");

export function translate(word: string) {
    let language: object;
    if(/^[a-zA-z]+$/.test(word)) {
        language = {
            from: 'en',
            to: 'zh'
        };
    } else {
        language = {
            from: 'zh',
            to: 'en'
        };
    }
    const salt: number = Math.floor(Math.random() * 10000000000);
    const sign: string = md5(`${secret.appID}${word}${salt}${secret.secretKey}`);
    const query: string = queryString.stringify(Object.assign({
        q: word,
        appid: secret.appID,
        salt,
        sign
    }, language));
    const options: object = {
        hostname: 'fanyi-api.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };

    const req = https.request(options, (response) => {
        let chunks: Buffer[] = [];
        response.on('data', (data) => {
            chunks.push(data);
        });
        response.on('end', () => {
            const data: string = Buffer.concat(chunks).toString();
            type response = {
                error_code?: string,
                error_msg?: string,
                trans_result?: result[]
            }
            type result = {
                src: string
                dst: string
            }
            const parsedData: response = JSON.parse(data);
            if (parsedData.error_code) {
                console.log(parsedData.error_msg);
            } else {
                console.log(parsedData.trans_result[0].dst);
            }
        })
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
}