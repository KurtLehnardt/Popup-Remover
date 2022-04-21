function findHighestZIndex(){
  let elems = document.getElementsByTagName('div')
  let highest = 0
  let ret
  for (let i = 0; i < elems.length; i++){
    let zindex = document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index")
    let obj = elems[i]
    if (obj.style.display === 'hidden') obj.style.display = 'block !important'
    if (obj.style.overflowY !== 'scroll') obj.style.overflowY = 'scroll !important'
    if ((zindex > highest) && (zindex != 'auto')){
      highest = zindex
      ret = obj
    } 
  }
  return ret
}

function fixImgurCom(){
  removeImgurSelfAds()
  removeImgurSponsoredAds()
  removeImgurElementByClass('div', 'Accolade-background')
  removeImgurElementByClass('div', 'NewPostsNotification')
  removeImgurElementByClass('a', 'EmeraldBanner')

}

function removeImgurSelfAds(){
  let ads= [...document.getElementsByClassName('Ad   up-show')]
  ads.map(ad => ad.style.display = 'none !important')
  let adsFooter = [...document.getElementsByClassName('Footer-wrapper')]
  adsFooter.map(footer => footer.style.display = 'none !important')
}

function removeImgurSponsoredAds(){
  let galleryLinks = [...document.getElementsByTagName('a')]
  galleryLinks.map(link => {
    if (link.href.includes('ad')){
      try { 
        link.innerHTML = 'https://www.imgur.com/'
        link.href = 'https://www.imgur.com/'
        link.target = '#'
      } catch {
        console.log('ads already removed')
      }
    }
  })
}

function removeImgurElementByClass(tag, targetClass){
  let galleryImages = [...document.getElementsByTagName(tag)]
  galleryImages.map(image => {
    if (image.classList.contains(targetClass)){
      image.remove()
    }
  })
}


function fixWeatherCom(){
  let elems = document.getElementsByTagName('div')
  for (let i = 0; i < elems.length; i++){
    if (elems[i].className.includes('sp_')){
      console.log('class is: ', elems[i].className)
      elems[i].remove()
    }
    if (elems[i].id.includes('sp_')){
      console.log('id is: ', elems[i].id)
      elems[i].remove()
    }
  }
  document.body.style.overflowY = 'scroll !important'
}

function fixNYTimesCom(){
  let elems = document.getElementsByTagName('div')
  for (let i = 0; i < elems.length; i++){
    if (elems[i].id.includes('gateway-content') || elems[i].id.includes('wrapper') || elems[i].className.includes('css-1bd8bfl')){
      elems[i].remove()
    }
    if (elems[i].id.includes('gateway-content')){
      elems[i].remove()
    }
    if (elems[i].style.background.includes('gradient')){
      elems[i].style.background = 'none !important'
    }
    if (elems[i].style.overflow === 'hidden'){
      elems[i].style.overflow = 'scroll !important'
    }
    if (elems[i].className === 'css-mcm29f'){
      elems[i].style.overflow = 'scroll !important'
    }
  }
}

function fixStandardNet(){
  console.log('fixing standard')
  let popup = document.getElementById('subscription-modal')
  popup.style.display = 'none !important'
  let backdrop = document.getElementsByClassName('modal-backdrop')
  backdrop[0].style.display = 'none !important'
  let overlay = document.getElementsByClassName('redacted-overlay')
  overlay[0].style.display = 'none !important'
  let subscription = document.getElementsByClassName('subscription-required')
  subscription[0].style.display = 'none !important'
  let hiddenParagraphs = [...document.getElementsByClassName('hide')]
  hiddenParagraphs.map(item => item.classList.remove('hide')) 
  let hiddenScroll = document.getElementsByClassName('modal-open')
  hiddenScroll[0].style.overflow = 'auto !important'
}

function fixMediumCom(){
  let currentPage = window.location.href
  let session_id = Array(19).fill().map(()=>"0123456789".charAt(Math.random() * 10)).join("")
  localStorage.setItem('post-article|posts-viewed-today-count', 1)
  let pvObject = Object.keys(localStorage).map(key => key.includes('pv|'))
  let pvIndex = pvObject.indexOf(true)
  let pvValue = Object.entries(localStorage)[pvIndex][0]
  localStorage.setItem(pvValue, Date.now())
  localStorage.setItem('post-article|posts-viewed-count', 1)
  localStorage.setItem('post-article|posts-viewed-month-count', 1)
  localStorage.setItem('post-article|first-post-viewed-timestamp', Date.now())
  localStorage.setItem('branch_session_first', `{'browser_fingerprint_id': ${Array(26).fill().map(()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.random()*62)).join("")}==','data': "{\"+clicked_branch_link\":false,\"+is_first_session\":true}",'has_app': false,'identity': "lo_"${Array(12).fill().map(()=>"abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.random()*62)).join("")},'identity_id': ${session_id},'link': https://link.medium.com/a/key_live_${Array(32).fill().map(()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.random()*62)).join("")}?%24identity_id=${session_id},'session_id': ${session_id}}`)
  clearCookies()
  console.log('cookies', document.cookie.split("; "))
  window.location.reload(true)
  window.location.href = currentPage
}

function clearCookies(){
  // TODO this function doesn't cookie values that have the http only flag enabled :(
  // look into ways to force it, possibly overwrite the existing cookie entirely. 
  // This is the last piece of making medium work when you're over the 3 free article limit
  // Manually clearing their cookie and executing the rest of fixMedium() works.
  var cookies = document.cookie.split("; ");
  for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
          var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
          var p = location.pathname.split('/');
          document.cookie = cookieBase + '/';
          while (p.length > 0) {
              document.cookie = cookieBase + p.join('/');
              p.pop();
          };
          d.shift();
      }
  }
}

(()=>{
  switch (window.origin){
    case 'https://weather.com':
      fixWeatherCom()
      break
    case 'https://www.nytimes.com': 
      fixWeatherCom()
      break
    case 'https://imgur.com': 
      fixImgurCom()
      break
    case 'https://www.standard.net':
      console.log('fixing standard') 
      fixStandardNet()
      break
    default: 
      if (document.body.innerHTML.includes('medium.com')){
        fixMediumCom()
        break
      }
      let bla = findHighestZIndex()
      bla.remove()
  }

  window.onscroll = function(e) {
    let scrollUp = this.oldScroll > this.scrollY
    if (scrollUp) fixImgurCom()
    this.oldScroll = this.scrollY;
    if (!scrollUp) {
      removeImgurElementByClass('Accolade-background')
      removeImgurElementByClass('NewPostsNotification')
    }
  }

  if (window.performance) {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      fixImgurCom()
    }
  }

  document.body.style.overflowY = 'scroll !important'
  document.body.style.overflow = 'scroll !important'
  const html = document.getElementsByTagName('html')[0]
  html.style.overflow = 'auto !important'
  
})()