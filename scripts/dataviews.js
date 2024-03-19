var chartDom
var myChart
var option;
var alldata = []
var nowdataidx = 0;

function initMainViews() {
  option = {}
  chartDom = document.getElementById('main-dataviews')
  myChart = echarts.init(chartDom)
  let base = +new Date(1968, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let date = [];

  // generate data
  let data = [Math.random() * 300];
  for (let i = 1; i < 20000; i++) {
    var now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    let d = Math.round((Math.random() - 0.5) * 20 + data[i - 1]);
    if (d < 0) d *= -1;
    data.push(d);
  }
  alldata.push(data)
  data = [Math.random() * 300];
  for (let i = 1; i < 20000; i++) {
    // var now = new Date((base += oneDay));
    // date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    let d = Math.round((Math.random() - 0.5) * 20 + data[i - 1]);
    if (d < 0) d *= -1;
    data.push(d);
  }
  alldata.push(data)

  option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: '区域历史销量曲线'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10
      },
      {
        start: 0,
        end: 10
      }
    ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
        data: data
      }
    ]
  }
  
  option && myChart.setOption(option)
}

function changeOptions() {
  console.info('toggle ')
  nowdataidx = (nowdataidx + 1) % 2
  option.series[0].data = alldata[nowdataidx]
  myChart.setOption(option, true)
}

function destroyMainViews() {
  echarts.dispose(myChart)
}