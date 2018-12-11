/**
 * Created by JongHyeok Choi on 10/12/2018.
 */

const Process = require('./process');

class Login extends Process {
    /**
     * 로그인 객체 생성자
     * @param page
     * @param id
     * @param pw
     */
    constructor(page, id, pw) {
        super();

        if(!page || !id || !pw) {
            throw("page, id, pw가 없습니다.");
        }

        this.page = page;
        this.id = id;
        this.pw = pw;
        this.loginPage = "https://www.yes24.com/Templates/FTLogin.aspx";
    }

    /**
     * 로그인 작업
     * @returns {Promise.<void>}
     */
    async process() {
        const page = this.page;
        await page.goto(this.loginPage);

        // ID 입력
        await page.waitFor("#SMemberID");
        await page.click("#SMemberID");
        await page.keyboard.type(this.id);

        // PW 입력
        await page.click("#SMemberPassword");
        await page.keyboard.type(this.pw);

        // Login 버튼
        await page.click("#btnLogin");

        // Login 대기(TODO 대기하지 않으면 바로 다음 프로세스로 넘어가서 세션이 유지되지 않는 현상 있음)
        await page.waitFor(3000);
    }
}

module.exports = Login;