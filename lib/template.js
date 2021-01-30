let url = require('url');
let fs = require('fs');
let db = require('./db.js');

exports.main = function(request, response){
  html = createHTML();
  response.writeHead(200);
  response.end(html);
}

exports.style = function(request, response){
  let _url = request.url;
  let file = url.parse(_url, true).query.id;
  console.log(file);
  fs.readFile(file, function(err, file){
    if(err){throw err;}
    if(url.parse(_url, true).query.type == 'css'){
      response.writeHead(200, {'Content-Type': 'text/css'});
    } else if(url.parse(_url, true).query.type == 'js'){
      response.writeHead(200, {'Content-Type': 'text/javascript'});
    } else if(url.parse(_url, true).query.type == 'ttf'){
      response.writeHead(200, {'Content-Type': 'font/ttf'})
    } else{
      response.writeHead(200, {'Content-Type': 'image/png'});
    }
    response.end(file);
  })
}

function getlist(){
  let result = ['', ''];
  let tempList = db.query('select * from list');

  for(let i = 0; i < tempList.length; i++){
    result[0] += `<span class="nav__title" onclick="moveBottom(${i});">[${tempList[i].title}]</span>`
    if(i == 0){
      result[1] += `
      <div class="main__page" id="firstPage">
        <div class="main__left" onclick="moveLeft(this);" style="visibility:visible;">&#60;</div>
        <div class="main__right" onclick="moveRight(this);" style="visibility:visible">&#62</div>
        <div class="main__title" onclick="moveTop(this, ${i+1});">
          <span class="main__open">[</span>
          <div class="main__box">
            <span class="main__alphabet">${tempList[i].title}</span>
          </div>
          <span class="main__close">]</span>
        </div>
      </div>
      `;
    } else if(i + 1 == tempList.length){
      result[1] += `
      <div class="main__page">
        <div class="main__left" onclick="moveLeft(this);">&#60;</div>
        <div class="main__title" onclick="moveTop(this, ${i+1});">
          <span class="main__open">[</span>
          <div class="main__box">
            <span class="main__alphabet">${tempList[i].title}</span>
          </div>
          <span class="main__close">]</span>
        </div>
      </div>
      `;
    } else{
      result[1] += `
      <div class="main__page">
        <div class="main__left" onclick="moveLeft(this);">&#60;</div>
        <div class="main__right" onclick="moveRight(this);">&#62</div>
        <div class="main__title" onclick="moveTop(this, ${i+1});">
          <span class="main__open">[</span>
          <div class="main__box">
            <span class="main__alphabet">${tempList[i].title}</span>
          </div>
          <span class="main__close">]</span>
        </div>
      </div>
      `;
    }
  }
  return result;
}

function createHTML(){
  let list = getlist();
  let result = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/style?id=./style.css&type=css">
    <script type="text/javascript" src="/style?id=./lib/move.js&type=js"></script>
    <title>Document</title>
  </head>
  <body>
    <container>
      <nav>
        <div class="nav__box">
          <span class="nav__title">[archive]</span>
          ${list[0]}
          <span class="nav__menu">=</span>
        </div>
      </nav>
      <main id="main">
        ${list[1]}
        <div class="main__content">
          <div class="main__box">
            <img src="/style?id=./img/CSS.png">
          </div>
          <div class="main__box">
            <img src="/style?id=./img/etc.png">
          </div>
          <div class="main__box">
            <img src="/style?id=./img/git.png">
          </div>
        </div>
        <div class="main__crud">
          <div class="main__create">+</div>
        </div>
      </main>
      <footer>
      </footer>
    </container>
  </body>
  </html>
  `;
  return result;
}
