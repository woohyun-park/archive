let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let themeColor = ["#587bbe", "#e3605e", "#42997b"];

function moveRight(self){
  self.parentNode.style.left = "-100%";
  self.parentNode.nextElementSibling.style.left = "0%";
  self.style.visibility = "hidden";
  if(self.parentNode.getElementsByClassName("main__left").length != 0){
    self.parentNode.getElementsByClassName("main__left")[0].style.visibility = "hidden";
  }
  if(self.parentNode.nextElementSibling.getElementsByClassName("main__left").length != 0){
    self.parentNode.nextElementSibling.getElementsByClassName("main__left")[0].style.visibility = "visible";
  }
  if(self.parentNode.nextElementSibling.getElementsByClassName("main__right").length != 0){
    self.parentNode.nextElementSibling.getElementsByClassName("main__right")[0].style.visibility = "visible";
  }
}

function moveLeft(self){
  self.parentNode.style.left = "100%";
  self.parentNode.previousElementSibling.style.left = "0%";
  self.style.visibility = "hidden";
  if(self.parentNode.getElementsByClassName("main__right").length != 0){
    self.parentNode.getElementsByClassName("main__right")[0].style.visibility = "hidden";
  }
  if(self.parentNode.previousElementSibling.getElementsByClassName("main__left").length != 0){
    self.parentNode.previousElementSibling.getElementsByClassName("main__left")[0].style.visibility = "visible";
  }
  if(self.parentNode.previousElementSibling.getElementsByClassName("main__right").length != 0){
    self.parentNode.previousElementSibling.getElementsByClassName("main__right")[0].style.visibility = "visible";
  }
}

function moveTop(self, i){
  self.parentNode.style.transform = "translateY(-93%)";
  document.getElementsByClassName("nav__title")[0].style.left = "-50%";
  document.getElementsByClassName("main__crud")[0].style.visibility = "visible";
  document.getElementsByClassName("main__crud")[0].style.color = themeColor[i-1];
  document.getElementsByClassName("main__crud")[0].style.opacity = 1;
  document.getElementsByClassName("nav__title")[i].style.left = 0;
}

function moveBottom(self, i){
  self.style.left = "-50%";
  document.getElementsByClassName("nav__title")[0].style.left = 0;
  document.getElementsByClassName("main__crud")[0].style.visibility = "hidden";
  document.getElementsByClassName("main__crud")[0].style.opacity = 0;
  console.log(document.getElementsByClassName("main__title")[i]);
  document.getElementsByClassName("main__page")[i].style.transform = "translateY(0%)";
}
