let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let themeColor = ["#587bbe", "#e3605e", "#42997b"];

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
  let currentPage = self.parentNode;
  let currentCrud = document.getElementsByClassName("main__crud")[0];
  let navTitle = document.getElementsByClassName("nav__title");
  let navMenu = document.getElementsByClassName("nav__menu")[0];

  currentPage.style.transform = "translateY(-93%)";
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
  let currentPage = document.getElementsByClassName("main__page")[i];
  let currentCrud = document.getElementsByClassName("main__crud")[0];
  let navTitle = document.getElementsByClassName("nav__title");
  let navMenu = document.getElementsByClassName("nav__menu")[0];

  currentPage.style.transform = "translateY(0%)";
  currentCrud.style.visibility = "hidden";
  currentCrud.style.opacity = 0;
  navTitle[0].style.left = 0;
  navTitle[i+1].style.left = "-50%";
  navMenu.style.visibility = "hidden";
  navMenu.style.opacity = 0;
  navMenu.style.right = "-50%";
}
