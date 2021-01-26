let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

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
  document.getElementsByClassName("nav__title")[i].style.left = 0;
}

function moveBottom(self, i){
  self.style.left = "-50%";
  document.getElementsByClassName("nav__title")[0].style.left = 0;
  console.log(document.getElementsByClassName("main__title")[i]);
  document.getElementsByClassName("main__page")[i].style.transform = "translateY(0%)";
}
