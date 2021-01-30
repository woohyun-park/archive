var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/index.html';
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);

//
// // let vh = window.innerHeight * 0.01;
// // document.documentElement.style.setProperty('--vh', `${vh}px`);
