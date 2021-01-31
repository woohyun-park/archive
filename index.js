let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let themeColor = ["#587bbe", "#e3605e", "#42997b"];

let embedTemp = null;

function moveRight(right){
  let currentPage = right.parentNode;
  let nextPage = currentPage.nextElementSibling;
  let left = currentPage.getElementsByClassName("main__left");
  let nextLeft = nextPage.getElementsByClassName("main__left");
  let nextRight = nextPage.getElementsByClassName("main__right");

  currentPage.style.left = "-100%";
  nextPage.style.left = "0%";

  right.style.visibility = "hidden";
  if(left.length == 1){
    left[0].style.visibility = "hidden";
  }
  if(nextLeft.length == 1){
    nextLeft[0].style.visibility = "visible";
  }
  if(nextRight.length == 1){
    nextRight[0].style.visibility = "visible";
  }
}

function moveLeft(left){
  let currentPage = left.parentNode;
  let previousPage = currentPage.previousElementSibling;
  let right = currentPage.getElementsByClassName("main__right");
  let previousLeft = previousPage.getElementsByClassName("main__left");
  let previousRight = previousPage.getElementsByClassName("main__right");

  currentPage.style.left = "100%";
  previousPage.style.left = "0%";

  left.style.visibility = "hidden";
  if(right.length == 1){
    right[0].style.visibility = "hidden";
  }
  if(previousLeft.length == 1){
    previousLeft[0].style.visibility = "visible";
  }
  if(previousRight.length == 1){
    previousRight[0].style.visibility = "visible";
  }
}

function moveTop(self, i){
  let scroll = document.getElementsByTagName("body")[0];
  let currentPage = self.parentNode;
  let currentContent = document.getElementsByClassName("main__content")[i-1];
  let currentType = currentContent.getElementsByClassName("main__type");
  let currentCrud = document.getElementsByClassName("main__crud")[0];
  let navTitle = document.getElementsByClassName("nav__title");
  let navMenu = document.getElementsByClassName("nav__menu")[0];

  setTimeout(function(){
    scroll.style.overflowY = "auto";
  }, 500);
  currentPage.style.transform = "translateY(-93%)";
  currentContent.style.display = "flex";
  setTimeout(function(){
    currentContent.style.marginTop = "10vh";
  }, 50);
  for(let j = 0; j < currentType.length; j++){
    currentType[j].style.backgroundColor = themeColor[i-1];
  }
  currentCrud.style.visibility = "visible";
  currentCrud.style.color = themeColor[i-1];
  currentCrud.style.opacity = 1;
  navTitle[0].style.left = "-50%";
  navTitle[i].style.left = 0;
  navMenu.style.visibility = "visible";
  navMenu.style.opacity = 1;
  navMenu.style.right = 0;
}

function moveBottom(i){
  let scroll = document.getElementsByTagName("body")[0];
  let currentPage = document.getElementsByClassName("main__page")[i];
  let currentContent = document.getElementsByClassName("main__content")[i];
  let currentCrud = document.getElementsByClassName("main__crud")[0];
  let navTitle = document.getElementsByClassName("nav__title");
  let navMenu = document.getElementsByClassName("nav__menu")[0];

  scroll.style.overflowY = "hidden";
  currentPage.style.transform = "translateY(0%)";
  currentContent.style.marginTop = "110vh";
  setTimeout(function(){
    currentContent.style.display = "none";
  }, 500);
  currentCrud.style.visibility = "hidden";
  currentCrud.style.opacity = 0;
  navTitle[0].style.left = 0;
  navTitle[i+1].style.left = "-50%";
  navMenu.style.visibility = "hidden";
  navMenu.style.opacity = 0;
  navMenu.style.right = "-50%";
}

function showContent(self){
  let main = document.getElementsByTagName("main")[0];
  let siblings = getSiblings(self);
  let image = self.getElementsByTagName("img")[0];
  let type = self.getElementsByClassName("main__type")[0];
  let text = self.getElementsByTagName("object")[0];

  for(let i = 0; i < siblings.length; i++){
    siblings[i].style.display = "none";
  }
  main.style.overflow = "auto";
  self.style.maxWidth = "100vw";
  self.style.maxHeight = "50vw";
  self.style.width = "100vw";
  self.style.height = "50vw";
  image.style.maxWidth = "500px";
  image.style.maxHeight = "500px";
  image.style.width = "50vw";
  image.style.height = "50vw";
  type.style.visibility = "hidden";
  text.style.display = "block";
  self.firstElementChild.onclick = function() {hideContent(this.parentNode);};
  setTimeout(function(){
    text.style.visibility = "visible";
  }, 300);
}

function hideContent(self){
  let main = document.getElementsByTagName("main")[0];
  let siblings = getSiblings(self);
  let image = self.getElementsByTagName("img")[0];
  let type = self.getElementsByClassName("main__type")[0];
  let text = self.getElementsByTagName("object")[0];

  for(let i = 0; i < siblings.length; i++){
    siblings[i].style.display = "block";
  }

  main.style.overflow = "hidden";
  self.style.maxWidth = "340px";
  self.style.maxHeight = "340px";
  self.style.width = "26vw";
  self.style.height = "26vw";
  image.style.maxWidth = "340px";
  image.style.maxHeight = "340px";
  image.style.width = "26vw";
  image.style.height = "26vw";
  type.style.visibility = "visible";
  text.style.display = "none";
  text.style.visibility = "hidden";
  self.firstElementChild.onclick = function() {showContent(this.parentNode);};
}

function getSiblings(self){
  let siblings = [];
  let childs = self.parentNode.children;
  for(let i = 0; i < childs.length; i++){
    if(childs[i] != self){
      siblings.push(childs[i]);
    }
  }
  return siblings;
}
