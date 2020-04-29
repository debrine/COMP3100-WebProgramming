

class SpreadSheet extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        const template = document.getElementById('spread-sheet');
        const templateContent = template.content;
        const cloned = templateContent.cloneNode(true);
        shadow.appendChild(cloned);

        const addRowButton = shadow.querySelector('#add_row');
        const addColumnButton = shadow.querySelector('#add_column');
        const deleteRowButton = shadow.querySelector('#delete_row');
        const deleteColumnButton = shadow.querySelector('#delete_column');
        const saveButton = shadow.querySelector('#save');
        const inputFrame = shadow.querySelector('#sheet_inputs');
        const csvDownload = shadow.querySelector('#csv_download');
        const csvLoad = shadow.querySelector('#csv_load');
        let selectedRow;
        let selectedColumnIndex;

        const id = this.textContent;
        console.log('test', this.querySelector(':nth-child(2)'))
        
        let data;
        
        if (id === '' || id === null || id === undefined) {
            data = null;
        }
        else {
            data = sheetData[id];
        }
        function buildTable(data) {
            inputFrame.innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                const row = document.createElement('div');
                for (let j = 0; j < data[0].length; j++) {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    input.value = data[i][j];
                    row.appendChild(input);
                }
                inputFrame.appendChild(row);
            }
        }
        if (data != undefined || data != null) {
            buildTable(data)
        }

        else {
            for (let i = 0; i < 3; i ++) {
                const row = document.createElement('div');
                for (let j = 0; j < 3; j++) {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    row.appendChild(input);
                }
                inputFrame.appendChild(row);
                sheetData[id] = [[,,],[,,],[,,]];
            }
        }

        addRowButton.addEventListener('click', (evt) => {
            const row = document.createElement('div');
            let rowData = [];
            for (let i = 0; i< inputFrame.firstChild.childNodes.length; i++) {
                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                row.append(input);
                rowData.push(input.value);
            }
            inputFrame.append(row);
            sheetData[id].push(rowData);
            console.log('new sheet data', sheetData[id]);
        })

        addColumnButton.addEventListener('click', (evt) => {
            for (let j = 0; j < inputFrame.childNodes.length; j++) {
                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                inputFrame.childNodes[j].appendChild(input);
                sheetData[id][j].push(input.value);
            }
            console.log(sheetData[id])

        })

        inputFrame.addEventListener('click', (evt) => {
            const target = evt.target;
            console.log('target', target);
            console.log('target parent', target.parentNode);
            if (target.nodeName == 'INPUT') {
                const parent = target.parentNode;
                const allDivs = inputFrame.childNodes;
                for (let j=0; j<allDivs.length;j++) {
                    if (allDivs[j] === parent) {
                        selectedRow = {node: parent, index: j};
                    }
                }
                
                for (let i = 0; i <parent.childNodes.length; i++) {
                    if (parent.childNodes[i] === target) {
                        selectedColumnIndex = i;
                    }
                }
                

            }

        })

        deleteRowButton.addEventListener('click', (evt) => {
            if (selectedRow === undefined) {
                //pass
            }
            else {
                inputFrame.removeChild(selectedRow.node);
                sheetData[id].splice(selectedRow.index, 1);
                selectedRow = undefined;
            }
        })

        deleteColumnButton.addEventListener('click', (evt) => {
            console.log('column ele', inputFrame.childNodes)
            if (selectedColumnIndex === undefined) {
                //pass
            }
            else {
                for (let i = 0; i < inputFrame.childNodes.length; i++) {
                    let ele = inputFrame.childNodes[i].childNodes[selectedColumnIndex];
                    
                    inputFrame.childNodes[i].removeChild(ele);
                    sheetData[id][i].splice(selectedColumnIndex, 1);
                }
                selectedColumnIndex = undefined;
            }
             
        })

        function getData() {
            let newData = [];
            console.log('input frame', inputFrame);
            for (let i = 0; i < inputFrame.childNodes.length; i++) {
                let row = [];
                for (let j = 0; j < inputFrame.childNodes[0].childNodes.length; j++) {
                    row.push(inputFrame.childNodes[i].childNodes[j].value);
                }
                newData.push(row);
            }
            return newData;
        }

        saveButton.addEventListener('click', (evt) => {
            
            let newData = getData();
            let req = new XMLHttpRequest();
            req.open('POST', '/user_sheets');
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            req.responseType = 'json'; 
            req.onload = function(evt) {
                if (req.status === 200) {
                    const res = req.response;
                    if (res.status === 'success') {
                        alert('Database updated.');
                    }
                    else {
                        console.log('error', res.error);
                    }
                }
                else {

                }
            }
            sheetData[id] = newData;
            let stringData = '';
            for (let i = 0; i < newData.length; i++) {
                for (let j = 0; j < newData[0].length - 1; j++) {
                    stringData += newData[i][j];
                    stringData += ',';
                }
                stringData += newData[i][newData[0].length - 1];
                stringData += '/'
            }
            stringData = stringData.substring(0, stringData.length - 1);
            console.log('string data', stringData);
            let message = {request: 'update_sheet', id: id, data: stringData};
            req.send(JSON.stringify(message));
        })

        csvDownload.addEventListener('click', (evt) => {
            
            //this is not original, and was found at: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
            let newData = getData();
            let csvContent = "data:text/csv;charset=utf-8,";
            newData.forEach(function(rowArray) {
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            });
            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `sheet${id}.csv`);
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link);
        })
        
        csvLoad.addEventListener('change', (evt) => {
            const {files} = csvLoad;
            const file = files[0];

            const fileReader = new FileReader();
            fileReader.onload = async (evt) => {
                console.log('reader result', fileReader.result);
                const newData = fileReader.result;
                const array1 = newData.split('\n');
                console.log('first split', array1);
                let array2 = [];
                for (let line of array1) {
                    line = line.substring(0, line.length - 1);
                    let subarray = line.split(',');
                    array2.push(subarray);
                }
                console.log('array 2', array2);
                array2.pop();
                buildTable(array2)
            }
            fileReader.readAsText(file);

        })
    };
    
}
customElements.define('spread-sheet', SpreadSheet);