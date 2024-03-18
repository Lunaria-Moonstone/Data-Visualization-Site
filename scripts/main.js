// -- 路由集合
const ROUTESET = new Set([ 'home', 'dataviews' ])

// -- 当前路由
let route = ''

// -- 路由载入
let route_preload = {
  'home': () => {
    $('head').append(`<link rel="stylesheet" type="text/css" href="/assets/home.css" />`)
    $('#template').load('/pages/home.html', () => {
      $.getScript('/scripts/home.js', () => initMap())      
    })
  },
  'dataviews': () => {
    $('head').append(`<link rel="stylesheet" type="text/css" href="/assets/dataviews.css" />`)
    $('#template').load('/pages/dataviews.html', () => {
      $.getScript('/scripts/dataviews.js', () => initMainViews())      
    })
  }
}

/**
 * 销毁路由
 */
function destroy() {
  switch(route) {
    case 'home':
      $("script[src='/scripts/home.js']").remove()
      $("link[href='/assets/home.css']").remove()
      console.info('destroy home')
      break
    case 'dataviews':
      $("script[src='/scripts/dataviews.js']").remove()
      $("link[href='/assets/dataviews.css']").remove() 
      console.info('destroy dataviews')
      break
  }
}

/**
 * 加载路由
 * @param {string} route_name 
 * @returns 
 */
function go2(route_name) {

  // -- 如果欲进入页面与当前页面相同，不执行后续步骤
  if (route_name === route) return

  // -- 进入页面前先销毁旧页面
  destroy()

  // -- 类型诊断
  if (typeof route_name !== 'string') throw new Error('route_name must be a string')
  if (! ROUTESET.has(route_name)) throw new Error('route_name must be one of ' + ROUTESET.join(', '))

  route_preload[route_name]()
  route = route_name
}
