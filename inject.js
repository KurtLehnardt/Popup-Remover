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

	let bla = findHighestZIndex()
	bla.remove()
  console.log(bla)
  if (window.origin.includes('weather.com')){
    fixWeatherCom()
  }
  if (window.origin.includes('nytimes.com')){
    fixNYTimesCom()
  }



})()






