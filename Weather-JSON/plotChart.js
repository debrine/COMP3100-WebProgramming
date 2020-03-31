const plotButton = document.getElementById('plot');
const startDate3 = document.getElementById('start_date_3');
const endDate3 = document.getElementById('end_date_3');
const maxCheck = document.getElementById('max_check');
const minCheck = document.getElementById('min_check');
const meanCheck = document.getElementById('mean_check');
const precipCheck = document.getElementById('precip_check');
const rainCheck = document.getElementById('rain_check');
const snowCheck = document.getElementById('snow_check');
const groundSnowCheck = document.getElementById('ground_snow_check');

let chart = document.getElementById('chart').getContext('2d');
const indexLookup = {
    'maxtemp': 0,
    'mintemp': 1,
    'meantemp': 2,
    'precip': 3,
    'rain': 4,
    'snow': 5,
    'groundsnow': 6
};
let lineChart = new Chart(chart, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'maxtemp',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'blue',
            borderColor: 'blue'
        }, {
            label: 'mintemp',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'red',
            borderColor: 'red'
        }, {
            label: 'meantemp',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'green',
            borderColor: 'green'
        }, {
            label: 'precip',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'orange',
            borderColor: 'orange'
        }, {
            label: 'rain',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'aqua',
            borderColor: 'aqua'
        }, {
            label: 'snow',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'black',
            borderColor: 'black'
        }, {
            label: 'groundsnow',
            showLine: true,
            fill: false,
            radius: 4, 
            pointStyle: 'cir',
            pointBackgroundColor: 'brown',
            borderColor: 'brown'
        }]
    }
})

plotButton.addEventListener('click', (evt) => {
    let selectedColumns = [];
    if (maxCheck.checked) {
        selectedColumns.push('maxtemp');
    }
    if (minCheck.checked) {
        selectedColumns.push('mintemp');
    }
    if (meanCheck.checked) {
        selectedColumns.push('meantemp');
    }
    if (precipCheck.checked) {
        selectedColumns.push('precip');
    }
    if (rainCheck.checked) {
        selectedColumns.push('rain');
    }
    if (snowCheck.checked) {
        selectedColumns.push('snow');
    }
    if (groundSnowCheck.checked) {
        selectedColumns.push('groundsnow');
    }

    let req = new XMLHttpRequest();
    req.open('POST', '/plot');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
        if (req.status == 200) {    
            for (let i = 0; i < lineChart.data.datasets.length; i ++) {
                lineChart.data.datasets[i].data = [];
            }
            let res = req.response;
            console.log('response', res);
            let dataPoints = {};
            for (let column of selectedColumns) {
                dataPoints[column] = [];
                for (let i = 0; i < res.length; i ++) {
                    dataPoints[column].push({x: i+1, y: res[i][column]});
                }
                
                lineChart.data.datasets[indexLookup[column]].data = dataPoints[column];
            }
            lineChart.update();
        }
        else {
            console.log('error', req);
        }   
    }
    let message = {
        startDate: startDate3.value,
        endDate: endDate3.value,
        selectedColumns: selectedColumns
    };
    req.send(JSON.stringify(message));
})
