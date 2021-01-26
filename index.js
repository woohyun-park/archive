let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

function moveRight(self){
  self.parentNode.style.left = "-100%";
  self.parentNode.nextElementSibling.style.left = "0%";
  self.style.visibility = "hidden";
  // self.style.opacity = "0%";
  if(self.parentNode.getElementsByClassName("main__left").length != 0){
    self.parentNode.getElementsByClassName("main__left")[0].style.visibility = "hidden";
    // self.parentNode.getElementsByClassName("main__left")[0].style.opacity = "0%";
  }
  if(self.parentNode.nextElementSibling.getElementsByClassName("main__left").length != 0){
    self.parentNode.nextElementSibling.getElementsByClassName("main__left")[0].style.visibility = "visible";
    // self.parentNode.nextElementSibling.getElementsByClassName("main__left")[0].style.opacity = "100%";
  }
  if(self.parentNode.nextElementSibling.getElementsByClassName("main__right").length != 0){
    self.parentNode.nextElementSibling.getElementsByClassName("main__right")[0].style.visibility = "visible";
    // self.parentNode.nextElementSibling.getElementsByClassName("main__right")[0].style.opacity = "100%";
  }
}

function moveLeft(self){
  self.parentNode.style.left = "100%";
  self.parentNode.previousElementSibling.style.left = "0%";
  self.style.visibility = "hidden";
  // self.style.opacity = "0%";
  if(self.parentNode.getElementsByClassName("main__right").length != 0){
    self.parentNode.getElementsByClassName("main__right")[0].style.visibility = "hidden";
    // self.parentNode.getElementsByClassName("main__right")[0].style.opacity = "0%";
  }
  if(self.parentNode.previousElementSibling.getElementsByClassName("main__left").length != 0){
    self.parentNode.previousElementSibling.getElementsByClassName("main__left")[0].style.visibility = "visible";
    // self.parentNode.previousElementSibling.getElementsByClassName("main__left")[0].style.opacity = "100%";
  }
  if(self.parentNode.previousElementSibling.getElementsByClassName("main__right").length != 0){
    self.parentNode.previousElementSibling.getElementsByClassName("main__right")[0].style.visibility = "visible";
    // self.parentNode.previousElementSibling.getElementsByClassName("main__right")[0].style.opacity = "100%";
  }
}
