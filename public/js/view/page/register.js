var pageRegister = (function() {
    var root = undefined;

    function loginButtonClicked() {
        router.render("loginPage");
    }

    function registerButtonClicked() {
        if (document.getElementById('new_login').value == '' || document.getElementById('new_password').value == '' || document.getElementById('new_email').value == '') {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Failed to Register! Empty Login or Password!';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        } else registerQuerry(document.getElementById('new_login').value, document.getElementById('new_password').value, document.getElementById('new_email').value); 
    }

    function registerQuerryCallback(response, status) {
        if (status == 200) {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: blue; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Register is complete! Please, go back to login.';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        } else if (status == 401) {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'User already exist! Try another login or email.';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        } else {
            if (document.getElementById('errRegister') != null) {
                document.getElementById('registerDiv').removeChild(document.getElementById('errRegister'));
            }
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Server error! Try again.';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        }
    }

    function registerQuerry(login, password, email) {

        var user = {
            login: login,
            password: password,
            email: email
        };

        model.user.registration(user, registerQuerryCallback);
    }

    function registerPageDisplay() {
        root.innerHTML = '';
        var div = document.createElement('div');
        div.id = 'registerDiv';
        div.className = 'div-loginForm WrapCenteredInlineBlock';
        
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        var p3 = document.createElement('p');
    
        var inp1 = document.createElement('input');
        var inp2 = document.createElement('input');
        var inp3 = document.createElement('input');
    
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
    
        var btn1 = document.createElement('button');
        var btn2 = document.createElement('button');
        btn1.textContent = 'Register';
        btn2.textContent = 'Back';
    
        var divBtn = document.createElement('div');
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