import { pageLogin } from "./page/login.js";
import pageRegister from "./page/register.js";
import pageMain from "./page/main.js"

export default (function() {
    
    let root;

    let loginPage = {
        id: "loginPage",
        render: function (root) {
            pageLogin.render(root);
        }
    };

    let registerPage = {
        id: "registerPage",
        render: function (root) {
            pageRegister.render(root);
        }
    };

    let mainPage = {
        id: "mainPage",
        render: function (root) {
            pageMain.render(root);
        }
    };

    let pages = [loginPage, registerPage, mainPage]

    function _startPage(rootParam) {
        root = rootParam
        loginPage.render(root);
    }

    function _renderPage(pageId) {
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].id == pageId) {
                pages[i].render(root);
            }
        }
    }

    return {
        render: _renderPage,
        start: _startPage
    };
})();