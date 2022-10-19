var body = document.getElementById('body');

function startPage(){
    if(localStorage.getItem('WFSAppUserToken') == null || checkUserToken() == false){
        loginForm();
    }
    else{
        displayMainPage();
    }
}

function displayMainPage(){
    if(document.getElementById('loginDiv') != null){
        body.removeChild(document.getElementById('loginDiv'));
    }

    var mainpage = document.createElement('div');
    mainpage.id = 'mainPage';

    var btn_exit = document.createElement('button');

    btn_exit.textContent = 'Exit';
    btn_exit.addEventListener("click", function(){
        localStorage.removeItem('WFSAppUserToken');
        body.removeChild(document.getElementById('mainPage'));
        startPage();
    });

    mainpage.appendChild(btn_exit);
    body.appendChild(mainpage);
}

function loginForm(){

    if(document.getElementById('registerDiv') != null){
        body.removeChild(document.getElementById('registerDiv'));
    }

    var div = document.createElement('div');
    div.id = 'loginDiv';
    div.className = 'div-loginForm WrapCenteredInlineBlock';
    
    var p1 = document.createElement('p');
    var p2 = document.createElement('p');

    var inp1 = document.createElement('input');
    var inp2 = document.createElement('input');

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


    var btn1 = document.createElement('button');
    var btn2 = document.createElement('button');
    btn1.textContent = 'Login';
    btn1.type = 'submit';
    btn2.textContent = 'Register';


    var divBtn = document.createElement('div');
    divBtn.id = 'LoginButtons'
    divBtn.className = 'div-twoButtonsContainer';

    divBtn.appendChild(btn1);
    divBtn.appendChild(btn2);

    div.appendChild(divBtn);
    body.appendChild(div);

    btn1.addEventListener("click", loginButtonClicked);
    inp1.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            loginButtonClicked();
        }
    });

    inp2.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            loginButtonClicked();
        }
    });

    btn2.addEventListener("click", registerPageDisplay);

}

function registerPageDisplay(){
    body.removeChild(document.getElementById('loginDiv'));
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
    btn1.textContent = 'Reg and Login';
    btn2.textContent = 'Go Back';

    var divBtn = document.createElement('div');
    divBtn.id = 'RegisterButtons'
    divBtn.className = 'div-twoButtonsContainer';

    divBtn.appendChild(btn1);
    divBtn.appendChild(btn2);

    div.appendChild(divBtn);
    body.appendChild(div);

    btn1.addEventListener("click", registerButtonClicked);
    btn2.addEventListener("click", loginForm);

    inp1.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            registerButtonClicked();
        }
    });

    inp2.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            registerButtonClicked();
        }
    });

    inp3.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            registerButtonClicked();
        }
    });
}

function loginButtonClicked(){
    if((document.getElementById('login').value == '' || document.getElementById('password').value == '') && document.getElementById('errLogin') == null){
        var errP = document.createElement('p');
        errP.id = 'errLogin';
        errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
        errP.innerText = 'Failed to Login! Error: Empty Login or Password!';
        document.getElementById('loginDiv').appendChild(errP);
        return;
    }
    else authQuerry(document.getElementById('login').value, document.getElementById('password').value);
}

function authQuerry(username, password){
    var xhr = new XMLHttpRequest();
    
    var authUser = {
        login: username,
        password: password
    }

    var flagAsync = true;
    xhr.open("POST", "api/checkUser", flagAsync);

    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
    
        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)
    
        if (xhr.status !== 200) {  
            console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
        } 
        else { 
            //console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);   
            setTimeout(authLogic(response, username), 0);
        } 
       
        // получить результат из this.responseText или this.responseXML
    }

    xhr.send(JSON.stringify(authUser));
}

function authLogic(response){
    if(response.payload !== null && response.payload !== undefined){

        localStorage.setItem('WFSAppUserToken', JSON.stringify(response));

        if(document.getElementById('errLogin') != null){
            document.getElementById('loginDiv').removeChild(document.getElementById('errLogin'));
        }else{
            var errP = document.createElement('p');
            errP.id = 'errLogin';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: blue; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Logined! Please, wait for pesponse...';
            document.getElementById('loginDiv').appendChild(errP);
        }
        startPage();
        return;
    }

    if(document.getElementById('errLogin') == null){
        var errP = document.createElement('p');
        errP.id = 'errLogin';
        errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
        errP.innerText = 'Failed to Login! Error: Invalid Login or Password!';
        document.getElementById('loginDiv').appendChild(errP);
    }
}

function checkUserToken(){
    var xhr = new XMLHttpRequest();
    
    var flagAsync = true;
    xhr.open("GET", "api/getData", flagAsync);

    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
    
        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)
    
        if (xhr.status !== 200) {  
            console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
        } 
        else { 
            //console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if(response == 'tokenError') return false;
            return true;
        } 
       
        // получить результат из this.responseText или this.responseXML
    }

    var token = {
        cryptoXBOCT: JSON.parse(localStorage.getItem('WFSAppUserToken')).cryptoXBOCT,
        payload: JSON.parse(localStorage.getItem('WFSAppUserToken')).payload
    }

    xhr.send(JSON.stringify(token));
}

function registerButtonClicked(){
    if((document.getElementById('new_login').value == '' || document.getElementById('new_password').value == '' || document.getElementById('new_email').value == '') && document.getElementById('errRegister') == null){
        var errP = document.createElement('p');
        errP.id = 'errRegister';
        errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
        errP.innerText = 'Failed to Register! Error: Empty Login or Password!';
        document.getElementById('registerDiv').appendChild(errP);
        return;
    }else setTimeout(registerQuery(document.getElementById('new_login').value, document.getElementById('new_password').value, document.getElementById('new_email').value), 0); 
}

function registerQuery(username, password, email){

    var user = {
        login : username,
        password : password,
        email : email
    };

    var xhr = new XMLHttpRequest();
    var flagAsync = true;
    var uri = "./api/createUser";

    xhr.open("POST", uri, flagAsync)
    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState != 4) return;

        if(xhr.status !== 200){
            console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
        }else{
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            setTimeout(registerLogic(response), 0);
        }
    }

    xhr.send(JSON.stringify(user));
}

function registerLogic(response){
    if(response == "createUser_Ok_status"){
        if(document.getElementById('errRegister') == null){
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: blue; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'Register is complete! Please, go back to login!';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        }
        
        if(document.getElementById('errRegister') != null){
            if(document.getElementById('errRegister').innerText == 'User already exist or undefined error! Try another login or email!'){
                document.getElementById('errRegister').style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: blue; font-size: 0.8em; font-weight: bold;';
                document.getElementById('errRegister').innerText = 'Register is complete! Please, go back to login!';
            }
        }

    }else if(response == "userIsExistStatus"){
        if(document.getElementById('errRegister') == null){
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'User already exist or undefined error! Try another login or email!';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        }else{
            if(document.getElementById('errRegister').innerText == 'Register is complete! Please, go back to login!'){
                document.getElementById('errRegister').style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
                document.getElementById('errRegister').innerText = 'User already exist or undefined error! Try another login or email!';
            }
        }
    }else{
        if(document.getElementById('errRegister') == null){
            var errP = document.createElement('p');
            errP.id = 'errRegister';
            errP.style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
            errP.innerText = 'User already exist or undefined error! Try another login or email!';
            document.getElementById('registerDiv').appendChild(errP);
            return;
        }else{
            if(document.getElementById('errRegister').innerText == 'Register is complete! Please, go back to login!'){
                document.getElementById('errRegister').style = 'display: flex; width: 150px; justify-content: space-around; flex:auto; color: red; font-size: 0.8em; font-weight: bold;';
                document.getElementById('errRegister').innerText = 'User already exist or undefined error! Try another login or email!';
            }
        }
    }
}

startPage();