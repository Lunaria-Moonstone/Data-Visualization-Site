var map;
var markLayers;

var data;

/**
 * 模拟从后端获取楼盘及对应位置数据
 * @returns 
 */
function mockFetchData() {
  return {
    "status": "success",
    "data": [
      {
        "id": "1",
        "name": "大众新城",
        "location": "45.694857, 126.632442",
        "address": "民吉街63号",
        "price": "8452",
        "vendor": "黑龙江大众新城房地产开发有限公司",
        "management": "厦门市住总物业管理有限公司",
      },
      {
        "id": "2",
        "name": "永吉家园",
        "location": "45.731941, 126.69399",
        "address": "征仪路436号",
        "price": "7647",
        "vendor": "哈尔滨房地产开发有限公司",
        "management": "金豪斯物业公司",
      }
    ]
  }
}

function initMainMap() {
  initMap()
  initMainMapSearch()
}

function initMainMapSearch() {
  layui.use(function () {

    const mapSkip = (lat, lng) => {
      map.setCenter(new TMap.LatLng(lat, lng))
    }

    var dropdown = layui.dropdown
    var think_word = $('#main-map-search-input').val
    var think_word_list = data['data'].filter(x => x.name.includes('') || x.address.includes('')).map(x => { return { id: x.id, title: x.name } })

    // console.log(data['data'].filter(x => x.name.includes('') || x.address.includes('')).map(x => { return { id: x.id, title: x.name } }))
    dropdown.render({ 
      id: 'main-map-search-autocomplete',
      elem: '#main-map-search-input', 
      data: think_word_list, 
      click: function (target) { 
        this.elem.val(target.title) 
        mapSkip(...data['data'].filter(x => x.id === target.id)[0]['location'].match(/[\d\.]+/g).map(x => Number(x)))
      },
      // style: 'width: 234px; padding-left: 0;'
      className: 'layui-form-select-dropdown-search',
    }) 
  }) 
  // 监听搜索框的输入事件
  $('#main-map-search-input').on('input', function () {
    var dropdown = layui.dropdown
    var think_word = $(this).val()
    var think_word_list = data['data'].filter(x => x.name.includes(think_word) || x.address.includes(think_word)).map(x => { return { id: x.id, title: x.name } })
    console.log(think_word, think_word_list)
    dropdown.reload('main-map-search-autocomplete', {
      data: think_word_list,
      show: true
    })
  })
}

function initMap() {
  var center = new TMap.LatLng(45.773816, 126.618839)
  map = new TMap.Map(document.getElementById('main-map'), {
    center: center,//设置地图中心点坐标
    zoom: 12,   //设置地图缩放级别
    pitch: 43.5,  //设置俯仰角
    rotation: 45    //设置地图旋转角度
  });
  markLayers = new TMap.MultiMarker({
    map: map,
    styles: {
      "markStyle": new TMap.MarkerStyle({
        "width": 25,
        "height": 35,
        "anchor": { x: 16, y: 32 },
      })
    },
    geometries: []
  })

  // -- 从后台获取数据并写入
  data = mockFetchData()
  if (data['status'] !== 'success') throw new Error('fetch data error')
  // markLayers.add([{
  //   "id": Date.now().toLocaleString(),
  //   "styleId": 'markStyle',
  //   "position": new TMap.LatLng(45.731941, 126.69399),
  // }, {
  //   "id": Date.now().toLocaleString(),
  //   "styleId": 'markStyle',
  //   "position": new TMap.LatLng(45.694857, 126.632442),
  // }])
  markLayers.add(data['data'].map(item => ({
    "id": item['id'],
    "styleId": 'markStyle',
    "position": new TMap.LatLng(...item['location'].match(/[\d\.]+/g).map(x => Number(x))),
  })))
  //初始化infoWindow
  var infoWindow = new TMap.InfoWindow({
    map: map,
    position: new TMap.LatLng(39.984104, 116.307503),
    offset: { x: 0, y: -32 } //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
  });
  infoWindow.close();//初始关闭信息窗关闭
  markLayers.on("click", function (evt) {
    target = data['data'].find(tg => tg['id'] === evt.geometry.id)
    if (!target) throw new Error('target not found')
    //设置infoWindow
    infoWindow.open(); //打开信息窗
    infoWindow.setPosition(evt.geometry.position);//设置信息窗位置
    infoWindow.setContent(`
      <div class="main-map-info-window">
        <h4>${target['name']} <span style="color: red" font-size="large">${target['price']}</span> <span style="font-size: middle">元/㎡</span></h4>
        <div><span>小区地址:</span> <span>${target['address']}</span></div>
        <div><span>开发商:</span> <span>${target['vendor']}</span></div>
        <div><span>物业公司:</span> <span>${target['management']}</span></div>
      </div>
    `);//设置信息窗内容
  })
}


// function destroyMap() {
//   delete map
//   delete center
// }