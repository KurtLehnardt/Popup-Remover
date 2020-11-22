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
  let ads= [...document.getElementsByClassName('Ad   up-show')]
  console.log('ads', ads)
  ads.map(ad => ad.style.display = 'none')
  let adsFooter = [...document.getElementsByClassName('Footer-wrapper')]
  console.log('adsFooter', adsFooter)
  adsFooter.map(footer => footer.style.display = 'none')

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
  document.body.style.overflowY = 'scroll'
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
      elems[i].style.background = 'none'
    }
    if (elems[i].style.overflow === 'hidden'){
      elems[i].style.overflow = 'scroll'
    }
    if (elems[i].className === 'css-mcm29f'){
      elems[i].style.overflow = 'scroll'
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
    default: 
      let bla = findHighestZIndex()
      bla.remove()
      console.log(bla)
  }



  document.body.style.overflowY = 'scroll'
  document.body.style.overflow = 'scroll'
  const html = document.getElementsByTagName('html')[0]
  html.style.overflow = 'auto'
  
})()