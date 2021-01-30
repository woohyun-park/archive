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
    let html = template.html;
    response.writeHead(200);
    response.end(html);
  }
});
app.listen(3000);

//
// // let vh = window.innerHeight * 0.01;
// // document.documentElement.style.setProperty('--vh', `${vh}px`);
