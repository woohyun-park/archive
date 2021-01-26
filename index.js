let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

function moveRight(self){
  self.style.left = "-100%";
  self.nextElementSibling.style.left = "0%";
}

function moveLeft(self){
  self.style.left = "100%";
  self.previousElementSibling.style.left = "0%";
}
