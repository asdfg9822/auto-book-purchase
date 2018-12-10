/**
 * Created by JongHyeok Choi on 10/12/2018.
 */

const puppeteer = require('puppeteer');
const Config = require('./config');
const Login = require('./login/login');
const Buy = require('./buy/buy');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })

    const page = await browser.newPage();

    const login = new Login(page, Config.id, Config.pw);
    await login.loginProcess();

    const buy = new Buy(page);
    await buy.goBookPageByURL("http://www.yes24.com/24/Goods/65050088?Acode=101");
    await buy.plusBuyCount(2);
    await buy.addCurrentBookInCart();
    await buy.goCartPage();

    await page.waitFor(3000);
    await buy.clearCart();
})();