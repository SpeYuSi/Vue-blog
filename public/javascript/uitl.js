
window.onload=function(){

  var oNav = document.getElementById('nav')
  var oNotice = document.getElementById('notice')
  var oTop = document.getElementById('top')
  var oTitle = document.getElementById('title')
  var oTitlea = document.getElementById('titlea')

  oTitle.onclick= function(){
        oTitlea.click();
  }

window.onscroll = function(){

  var heightValue = getScrollTop();
  console.log(heightValue)
  if( heightValue > 40 ){
    oNav.classList.add('fixed')
    oNotice.style.marginTop = '7em'
  }
  if( heightValue < 40 ){
    oNav.classList.remove('fixed')
    oNotice.style.marginTop = '0'
  }
  if( heightValue < 100 ){
    oTop.style.right = '-100px'
  }
  if( heightValue > 100 ){
    oTop.style.right = '100px'
  }
}

oTop.onclick=function(){
   $('html , body').animate({scrollTop: 0},'slow');
}
function getScrollTop() {
        var scrollPos;
        if (window.pageYOffset) {
        scrollPos = window.pageYOffset; }
        else if (document.compatMode && document.compatMode != 'BackCompat')
        { scrollPos = document.documentElement.scrollTop; }
        else if (document.body) { scrollPos = document.body.scrollTop; }
        return scrollPos;
}

}

