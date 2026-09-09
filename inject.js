function findHighestZIndex(){
  let elems = document.getElementsByTagName('div')
  let highest = 0
  let ret
  for (let i = 0; i < elems.length; i++){
    let zindex = document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index")
    let obj = elems[i]
    if ((zindex > highest) && (zindex != 'auto')){
      highest = zindex
      ret = obj
    } 
  }
  return ret
}

// The .style setter silently discards any value containing '!important', so
// every forced style has to go through setProperty(prop, value, 'important').
function hideAll(selector){
  let hidden = 0
  for (let el of document.querySelectorAll(selector)){
    el.style.setProperty('display', 'none', 'important')
    hidden++
  }
  return hidden
}

// Collects every element in the document, descending into open shadow roots
// (YouTube's ytd-* components keep most of their markup there).
function collectElements(root){
  let found = []
  for (let el of root.querySelectorAll('*')){
    found.push(el)
    if (el.shadowRoot) found = found.concat(collectElements(el.shadowRoot))
  }
  return found
}

// Rewrites every computed 'overflow: hidden' to 'auto'. Reads the *computed*
// value so rules from stylesheets are caught, not just inline styles, and
// writes with setProperty(..., 'important') because the .style setter silently
// drops any value containing '!important'.
function unlockOverflow(){
  const props = ['overflow', 'overflow-x', 'overflow-y']
  let changed = 0
  for (let el of collectElements(document)){
    const computed = getComputedStyle(el)
    for (let prop of props){
      if (computed.getPropertyValue(prop) === 'hidden'){
        el.style.setProperty(prop, 'auto', 'important')
        changed++
      }
    }
  }
  return changed
}

function fixYoutubeAdBlockerModal(){
  let modal = [...document.getElementsByTagName('ytd-popup-container')][0]
  modal.remove()
}

function fixImgurCom(){
  removeImgurSelfAds()
  removeImgurSponsoredAds()
  removeImgurElementByClass('div', 'Accolade-background')
  removeImgurElementByClass('div', 'NewPostsNotification')
  removeImgurElementByClass('a', 'EmeraldBanner')

}

function removeImgurSelfAds(){
  hideAll('.Ad.up-show')
  hideAll('.Footer-wrapper')
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
  for (let el of document.querySelectorAll('div')){
    if (el.className.includes('sp_') || el.id.includes('sp_')) el.remove()
  }
}

function fixNYTimesCom(){
  for (let el of document.querySelectorAll('div')){
    if (el.id.includes('gateway-content') || el.id.includes('wrapper') || el.className.includes('css-1bd8bfl')){
      el.remove()
      continue
    }
    if (el.style.background.includes('gradient')){
      el.style.setProperty('background', 'none', 'important')
    }
  }
}

function fixStandardNet(){
  hideAll('#subscription-modal')
  hideAll('.modal-backdrop')
  hideAll('.redacted-overlay')
  hideAll('.subscription-required')
  for (let el of document.querySelectorAll('.hide')) el.classList.remove('hide')
}

function fixMediumCom(){
  let currentPage = window.location.href
  let session_id = Array(19).fill().map(()=>"0123456789".charAt(Math.random() * 10)).join("")
  localStorage.setItem('post-article|posts-viewed-today-count', 0)
  let pvObject = Object.keys(localStorage).map(key => key.includes('pv|'))
  let pvIndex = pvObject.indexOf(true)
  let pvValue = Object.entries(localStorage)[pvIndex][0]
  localStorage.setItem(pvValue, Date.now())
  localStorage.setItem('post-article|posts-viewed-count', 0)
  localStorage.setItem('post-article|posts-viewed-month-count', 0)
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
  // Site fixes are best-effort. If one throws (modal not present, element
  // missing) the overflow unlock below still needs to run, so swallow it.
  try {
    switch (window.origin){
      case 'https://www.youtube.com':
        fixYoutubeAdBlockerModal()
        break
      case 'https://weather.com':
        fixWeatherCom()
        break
      case 'https://www.nytimes.com':
        fixNYTimesCom()
        break
      case 'https://imgur.com':
        fixImgurCom()
        break
      case 'https://www.standard.net':
        fixStandardNet()
        break
      default:
        if (document.body.innerHTML.includes('medium.com')){
          fixMediumCom()
          break
        }
        let bla = findHighestZIndex()
        if (bla) bla.remove()
    }
  } catch (err) {
    console.log('Pop Up Remover: site fix failed, unlocking scroll anyway', err)
  }

  window.onscroll = function(e) {
    let scrollUp = this.oldScroll > this.scrollY
    if (scrollUp) fixImgurCom()
    this.oldScroll = this.scrollY;
    if (!scrollUp) {
      removeImgurElementByClass('div', 'Accolade-background')
      removeImgurElementByClass('div', 'NewPostsNotification')
    }
  }

  if (window.performance) {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      fixImgurCom()
    }
  }

  const unlocked = unlockOverflow()
  console.log(`Pop Up Remover: set overflow to auto on ${unlocked} declaration(s)`)
})()
