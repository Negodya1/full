var pageMain = (function() {
    var root = undefined;

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

        var checkboxes = document.getElementsByClassName('checkboxToDelete');
        var checkboxChecked = [];

        for (var index = 0; index < checkboxes.length; index++) {
            if (checkboxes[index].checked) {
                checkboxChecked.push(checkboxes[index].value);
            }
        }

        model.deleteProduct(JSON.stringify(checkboxChecked), deleteButtonClickedCallback);
    }

    function addButtonClickedCallback(status) {
        if(status == 200) {
            getProductList();
            return;
        } else if(status == 401) {
            localStorage.removeItem('WFSAppUserToken');
            renderPage();
            return;
        } else {
            getProductList();
            return;
        }
    }
    
    function addButtonClicked() {
        var product = {
            name: document.getElementById('ProductName').value,
            price: document.getElementById('Price').value,
            description: document.getElementById('Description').value,
        }
        model.addProduct(product, addButtonClickedCallback);
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
            var productListMenu = document.createElement('div');
            productListMenu.id = 'productList';
            productListMenu.className = 'productList';
        
            var inpProductName = document.createElement('input');
            inpProductName.className = "inpProductName-mainPageDisplay WrapCenteredInlineBlock";
            inpProductName.placeholder = "ProductName";
            inpProductName.id = "ProductName";
        
            var inpPrice = document.createElement('input');
            inpPrice.className = "inpPrice-mainPageDisplay WrapCenteredInlineBlock";
            inpPrice.placeholder = "Price";
            inpPrice.id = "Price";
        
            var inpDescription = document.createElement('input');
            inpDescription.className = "inpDescription-mainPageDisplay WrapCenteredInlineBlock";
            inpDescription.placeholder = "Description";
            inpDescription.id = "Description";
        
            var btnAdd = document.createElement('button');
            btnAdd.className = "btnAdd-mainPageDisplay WrapCenteredInlineBlock";
            btnAdd.textContent = 'Add';
            btnAdd.type = 'submit';
            btnAdd.addEventListener("click", addButtonClicked);
        
            var divAdd = document.createElement('div');
            divAdd.className = 'productListAdd';
        
            divAdd.appendChild(inpProductName);
            divAdd.appendChild(inpPrice);
            divAdd.appendChild(inpDescription);
            divAdd.appendChild(btnAdd);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = "Удалить";
            deleteButton.addEventListener("click", deleteButtonClicked)
        
            var table = document.createElement('table');
            table.className = "table-mainPageDisplay WrapCenteredInlineBlock";
            var th = document.createElement('tr');
            var tdh1 = document.createElement('th');
            tdh1.innerText = "ID";
            var tdh2 = document.createElement('th');
            tdh2.innerText = "ProductName";
            var tdh3 = document.createElement('th');
            tdh3.innerText = "Price";
            var tdh4 = document.createElement('th');
            tdh4.innerText = "Description";
            var tdh5 = document.createElement('th');
            tdh5.innerText = "Delete?";
        
            th.appendChild(tdh1);
            th.appendChild(tdh2);
            th.appendChild(tdh3);
            th.appendChild(tdh4);
            th.appendChild(tdh5);
            table.appendChild(th);
        
            response.forEach(function(item){
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
        model.getProductsList(getProductsListCallback);
    }

    function mainPageDisplay() {

        root.innerHTML = '';
    
        var mainpage = document.createElement('div');
        mainpage.id = 'mainPage';
    
        var btn_exit = document.createElement('button');
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