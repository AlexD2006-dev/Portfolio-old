const myImage = document.querySelector("img");

myImage.addEventListener("click", () => {
  const mySrc = myImage.getAttribute("src");

  if (mySrc === "/3d-pager.png") {
    myImage.setAttribute("src", "/website-code.png");
  } else {
    myImage.setAttribute("src", "/3d-pager.png");
  }
});
