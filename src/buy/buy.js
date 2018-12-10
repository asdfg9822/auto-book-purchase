/**
 * Created by JongHyeok Choi on 10/12/2018.
 */

class Buy {
    /**
     * 생성자
     * @param page
     */
    constructor(page) {
        if(!page) {
            throw("page 객체가 없습니다.");
        }
        this.page = page;
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
    async clearCart() {
        const page = this.page;
        const ordlst = await page.$$(".bw.ordlst");
        for(var i=0; ordlst.length; i++) {
            await ordlst[i].click();
        }
    }
}

module.exports = Buy;