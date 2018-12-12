/**
 * Created by JongHyeok Choi on 10/12/2018.
 */

const puppeteer = require('puppeteer');
const Config = require('./config');
const Util = require('./util/util');
const Login = require('./process/login');
const Purchase = require('./process/purchase');

(async () => {
    const userInfos = Util.convertCsvToObjs(Config.excelStr);
    const userGroupByAddress = Util.groupByFieldValue(userInfos, "address");

    const browser = await puppeteer.launch({
        headless: false
    });

    for(prop in userGroupByAddress) {
        let orderGroup = userGroupByAddress[prop];
        process(orderGroup);
    }

    async function process(orderGroup) {
        const page = await browser.newPage();

        const login = new Login(page, Config.id, Config.pw);
        await login.process();

        const purchase = new Purchase(page, orderGroup, Config.phone, Config.nId, Config.nPw);
        await purchase.process();
    }
})();