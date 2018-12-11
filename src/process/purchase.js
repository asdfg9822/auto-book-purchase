/**
 * Created by JongHyeok Choi on 10/12/2018.
 */

const Process = require('./process');

class Purchase extends Process {
    /**
     * 생성자
     * @param page
     */
    constructor(page) {
        super();

        if(!page) {
            throw("page 객체가 없습니다.");
        }
        this.page = page;
    }

    /**
     * 구매 작업
     * @returns {Promise.<void>}
     */
    async process() {
        const page = this.page;

        // 카트  페이지 이동 -> 카트 초기화
        await this.goCartPageAndClearCart();

        // 책 페이지 이동 -> 주문 추가
        await this.goBookPageAndAddOrder();

        // 카트 페이지 -> (옵션) 선물 페이지 -> 주문 페이지
        await this.goCartPageAndGoOrderPage();

        // 주문 작성
        await this.writeOrder("본사");
    }

    async writeOrder(addressKey) {
        const page = this.page;

        // 주소록 클릭
        await page.waitFor("#rdoDelvAddrSetModeList");
        await page.click("#rdoDelvAddrSetModeList");
        const addressLink = await page.evaluateHandle((addressKey) => {
            const tds = document.querySelectorAll('#divAddressListMember td[valign=top]:nth-child(2)');
            for(var i=0; i<tds.length; i++) {
                if (tds[i].innerText.trim() === addressKey) {
                    return tds[i].firstElementChild;
                }
            }
        }, addressKey);

        const addressLinkElementHandle = addressLink.asElement();
        await addressLinkElementHandle.click();

        // 주소록 전화 번호 -> 배송 시 SMS 전화번호 동기화
        await page.evaluate(() => {
            document.querySelector("#ddlAddrMobNo1").value = document.querySelector("#ddlRcvrMobTelNo1Normal").value;
            document.querySelector("#txtAddrMobNo2").value = document.querySelector("#txtRcvrMobTelNo2Normal").value;
            document.querySelector("#txtAddrMobNo3").value = document.querySelector("#txtRcvrMobTelNo3Normal").value;
            return;
        });

        // 하루 배송 선택
        await addressLinkElementHandle.click("#rdoDelvMethodTomorrow");
    }

    async goBookPageAndAddOrder() {
        await this.goBookPageByURL("http://www.yes24.com/24/Goods/65050088?Acode=101");
        await this.plusBuyCount(2);
        await this.addCurrentBookInCart();
    }

    async goCartPageAndGoOrderPage() {
        const page = this.page;

        await this.goCartPage();
        await page.waitFor(1000);

        page.waitFor("#btnOrderCart");
        page.click("#btnOrderCart");

        page.waitFor(2000);

        const isOrderGiftPage = page.evaluate(() => {
            return location.href.indexOf("OrderGift/OrderGift") > -1;
        });

        // Gift 선택 페이지 일 경우
        if(isOrderGiftPage) {
            // 모든 Gift 선택하지 않음
            const noGiftBtns = await page.$$("input[type=radio][eveno='0']");
            for(var i=0; i<noGiftBtns.length; i++) {
                await noGiftBtns[i].click();
            }

            // 아래 확인 버튼이 눌릴 경우
            async function dialogOk(dialog) {
                await page.removeListener('dialog', dialogOk);
                dialog.accept();
                await page.waitFor(1000);
            }
            page.on('dialog', dialogOk);

            // 확인 버튼
            await page.waitFor("img[src='https://secimage.yes24.com/sysimage/orderN/b_confirm.gif']");
            await page.click("img[src='https://secimage.yes24.com/sysimage/orderN/b_confirm.gif']");
        } else {
            await page.waitFor(1000);
        }
    }

    /**
     * 해당 URL로 이동
     * @param url
     * @returns {Promise.<void>}
     */
    async goBookPageByURL(url) {
        const page = this.page;
        await page.goto(url);
    }

    /**
     * Cart 페이지로 이동
     * @returns {Promise.<void>}
     */
    async goCartPage() {
        const page = this.page;
        await page.goto("http://ssl.yes24.com/Cart/Cart");
    }

    /**
     * count에 넘어온 인자만큼 책 구매 횟수 증가
     * @param count
     * @returns {Promise.<void>}
     */
    async plusBuyCount(count) {
        const page = this.page;
        count = count || 0;

        await page.waitFor(".bgGD.plus");
        for(var i=0; i<count; i++) {
            await page.click(".bgGD.plus");
        }
    }

    async addCurrentBookInCart() {
        const page = this.page;
        await page.waitFor("#addToCartForDetail");
        await page.click("#addToCartForDetail");

        await page.waitFor(1000);
    }

    /**
     * 카트에 담긴 책들을 초기화 한다.
     * @returns {Promise.<void>}
     */
    async goCartPageAndClearCart() {
        const page = this.page;

        await this.goCartPage();
        await page.waitFor(1000);

        const ordlst = await page.$$(".bw.ordlst");
        for(var i=0; i<ordlst.length; i++) {
            await ordlst[i].click();
        }
    }
}

module.exports = Purchase;