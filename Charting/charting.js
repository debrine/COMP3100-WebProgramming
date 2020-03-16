
function getPoints() {
    let xPoints = document.getElementById('x').getAttribute('value');
    let yPoints = document.getElementById('y').getAttribute('value');
    xPoints = xPoints.split(',');
    yPoints = yPoints.split(',');
    console.log(xPoints);
    console.log(yPoints);
    return [xPoints, yPoints];
}
const updateButton = document.getElementById('update');
//updateButton.addEventListener('click', getPoints);

let chart = document.getElementById('chart').getContext('2d');

let scatterChart = new Chart(chart, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Scatter',
            showLine: false,
            fill: false,
            borderColor: 'red',
            radius: 4,
            pointStyle: 'rect',
            pointBackgroundColor: 'blue'
        }]
}})

updateButton.addEventListener('click', (evt) => {
    [xPoints, yPoints] = getPoints();
    if (xPoints.length !== yPoints.length) return;
    let points = [];
    for (let i = 0; i < xPoints.length; i++) {
        points.push( {x: xPoints[i], y: yPoints[i]});
    }
    scatterChart.data.datasets[0].data = points;
    scatterChart.update();
})