var body = document.getElementById('body');

function startPage(){
    if(localStorage.getItem('WFSAppUserToken') == null){
        loginForm();
        return;
    }

    displayMainPage();
}

function displayMainPage(){
    if(document.getElementById('loginDiv') != null){
        body.removeChild(document.getElementById('loginDiv'));
    }

    var mainpage = document.createElement('div');
    mainpage.id = 'mainPage';

    var btn_exit = document.createElement('button');
    btn_exit.className = "ExitButton";

    btn_exit.textContent = 'Exit';
    btn_exit.addEventListener("click", function(){
        localStorage.removeItem('WFSAppUserToken');
        body.removeChild(document.getElementById('mainPage'));
        body.removeChild(document.getElementById('MainMenu'));
        if(document.getElementById("productList") != null) body.removeChild(document.getElementById("productList"));


        startPage();
    });

    mainpage.appendChild(btn_exit);
    body.appendChild(mainpage);
    body.appendChild(mainMenu());
    getProductList();
}

function tasksCalendar(){

    var taskCalendar = document.createElement('div');
    taskCalendar.id = "taskCalendar";
    taskCalendar.className = "taskCalendar";

    var header = document.createElement('p');
    header.className = 'MenuHeader';

    return taskCalendar;
}

function productListMenu(response){

    if(response == 'tokenError'){
        alert("Ошибка авторизации! Пройдите авторизацию ещё раз!");
        localStorage.removeItem('WFSAppUserToken');
        if(document.getElementById("productList") != null) body.removeChild(document.getElementById("productList"));
        setTimeout(startPage, 100);
        return;
    };

    if(response == 'RequestError'){
        alert("Ошибка сервера! Попробуйте ещё раз!");
        return;
    };

    if(document.getElementById("productList") != null){
        body.removeChild(document.getElementById("productList"));
    }

    var productListMenu = document.createElement('div');
    productListMenu.id = 'productList';
    productListMenu.className = 'productList';

    var input1 = document.createElement('input');
    input1.name = 'name';
    input1.id = 'nameAdd';
    input1.placeholder = 'Имя продукта';
    input1.className = 'productListAddInput';

    var input2 = document.createElement('input');
    input2.name = 'price';
    input2.id = 'priceAdd';
    input2.placeholder = 'Цена';
    input2.className = 'productListAddInput';

    var input3 = document.createElement('input');
    input3.name = 'description';
    input3.id = 'descriptionAdd';
    input3.placeholder = 'Описание';
    input3.className = 'productListAddInput';

    var btnAdd = document.createElement('button');
    btnAdd.textContent = 'Добавить';

    btnAdd.addEventListener("click", addQuery);

    var divAdd = document.createElement('div');
    divAdd.className = 'productListAdd';

    var div_delete = document.createElement('div');
    div_delete.id = 'deleteProductsDiv';
    div_delete.className = 'deleteProductsDiv';

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener("click", deleteRowsQuery);

    div_delete.appendChild(deleteButton);

    divAdd.appendChild(input1);
    divAdd.appendChild(input2);
    divAdd.appendChild(input3);
    divAdd.appendChild(btnAdd);

    var table = document.createElement('table');
    table.className = 'productTable';

    var th = document.createElement('tr');

    var tdh1 = document.createElement('th');
    tdh1.innerText = "ID";

    var tdh2 = document.createElement('th');
    tdh2.innerText = "Имя";

    var tdh3 = document.createElement('th');
    tdh3.innerText = "Цена";

    var tdh4 = document.createElement('th');
    tdh4.innerText = "Описание";

    var tdh5 = document.createElement('th');
    tdh5.innerText = "Удалить?";

    th.appendChild(tdh1);
    th.appendChild(tdh2);
    th.appendChild(tdh3);
    th.appendChild(tdh4);
    th.appendChild(tdh5);

    table.appendChild(th);

    response.forEach(function(item, i, arr){
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        td1.innerText = item.id;

        var td2 = document.createElement('td');
        td2.innerText = item.name;

        var td3 = document.createElement('td');
        td3.innerText = item.price;

        var td4 = document.createElement('td');
        td4.innerText = item.description;      
        
        var td5 = document.createElement('td');

        var currentInput = document.createElement('input');
        currentInput.type = 'checkbox';
        currentInput.className = 'checkboxToDelete';
        currentInput.name = 'to_delete';
        currentInput.value = item.id;

        td5.appendChild(currentInput);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        table.appendChild(tr);

    });

    productListMenu.appendChild(divAdd);
    productListMenu.appendChild(div_delete);
    productListMenu.appendChild(table);
    body.appendChild(productListMenu);
}

function deleteRowsQuery(){
    if(document.getElementsByClassName('checkboxToDelete') == null) return;

    var checkboxes = document.getElementsByClassName('checkboxToDelete');
    var checkboxChecked = [];

    for (var index = 0; index < checkboxes.length; index++) {
        if (checkboxes[index].checked) {
           checkboxChecked.push(checkboxes[index].value);
        }
    }

    var xhr = new XMLHttpRequest();
    
    var flagAsync = false;
    xhr.open("DELETE", "api/products", flagAsync);

    console.log(JSON.stringify(checkboxChecked));

    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
    xhr.setRequestHeader('To-delete-rows', JSON.stringify(checkboxChecked));
    
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
    
        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)
    
        if (xhr.status !== 200) {  
            console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
            alert("Ошибка сервера! Попробуйте ещё раз!")
            return "RequestError";
        } 
        else { 
            var response = xhr.responseText;

            if(response == 'rows_deleted'){
                setTimeout(getProductList, 0);
                return;
            }

            if(response == "tokenError"){

                alert("Ошибка авторизации! Выполните повторный вход!");
                localStorage.removeItem('WFSAppUserToken');
                setTimeout(startPage, 0);
                return;
            }
			else if (response == "dataBaseError") {
				alert("Ошибка базы данных. Попробуйте ещё раз!");
			}
			else {
                alert("Неизвестная ошибка. Попробуйте ещё раз!");
            }

            

        } 
       
        // получить результат из this.responseText или this.responseXML
    }

    xhr.send();

}

function getProductList(){

    if(localStorage.getItem('WFSAppUserToken') == null || localStorage.getItem('WFSAppUserToken') == undefined){
        return "tokenError";
    }

    var xhr = new XMLHttpRequest();
    
    var flagAsync = false;
    xhr.open("GET", "api/productList", flagAsync);

    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
    
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
    
        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)
    
        if (xhr.status !== 200) {  
            console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
            return "RequestError";
            alert("Ошибка сервера! Попробуйте обновить таблицу меню!");
        } 
        else { 
            var response = JSON.parse(xhr.responseText);
            productListMenu(response);            
        } 
       
        // получить результат из this.responseText или this.responseXML
    }

    xhr.send();
}

function addQuery(){
    
    if(document.getElementById('nameAdd').value == '' || document.getElementById('nameAdd').value == null) return;
    if(document.getElementById('descriptionAdd').value == '') return;
    if(document.getElementById('priceAdd').value == '') return;

    var xhr = new XMLHttpRequest();
    
    var flagAsync = false;
    xhr.open("POST", "api/product", flagAsync);

    var product = {
        price: document.getElementById('priceAdd').value,
        description: document.getElementById('descriptionAdd').value,
        name: document.getElementById('nameAdd').value,
        id: 0
    }

    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
    
    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
    
        // по окончании запроса доступны:
        // status, statusText
        // responseText, responseXML (при content-type: text/xml)
    
        if (xhr.status !== 200) {  
            console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
            alert("Ошибка сервера! Попробуйте ещё раз!")
            return "RequestError";
            alert("Ошибка сервера! Попробуйте обновить таблицу меню!");
        } 
        else { 
            var response = xhr.responseText;

            if(response == 'row_added'){
                setTimeout(getProductList, 0);
                return;
            }

            if(response == "tokenError"){

                alert("Ошибка авторизации! Выполните повторный вход!");
                localStorage.removeItem('WFSAppUserToken');
                setTimeout(startPage, 0);
                return;
            }else{
                alert("Неизвестная ошибка. Попробуйте ещё раз!");
            }

            

        } 
       
        // получить результат из this.responseText или this.responseXML
    }

    xhr.send(JSON.stringify(product));
}

function mainMenu(){
    var divMainMenu = document.createElement('div');
    divMainMenu.id = "MainMenu";
    divMainMenu.className = "mainMenu";

    var divListMenu = document.createElement('div');
    divListMenu.id = "ListMenu";
    divListMenu.className = "ListMenu";
    
    var header = document.createElement('p');
    header.id = "MenuHeader";
    header.className = "MenuHeader";

    var str = "Привет, ";

        {
            var login = JSON.parse(localStorage.getItem('WFSAppUserToken'));
            login = login.payload;
            str+=login;
        }


    header.innerText = str;

    divListMenu.appendChild(header);

    divMainMenu.appendChild(divListMenu);    

    return divMainMenu;
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
    xhr.open("POST", "api/auth", flagAsync);

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
    var uri = "./api/user";

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