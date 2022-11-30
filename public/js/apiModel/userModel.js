const userModel = (function (){

    class User{
        constructor(){
            this.user = undefined;
            this.callbackLink = undefined;
        }

        setUser(usr){
            this.user = usr;
        }

        setCallback(newCallback){
            this.callbackLink = newCallback;
        }

        _authQuery(){

            let queryData = {
                method: "POST",
                uri: "api/users/auth",
                flagAsync: true,
                data: JSON.stringify(this.user)
            }

            let callback = this.callbackLink;
    
            let xhr = new XMLHttpRequest();
    
            xhr.open(queryData.method,queryData.uri,queryData.flagAsync);
    
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                let response;
                if(xhr.status == 200) response = JSON.parse(xhr.responseText);
                else response = xhr.responseText;
                callback(response, xhr.status);
            }
    
            xhr.send(queryData.data);
        }

        _registerQuery(){
            let queryData = {
                method: "POST",
                uri: "./api/users/",
                flagAsync: true,
                data: JSON.stringify(this.user)
            }
    
            let xhr = new XMLHttpRequest();
    
            let callback = this.callbackLink;

            xhr.open(queryData.method,queryData.uri,queryData.flagAsync);
    
            xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                //console.log( "Request status: " + xhr.status + ' | status text: ' + xhr.statusText + ' | response text: ' + xhr.responseText);
                let response;
                if(xhr.status == 200) response = JSON.parse(xhr.responseText);
                else response = xhr.responseText;
                callback(response, xhr.status);
            }
    
            xhr.send(queryData.data);
        
        }
    }

    return new User();
})();

export {userModel};