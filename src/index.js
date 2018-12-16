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
    const userGroupByAddress = Util.groupByFieldValue(userInfos, "addressKey");

    const browser = await puppeteer.launch({
        headless: false
    });

    browser.on("targetchanged", async (target) => {
        const page = await target.page();
        if(page && page.url) {
            await page.waitFor(5000);
            await page.evaluate(() => {
                var chk_info = document.querySelectorAll("input[name=chk_info]");
                for(var i=0; i<chk_info.length; i++) {
                    chk_info[i].click();
                }
            });

            let url = await page.url();

            // 주문 완료 페이지, 주문 상세 페이지로 이동
            if(url.indexOf("OrderComplete/OrderComplete") > -1) {
                await page.waitFor("#txtcoupUseDAfter a");
                await page.click("#txtcoupUseDAfter a");

            }
            // 주문 상세 페이지, 주문
            else if(url.indexOf("MyPageOrderDetail/MyPageOrderDetail") > -1) {
                await page.waitFor(1000);

                let receiverName = await page.$eval('#CLbRcvrNm', el => el.innerText.trim());

                await page.waitFor("#btnReceiptPrint");
                await page.click("#btnReceiptPrint");

                let target = await page.$('#divCashReceipt .plyr_w');
                await target.screenshot({
                    path: receiverName + '.png',
                    type: 'png'
                });
            }
        }
    });

    for(groupKey in userGroupByAddress) {
        let orderGroup = userGroupByAddress[groupKey];

        if(groupKey === "곽성훈") {
            process(groupKey, Util.groupByFieldArrValue(orderGroup, "bookLinks"));
        }
    }

    async function process(groupKey, orderGroup) {
        const page = await browser.newPage();

        const login = new Login(page, Config.id, Config.pw);
        await login.process();

        const purchase = new Purchase(page, groupKey, orderGroup, Config.phone, Config.nId, Config.nPw);
        await purchase.process();
    }
})();