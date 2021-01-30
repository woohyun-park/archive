let http = require('http');
let fs = require('fs');
let template = require('./lib/template.js');
let url = require('url');

let app = http.createServer(function(request,response){
  let _url = request.url;
  let pathname = url.parse(_url, true).pathname;

  if(pathname === '/style'){
    template.style(request, response);
  }
  else{
    template.main(request, response);
  }
});
app.listen(1234);
