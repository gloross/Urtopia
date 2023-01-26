var newFetch = window.fetch
window.fetch = function(url, opt){
  const myFetch = newFetch(url, opt)
  myFetch.then(res => res.clone().json()).then(resp=> {
    if (url.indexOf('add.js' !== -1 && resp.id)) {
      fetch('/cart.json')
    }
    if (url.indexOf('/cart.json' !== -1) && resp.token) {
      document.querySelector('#cart-icon-bubble > div > span:nth-child(1)').innerText = resp.item_count
    }
  })
  return myFetch
}