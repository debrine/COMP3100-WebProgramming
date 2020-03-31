const container = document.getElementsByClassName('container')[0];

const sendButton = document.getElementById('send');

sendButton.addEventListener('click', (evt) => {
    const generationMethod = document.getElementById('it_or_gen').value;
    const initialValue = parseInt(document.getElementById('initial_value').value);
    const multValue = parseInt(document.getElementById('mult_value').value);
    const numElements = parseInt(document.getElementById('num_elements').value);
    let req = new XMLHttpRequest();
    
   if (generationMethod === 'Generator') {
        req.open('POST', '/product-gen');
   }
   else {
       req.open('POST', '/product-iter');
   }
   container.setAttribute('id', generationMethod);
   req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
   req.responseType = 'json'; 
   req.onload = function(evt) {
       if ( req.status == 200 ) { 
           let res = req.response;
           console.log('response', res);
           const sequence = res.sequence;
           container.innerHTML = "";
           for (let element of sequence) {
               const ele = document.createElement('div');
               ele.innerHTML = element;
               ele.setAttribute('class', 'element');
               ele.setAttribute('id', generationMethod);
               container.appendChild(ele);
           }

       }
       else {
        console.log('err', req );
        }
   }
   let message = {
       initialValue: initialValue,
       multFactor: multValue,
       numElements: numElements
   };
   req.send(JSON.stringify(message));
})