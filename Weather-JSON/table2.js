const loadJSON = document.getElementById('load_JSON');
        const table2 = document.getElementById('table2');
        const startDate2 = document.getElementById('start_date_2');
        const endDate2 = document.getElementById('end_date_2');

        loadJSON.addEventListener('click', (evt) => {
            let req = new XMLHttpRequest();
            req.open('POST', '/data');
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            req.responseType = 'json'; 
            req.onload = function(evt) {
                if ( req.status == 200 ) { 
                    let res = req.response;
                    table2.innerHTML = 
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
                        table2.appendChild(row);
                }}
                else {
                    console.log('err', req );
                }
            }
            let message = {
                startDate : startDate2.value, 
                endDate : endDate2.value
            };
            req.send(JSON.stringify(message));
        })