const container = document.getElementsByClassName('container')[0];
const sendButton = document.getElementById('send');

sendButton.addEventListener('click', (evt) => {
    const generationMethod = document.getElementById('it_or_gen').value;
    const setString = document.getElementById('full_set').value;
    let req = new XMLHttpRequest();
    
   if (generationMethod === 'Generator') {
        req.open('POST', '/powerset-gen');
   }
   else {
       req.open('POST', '/powerset-iter');
   }
   container.setAttribute('id', generationMethod);
   req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
   req.responseType = 'json'; 
   req.onload = function(evt) {
       if ( req.status == 200 ) { 
           let res = req.response;
           console.log('response', res);
           const powerSet = res.powerSet;
           container.innerHTML = "";

           for (let subset of powerSet) {
               const ele = document.createElement('div');
               let string = '{';
               string += subset.join(',');
               string +='}';
               ele.innerHTML = string;
               ele.setAttribute('class', 'element');
               ele.setAttribute('id', generationMethod);
               container.appendChild(ele);
           }
       }
       else {
        console.log('err', req );
        }
   }
   const setArray = setString.split(',');
   let message = {set: setArray};
   req.send(JSON.stringify(message));
})