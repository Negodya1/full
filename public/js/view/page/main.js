import router from "../router.js";
import { productModel as model } from "../../apiModel/productsModel.js";

export default (function() {
    let root = undefined;

    function loginPageDisplay() {
        router.render("loginPage");
    }

    function deleteButtonClickedCallback(response, status) {
        if(status == 200){
            getProductList();
            return;
        }
        if(status == 401){
            localStorage.removeItem('WFSAppUserToken');
            renderPage();
            return;
        } else {
            getProductList();
            return;
        }
    }

    function deleteButtonClicked() {


        if(document.getElementsByClassName('checkboxToDelete') == null) return;

        let checkboxes = document.getElementsByClassName('checkboxToDelete');
        let checkboxChecked = [];

        for (let index = 0; index < checkboxes.length; index++) {
            if (checkboxes[index].checked) {
                checkboxChecked.push(checkboxes[index].value);
            }
        }

        model.setCallback(deleteButtonClickedCallback);
        model._deleteProduct(JSON.stringify(checkboxChecked));
    }

    function addButtonClickedCallback(status) {
        if(status == 200) {
            getProductList();
            return;
        }
        
        if(status == 401) {
            localStorage.removeItem('WFSAppUserToken');
            renderPage();
            return;
        }
        
        if(status == 400){
            alert("Вы ввели неправильные данные!");
            getProductList();
            return;
        }

        getProductList();
        return;
    }
    
    function addButtonClicked() {
        let product = {
            name: document.getElementById('ProductName').value,
            id: undefined,
            price: document.getElementById('Price').value,
            description: document.getElementById('Description').value,
        }

        if(product.name == undefined || product.name == null || product.name == ''){
            addButtonClickedCallback(400);
            return;
        }
        if(product.price == undefined || product.price == null || product.price == ''){
            addButtonClickedCallback(400);
            return;
        }
        
        model.setProduct(product);
        model.setCallback(addButtonClickedCallback);
        model._addProduct();
    }

    function getProductsListCallback(response, status) {
        if(status == 401) {
            localStorage.removeItem('WFSAppUserToken');
            if(document.getElementById("productList") != null) root.removeChild(document.getElementById("productList"));
            renderPage();
            return;
        } else if (status == 200) {
            if(document.getElementById("productList") != null){
                root.removeChild(document.getElementById("productList"));
            }
            let productListMenu = document.createElement('div');
            productListMenu.id = 'productList';
            productListMenu.className = 'productList';
        
            let inpProductName = document.createElement('input');
            inpProductName.className = "inpProductName-mainPageDisplay WrapCenteredInlineBlock";
            inpProductName.placeholder = "ProductName";
            inpProductName.id = "ProductName";
        
            let inpPrice = document.createElement('input');
            inpPrice.className = "inpPrice-mainPageDisplay WrapCenteredInlineBlock";
            inpPrice.placeholder = "Price";
            inpPrice.id = "Price";
        
            let inpDescription = document.createElement('input');
            inpDescription.className = "inpDescription-mainPageDisplay WrapCenteredInlineBlock";
            inpDescription.placeholder = "Description";
            inpDescription.id = "Description";
        
            let btnAdd = document.createElement('button');
            btnAdd.className = "btnAdd-mainPageDisplay WrapCenteredInlineBlock";
            btnAdd.textContent = 'Add';
            btnAdd.type = 'submit';
            btnAdd.addEventListener("click", addButtonClicked);
        
            let divAdd = document.createElement('div');
            divAdd.className = 'productListAdd';
        
            divAdd.appendChild(inpProductName);
            divAdd.appendChild(inpPrice);
            divAdd.appendChild(inpDescription);
            divAdd.appendChild(btnAdd);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = "Удалить";
            deleteButton.addEventListener("click", deleteButtonClicked)
        
            let table = document.createElement('table');
            table.className = "table-mainPageDisplay WrapCenteredInlineBlock";
            let th = document.createElement('tr');
            let tdh1 = document.createElement('th');
            tdh1.innerText = "ID";
            let tdh2 = document.createElement('th');
            tdh2.innerText = "ProductName";
            let tdh3 = document.createElement('th');
            tdh3.innerText = "Price";
            let tdh4 = document.createElement('th');
            tdh4.innerText = "Description";
            let tdh5 = document.createElement('th');
            tdh5.innerText = "Delete?";
        
            th.appendChild(tdh1);
            th.appendChild(tdh2);
            th.appendChild(tdh3);
            th.appendChild(tdh4);
            th.appendChild(tdh5);
            table.appendChild(th);
        
            response.forEach(function(item){
                let tr = document.createElement('tr');
                let td1 = document.createElement('td');
                td1.innerText = item.id;
                let td2 = document.createElement('td');
                td2.innerText = item.name;
                let td3 = document.createElement('td');
                td3.innerText = item.price;
                let td4 = document.createElement('td');
                td4.innerText = item.description;
                let td5 = document.createElement('td');

                let currentInput = document.createElement('input');
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
            productListMenu.appendChild(deleteButton);
            productListMenu.appendChild(table);
            root.appendChild(productListMenu);
        } else {
            alert("Service offline! Try again later!");
            if(document.getElementById("productList") != null){
                root.removeChild(document.getElementById("productList"));
            }
        }
    }

    function getProductList() {
        model.setCallback(getProductsListCallback);
        model._getProductsList();
    }

    function mainPageDisplay() {

        root.innerHTML = '';
    
        let mainpage = document.createElement('div');
        mainpage.id = 'mainPage';
    
        let btn_exit = document.createElement('button');
        btn_exit.className = "ExitButton";
    
        btn_exit.textContent = 'Exit';
        btn_exit.addEventListener("click", function(){
            localStorage.removeItem('WFSAppUserToken');
            loginPageDisplay();
        });
    
        mainpage.appendChild(btn_exit);
        root.appendChild(mainpage);
        getProductList();
    }

    function renderPage() {
        if(localStorage.getItem('WFSAppUserToken') == null){
            loginPageDisplay();
        }
        else {
            mainPageDisplay();
        }
    }

    function _init(rootParam) {
        root = rootParam; 
        renderPage();
    }

    return {
        render: _init  
    };
}
)();