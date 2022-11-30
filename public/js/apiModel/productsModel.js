const productModel = (function() {

    class Products{
        constructor(){
            this.product = undefined;
            this.callbackLink = undefined;
        }

        setProduct(productParam){
            this.product = productParam;
        }

        setCallback(callbackLink){
            this.callbackLink = callbackLink;
        }

        _getProductsList(){

            let queryData = {
                method: "GET",
                flagAsync: true,
                uri: "./api/products/list"
            }
    
            let xhr = new XMLHttpRequest();

            let callback = this.callbackLink;
    
            xhr.open(queryData.method,queryData.uri,queryData.flagAsync);
    
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
    
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                let response;
                //console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
                if(xhr.status == 200) response = JSON.parse(xhr.responseText);
                else response = xhr.responseText;
                callback(response, xhr.status);
            }
    
            xhr.send();
        }

        _addProduct(){

            let queryData = {
                method: "POST",
                uri: "./api/products/",
                flagAsync: true,
                data: JSON.stringify(this.product)
            }

            let callback = this.callbackLink;
    
            let xhr = new XMLHttpRequest();
    
            xhr.open(queryData.method,queryData.uri,queryData.flagAsync);
    
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
    
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                let response;
                console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
                if(xhr.status == 200) response = JSON.parse(xhr.responseText);
                else response = xhr.responseText;
                callback(response, xhr.status);
            }
    
            xhr.send(queryData.data);
        }

        _deleteProduct(toDelete){

            let queryData = {
                method: "DELETE",
                uri: "./api/products/",
                flagAsync: true,
                data: JSON.stringify(toDelete),
            }
            
            let callback = this.callbackLink;

            let xhr = new XMLHttpRequest();
    
            xhr.open(queryData.method,queryData.uri,queryData.flagAsync);
    
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('User-token', localStorage.getItem('WFSAppUserToken'));
            xhr.setRequestHeader('To_Delete_IDs', toDelete);
    
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                let response;
                //console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
                if(xhr.status == 200) response = JSON.parse(xhr.responseText);
                else response = xhr.responseText;
                callback(response, xhr.status);
            }
    
            //xhr.send(queryData.data);
            xhr.send();
        }
    }

    return new Products();
}
)();

export{productModel};