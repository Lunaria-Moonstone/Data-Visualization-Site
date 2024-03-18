function initMap() {
  var center = new TMap.LatLng(45.773816,126.618839)
  map = new TMap.Map(document.getElementById('main-map'), {
    center: center,//设置地图中心点坐标
    zoom: 17.2,   //设置地图缩放级别
    pitch: 43.5,  //设置俯仰角
    rotation: 45    //设置地图旋转角度
  });
}

// function destroyMap() {
//   delete map
//   delete center
// }