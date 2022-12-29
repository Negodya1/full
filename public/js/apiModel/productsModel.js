
class Products{
    constructor(){
        this.product = undefined;
    }
    setProduct(productParam){
        this.product = productParam;
    }
    _getProductsList(){
        return new Promise( (resolve) => {
            let status;
            fetch('api/products/list', {method: 'GET', headers: {'Content-Type': 'application/json;charset=utf-8', 'User-token': localStorage.getItem('WFSAppUserToken')}})
            .then( (response) => {
                status = response.status;
                return response.json()
            })
            .then( (data) => {
                let result = {
                    status: status,
                    text: data
                }
                resolve(result);  
            })
        });
    }
    _addProduct(){
        return new Promise( (resolve) => {
            let status;
            fetch('api/products/', {method: 'POST', headers: {'Content-Type': 'application/json;charset=utf-8', 'User-token': localStorage.getItem('WFSAppUserToken')}, body: JSON.stringify(this.product)})
            .then( (response) => {
                status = response.status;
                return response.json()
            })
            .then( (data) => {
                let result = {
                    status: status,
                    text: data
                }
                resolve(result);  
            })
        });
    }
    _deleteProduct(toDelete){
        return new Promise( (resolve) => {
            let status;
            fetch('api/products/', {method: 'DELETE', headers: {'Content-Type': 'application/json;charset=utf-8', 'User-token': localStorage.getItem('WFSAppUserToken'), 'To_Delete_IDs': toDelete}})
            .then( (response) => {
                status = response.status;
                return response.json()
            })
            .then( (data) => {
                let result = {
                    status: status,
                    text: data
                }
                resolve(result);  
            })
        });
    }
}



export{Products};