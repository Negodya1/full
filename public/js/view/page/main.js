import { Products } from "../../apiModel/productsModel.js";
import { User } from "../../apiModel/userModel.js";

class pageMain{

    constructor(newRouter){
        this.root = undefined;
        this.router = newRouter;
        this.model = new Products();
		this.user = new User();
    }

    loginPageDisplay() {
        this.router.renderPage("loginPage");
    }
	
	async adminPageDisplay() {
		let response = await this.user._statusQuery();
        let status = response.status;
        response = response.text;

        if(status == 200){
			if (response == "admin") this.router.renderPage("adminPage");
            return;
        }
        if(status == 401){
            localStorage.removeItem('WFSAppUserToken');
            this.renderPage();
            return;
        }
    }

    async deleteButtonClicked() {

        if(document.getElementsByClassName('checkboxToDelete') == null) return;

        let checkboxes = document.getElementsByClassName('checkboxToDelete');
        let checkboxChecked = [];

        for (let index = 0; index < checkboxes.length; index++) {
            if (checkboxes[index].checked) {
                checkboxChecked.push(checkboxes[index].value);
            }
        }

        let response = await this.model._deleteProduct(JSON.stringify(checkboxChecked));
        let status = response.status;
        response = response.text;

        if(status == 200){
            this.getProductList();
            return;
        }
        if(status == 401){
            localStorage.removeItem('WFSAppUserToken');
            this.renderPage();
            return;
        } else {
            this.getProductList();
            return;
        }
    }

    async addButtonClicked() {

        let product = {
            name: document.getElementById('ProductName').value,
            id: undefined,
            price: document.getElementById('Price').value,
            description: document.getElementById('Description').value,
        }

        if(product.name == undefined || product.name == null || product.name == ''){
            this.addButtonClickedCallback(400);
            return;
        }
        if(product.price == undefined || product.price == null || product.price == ''){
            this.addButtonClickedCallback(400);
            return;
        }
        
        this.model.setProduct(product);
        let response = await this.model._addProduct();
        let status = response.status;
        response = response.text;

        if(status == 200) {
            this.getProductList();
            return;
        }
        
        if(status == 401) {
            localStorage.removeItem('WFSAppUserToken');
            this.renderPage();
            return;
        }
        
        if(status == 400){
            alert("Вы ввели неправильные данные!");
            this.getProductList();
            return;
        }

        this.getProductList();
        return;
    }
    
    async getProductList() {

        let response = await this.model._getProductsList();

        let status = response.status;
        response = response.text;

        if(status == 401) {
            localStorage.removeItem('WFSAppUserToken');
            if(document.getElementById("productList") != null) root.removeChild(document.getElementById("productList"));
            this.renderPage();
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
            btnAdd.addEventListener("click", this.addButtonClicked.bind(this));
        
            let divAdd = document.createElement('div');
            divAdd.className = 'productListAdd';
        
            divAdd.appendChild(inpProductName);
            divAdd.appendChild(inpPrice);
            divAdd.appendChild(inpDescription);
            divAdd.appendChild(btnAdd);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = "Удалить";
            deleteButton.addEventListener("click", this.deleteButtonClicked.bind(this));
        
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

    mainPageDisplay() {

        root.innerHTML = '';
    
        let mainpage = document.createElement('div');
        mainpage.id = 'mainPage';
    
        let btn_exit = document.createElement('button');
        btn_exit.className = "ExitButton";
    
        btn_exit.textContent = 'Exit';
        btn_exit.addEventListener("click", () => {
            localStorage.removeItem('WFSAppUserToken');
            this.loginPageDisplay();
        });
    
        mainpage.appendChild(btn_exit);
		
		let btn_admin = document.createElement('button');
        btn_admin.className = "AdminButton";
    
        btn_admin.textContent = 'Admin Menu';
        btn_admin.addEventListener("click", () => {
            this.adminPageDisplay();
        });
    
        mainpage.appendChild(btn_admin);
		
        root.appendChild(mainpage);
        this.getProductList();
    }

    renderPage() {
        if(localStorage.getItem('WFSAppUserToken') == null){
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

export {pageMain};

