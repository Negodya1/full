var model = (function() {

    var User = {
		authentication(user, callback){

			var queryData = {
				method: "POST",
				uri: "api/auth",
				flagAsync: true,
				data: JSON.stringify(user)
			}

			var xhr = new XMLHttpRequest();

			xhr.open(queryData.method,queryData.uri,queryData.flagAsync);

			xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');

			xhr.onreadystatechange = function() {
				if (this.readyState != 4) return;
				
				if(xhr.status == 200) var response = JSON.parse(xhr.responseText);
				else response = xhr.responseText;
				callback(response, xhr.status);
			}

			xhr.send(queryData.data);
		},
		registration(user, callback){
			var queryData = {
				method: "POST",
				uri: "./api/user",
				flagAsync: true,
				data: JSON.stringify(user)
			}

			var xhr = new XMLHttpRequest();

			xhr.open(queryData.method,queryData.uri,queryData.flagAsync);

			xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');

			xhr.onreadystatechange = function() {
				if (this.readyState != 4) return;
				//console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
				if(xhr.status == 200) var response = JSON.parse(xhr.responseText);
				else response = xhr.responseText;
				callback(response, xhr.status);
			}

			xhr.send(queryData.data);
		
		}
	};
	
    function _getProductsList(callback){

        var queryData = {
            method: "GET",
            flagAsync: true,
            uri: "./api/productList"
        }

        var xhr = new XMLHttpRequest();

        xhr.open(queryData.method,queryData.uri,queryData.flagAsync);

        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));

        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            //console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
            response = xhr.responseText;
            callback(response, xhr.status);
        }

        xhr.send();
    }

    function _addProduct(product, callback){

        var queryData = {
            method: "POST",
            uri: "./api/product",
            flagAsync: true,
            data: JSON.stringify(product),
        }

        var xhr = new XMLHttpRequest();

        xhr.open(queryData.method,queryData.uri,queryData.flagAsync);

        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));

        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            //console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
            response = xhr.responseText;
            callback(response, xhr.status);
        }

        xhr.send(queryData.data);
    }

    function _deleteProduct(toDelete, callback){

        var queryData = {
            method: "DELETE",
            uri: "./api/products",
            flagAsync: true,
            data: JSON.stringify(toDelete),
        }

        var xhr = new XMLHttpRequest();

        xhr.open(queryData.method,queryData.uri,queryData.flagAsync);

        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
        xhr.setRequestHeader('To-delete-rows', toDelete);

        xhr.onreadystatechange = function() {
            if (this.readyState != 4) return;
            //console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
            response = xhr.responseText;
            callback(response, xhr.status);
        }

        //xhr.send(queryData.data);
        xhr.send();
    }

    return{
        user: User,
        getProductsList: _getProductsList,
        addProduct: _addProduct,
        deleteProduct: _deleteProduct
    };
}
)();