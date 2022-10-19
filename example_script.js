var std1 = {
   id: 1,
   name: 'Иванов'
  };

var std2 = {
   id: 2,
   name: 'Петров'
  };
  
var std3 = {
   id: 3,
   name: 'Сидоров'
  };
  
var students = [std1,std2,std3];

function startPage(){

}

function test() { 

  var xhr = new XMLHttpRequest();
  var flagAsync = false;
  var uri = "./api/test";

  xhr.open("POST", uri, flagAsync)
  xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');

  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(xhr.readyState != 4) return;

    if(xhr.status !== 200){
      console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
    }else{
      students = JSON.parse(xhr.responseText);
      var d = document.getElementById('divTest');
      var t = d.firstChild;
      t.nodeValue = xhr.responseText;
    }
  }

  xhr.send(JSON.stringify(students));

}

function ping() {                            
  var xhr = new XMLHttpRequest();
    
  var flagAsync = true;
  xhr.open("GET", "api", flagAsync);
   
   
  xhr.send();
  
  xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
  
      // по окончании запроса доступны:
      // status, statusText
      // responseText, responseXML (при content-type: text/xml)
  
      if (xhr.status !== 200) {  
        console.log( "Request error: " + xhr.status + ': ' + xhr.statusText );
      } 
      else { 
        var response = xhr.responseText;   
        var d = document.getElementById("divPing");      
        var t = d.firstChild;            
        t.nodeValue = t.nodeValue + " " + response;
       } 
  
      // получить результат из this.responseText или this.responseXML
  }
}