import{pageLogin}from "./page/login.js";
import{pageRegister}from "./page/register.js";
import{pageMain}from "./page/main.js";  

class Router{

    constructor(){
        this.root = undefined;

        this.LoginPage = {
            page: new pageLogin(this),
            id: "loginPage",
            render: (root) => {
                this.LoginPage.page._init(root);
            }
        };
    
        this.registerPage = {
            page: new pageRegister(this),
            id: "registerPage",
            render: (root) => {
                this.registerPage.page._init(root);
            }
        };
    
        this.MainPage = {
            page: new pageMain(this),
            id: "mainPage",
            render: (root) => {
                this.MainPage.page._init(root);
            }
        };
    
        //let pages = [loginPage, registerPage, mainPage];

        this.pages = [this.LoginPage, this.MainPage, this.registerPage];

    }

    _startPage(rootParam) {
        this.root = rootParam
        this.LoginPage.render(root);
    }

    renderPage(pageId) {
        for (let i = 0; i < this.pages.length; i++) {
            if (this.pages[i].id == pageId) {
                this.pages[i].render(root);
            }
        }
    }

}

export {Router};