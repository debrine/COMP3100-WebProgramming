const loadData = document.getElementById('load_data');
const table1 = document.getElementById('table1');
const startDate1 = document.getElementById('start_date_1');
const endDate1 = document.getElementById('end_date_1');
loadData.addEventListener( 'click', (evt) => {
    let req = new XMLHttpRequest();
    req.open('GET', `/data/${startDate1.value}/${endDate1.value}`); 
    req.responseType = 'json';
    req.onload = function(evt) {
        if ( req.status == 200 ) { 
            let res = req.response;
            table1.innerHTML = 
            `<tr>
                <th>time</th>
                <th>maxtemp</th>
                <th>mintemp</th>
                <th>meantemp</th>
                <th>precip</th>
                <th>rain</th>
                <th>snow</th>
            </tr>`
            console.log('response', res );
            for (let report of res) {
                const row = document.createElement('tr');
                
                let columns = [];
                for(let i = 0; i < 7; i++) {
                    columns.push(document.createElement('td'));
                }
                columns[0].innerHTML = report.time;
                columns[1].innerHTML = report.maxtemp;
                columns[2].innerHTML = report.mintemp;
                columns[3].innerHTML = report.meantemp;
                columns[4].innerHTML = report.precip;
                columns[5].innerHTML = report.rain;
                columns[6].innerHTML = report.snow;
                for(let i = 0; i < columns.length; i++) {
                    row.appendChild(columns[i]);
                }
                table1.appendChild(row);
            }
            
        }
        else {
            console.log('err', req );
        }
    }
    req.send();
} );