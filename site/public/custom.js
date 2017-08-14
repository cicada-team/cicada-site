/* eslint-disable */
function scrollDown() {
  var header = document.querySelector('header');
  if (document.body.scrollTop > 20) {
    header.classList.add('scrolling')
  } else {
    header.classList.remove('scrolling')
  }
}

window.onscroll = scrollDown
