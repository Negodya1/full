import { User } from "../../apiModel/userModel.js";

class pageLogin{

    constructor(newRouter){
        this.root = undefined;
        this.router = newRouter;
        this.userModel = new User();
    }

    mainPageDisplay() {
        this.router.renderPage("mainPage");
    }

    registerButtonClicked() {
        this.router.renderPage("registerPage");
    }

    loginButtonClicked() {
        if (document.getElementById('login').value == '' || document.getElementById('password').value == '') {
            if (document.getElementById('errLogin') != null) {
                document.getElementById('loginDiv').removeChild(document.getElementById('errLogin'));
            }
            let errP = document.createElement('p');
            errP.id = 'errLogin';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Failed to Login! Empty Login or Password!';
            document.getElementById('loginDiv').appendChild(errP);
            return;
        }
        else this.authQuerry(document.getElementById('login').value, document.getElementById('password').value);
    }

    async authQuerry(login, password) {
        let user = {
            login: login,
            password: password,
            email: undefined
        }

        this.userModel.setUser(user);
        let response = await this.userModel._authQuery();

        let status = response.status;
        response = response.text;

        if (status == 200) {
            localStorage.setItem('WFSAppUserToken', JSON.stringify(response));
            if (document.getElementById('errLogin') != null) {
                document.getElementById('loginDiv').removeChild(document.getElementById('errLogin'));
            }
            let errP = document.createElement('p');
            errP.id = 'errLogin';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: blue; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Logined! Please, wait for pesponse...';
            document.getElementById('loginDiv').appendChild(errP);
            this.renderPage();
            return;
        }
        else if (status == 401) {
            if (document.getElementById('errLogin') != null) {
                document.getElementById('loginDiv').removeChild(document.getElementById('errLogin'));
            }
            let errP = document.createElement('p');
            errP.id = 'errLogin';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Failed to Login! Invalid Login or Password.';
            document.getElementById('loginDiv').appendChild(errP);
        }
        else {
            if (document.getElementById('errLogin') != null) {
                document.getElementById('loginDiv').removeChild(document.getElementById('errLogin'));
            }
            let errP = document.createElement('p');
            errP.id = 'errLogin';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Server error! Try again or try again later.';
            document.getElementById('loginDiv').appendChild(errP);
        }

    }

    loginPageDisplay() {
        
        root.innerHTML = '';

        let div = document.createElement('div');
        div.id = 'loginDiv';
        div.className = 'div-loginForm WrapCenteredInlineBlock';
        let header = document.createElement('p');
        header.innerText = "Web Project";
        div.appendChild(header);
        
        let p1 = document.createElement('p');
        let p2 = document.createElement('p');
    
        let inp1 = document.createElement('input');
        let inp2 = document.createElement('input');
    
        inp1.name = 'login';
        inp1.id = 'login';
        inp2.name = 'password';
        inp2.id = 'password';
        inp2.type = 'password';
    
        inp1.placeholder = 'Login';
        inp2.placeholder = 'Password';
    
        p1.appendChild(inp1);
        p2.appendChild(inp2);
    
    
        div.appendChild(p1);
        div.appendChild(p2);
    
    
        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');
        btn1.textContent = 'Login';
        btn1.type = 'submit';
        btn2.textContent = 'Register';
    
    
        let divBtn = document.createElement('div');
        divBtn.id = 'LoginButtons'
        divBtn.className = 'div-twoButtonsContainer';
    
        divBtn.appendChild(btn1);
        divBtn.appendChild(btn2);
    
        div.appendChild(divBtn);
        root.appendChild(div);
    
        btn1.addEventListener("click", this.loginButtonClicked.bind(this));
        inp1.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                this.loginButtonClicked();
            }
        });
    
        inp2.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                this.loginButtonClicked();
            }
        });
        btn2.addEventListener("click", this.registerButtonClicked.bind(this));
    }

    renderPage() {
        if(localStorage.getItem('WFSAppUserToken') == null) {
            this.loginPageDisplay();
        }
        else {
            this.mainPageDisplay();
        }
    }

    _init(rootParam) {
        this.root = rootParam; 
        this.renderPage();
    }

};

export {pageLogin};