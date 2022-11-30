import router from "../router.js";
import { userModel } from "../../apiModel/userModel.js";

export default (function() {
    let root = undefined;

    function loginButtonClicked() {
        router.render("loginPage");
    }

    function registerButtonClicked() {
        if (document.getElementById('new_login').value == '' || document.getElementById('new_password').value == '' || document.getElementById('new_email').value == '') {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            let errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Failed to Register! Empty Login or Password!';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        } else registerQuery(document.getElementById('new_login').value, document.getElementById('new_password').value, document.getElementById('new_email').value); 
    }

    function registerQuerryCallback(response, status) {
        if (status == 200) {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            let errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: blue; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Register is complete! Please, go back to login.';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        } else if (status == 401) {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            let errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'User already exist! Try another login or email.';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        } else {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            let errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Server error! Try again.';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        }
    }

    function registerQuery(login, password, email) {

        let user = {
            login: login,
            password: password,
            email: email
        };

        userModel.setUser(user);
        userModel.setCallback(registerQuerryCallback);

        userModel._registerQuery();
    }

    function registerPageDisplay() {
        root.innerHTML = '';
        let div = document.createElement('div');
        div.id = 'registerDiv';
        div.className = 'div-loginForm WrapCenteredInlineBlock';
        
        let p1 = document.createElement('p');
        let p2 = document.createElement('p');
        let p3 = document.createElement('p');
    
        let inp1 = document.createElement('input');
        let inp2 = document.createElement('input');
        let inp3 = document.createElement('input');
    
        inp1.name = 'new_login';
        inp1.id = 'new_login';
        inp2.name = 'new_password';
        inp2.id = 'new_password';
        inp2.type = 'new_password';
        inp3.name = 'new_email';
        inp3.id = 'new_email';
    
        inp1.placeholder = 'New Login';
        inp2.placeholder = 'New Password';
        inp3.placeholder = 'New E-Mail';
    
        p1.appendChild(inp1);
        p2.appendChild(inp2);
        p3.appendChild(inp3);
    
    
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
    
        let btn1 = document.createElement('button');
        let btn2 = document.createElement('button');
        btn1.textContent = 'Register';
        btn2.textContent = 'Back';
    
        let divBtn = document.createElement('div');
        divBtn.id = 'RegisterButtons'
        divBtn.className = 'div-twoButtonsContainer';
    
        divBtn.appendChild(btn1);
        divBtn.appendChild(btn2);
    
        div.appendChild(divBtn);
        root.appendChild(div);
    
        btn1.addEventListener("click", registerButtonClicked);
        btn2.addEventListener("click", loginButtonClicked);
    
        inp1.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                registerButtonClicked();
            }
        });
    
        inp2.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                registerButtonClicked();
            }
        });
    
        inp3.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                registerButtonClicked();
            }
        });
    }

    function renderPage() {
        registerPageDisplay();
    }

    function init(rootParam) {
        root = rootParam; 
        renderPage();
    }

    return {
        render: init  
    };
})();