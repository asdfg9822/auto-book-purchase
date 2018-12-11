/**
 * Created by JongHyeok Choi on 10/12/2018.
 */

const puppeteer = require('puppeteer');
const Config = require('./config');
const Login = require('./process/login');
const Purchase = require('./process/purchase');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })

    const page = await browser.newPage();

    const login = new Login(page, Config.id, Config.pw);
    await login.process();

    const purchase = new Purchase(page);
    await purchase.process();
})();