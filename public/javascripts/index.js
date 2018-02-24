$(document).ready(function () {
  var timeData = [],
    humidityData = [],
    ramp1Data=[];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Ramp1',
        yAxisID: 'Ramp1',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: ramp1Data
      },
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Kepserver: Simulate Driver "Ramp1"',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Ramp1',
        type: 'linear',
        scaleLabel: {
          labelString: 'Cuenta',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.Ramp1) {
        return;
      }
      timeData.push(obj.time);
      ramp1Data.push(obj.ramp1);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        ramp1Data.shift();
      }

      
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
