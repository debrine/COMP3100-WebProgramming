const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json();
const port = process.env.PORT || 8000;
//this algorithm was found at: https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript
//credit to stackoverflow user MennyMez, this specific function is not my creation and I am not trying to pass it off as such.
const getAllSubsets = 
      theArray => theArray.reduce(
        (subsets, value) => subsets.concat(
         subsets.map(set => [...set,value])
        ),
        [[]]
      );

function powerSetIter(set) {
    const allSets = getAllSubsets(set);
    let eleCount = 0;
    
    return {
        next: function() {
            if (eleCount >= allSets.length) {
                return {done: true};
            }
            else {
                const returnValue = allSets[eleCount];
                eleCount ++;
                return {done: false, value: returnValue};
            }
        },
        [Symbol.iterator]: function() {return this;}
    }
}

function* powerSetGen(set) {
    const allSets = getAllSubsets(set);
    let eleCount = 0;

    while (eleCount < allSets.length) {
        yield allSets[eleCount];
        eleCount ++;
    }
}


function productSequenceIter(initialValue, multFactor, numElements) {
    let eleCount = 0;
    let currentValue = initialValue;

    return {
        next: function() {
            if (eleCount >= numElements) {
                return {done: true};
            }
            else {
                const returnValue = currentValue;
                currentValue = currentValue * multFactor;
                eleCount ++;
                return {done: false, value: returnValue};
            }
        },
        [Symbol.iterator]: function() {return this;}
    }
}

function* productSequenceGen(initialValue, multFactor, numElements) {
    let eleCount = 0;
    let currentValue = initialValue;

    while (eleCount < numElements) {
        yield currentValue;
        currentValue = currentValue * multFactor;
        eleCount ++;
    }
}


app.get('/', function(req,res) {
    res.sendFile(__dirname+'/sequences_home.html');
})

app.get('/productSequence.js', function(req, res) {
    res.sendFile(__dirname+'/productSequence.js');
})

app.get('/powerSetSequence.js', function(req,res) {
    res.sendFile(__dirname+'/powerSetSequence.js');
})

app.get('/product', function(req, res) {
    res.sendFile(__dirname+'/sequences_product.html');
})

app.get('/powerset', function(req,res) {
    res.sendFile(__dirname+'/sequences_powerset.html');
})

app.post('/product-gen', jsonParser, function(req, res) {
    const message = req.body;
    const initialValue = message.initialValue;
    const multFactor = message.multFactor;
    const numElements = message.numElements;

    let numberSequence = [];
    for (let num of productSequenceGen(initialValue, multFactor, numElements)) {
        numberSequence.push(num);
    }
    let returnMessage = {sequence: numberSequence};
    res.send(returnMessage);
})

app.post('/product-iter', jsonParser, function(req, res) {
    const message = req.body;
    const initialValue = message.initialValue;
    const multFactor = message.multFactor;
    const numElements = message.numElements;

    let numberSequence = [];
    for (let num of productSequenceIter(initialValue, multFactor, numElements)) {
        numberSequence.push(num);
    }
    let returnMessage = {sequence: numberSequence};
    res.send(returnMessage);
})

app.post('/powerset-gen', jsonParser, function(req,res) {
    const message = req.body;
    const initialSet = message.set;
    
    let powerSet = [];
    for (let subset of powerSetGen(initialSet)) {
        powerSet.push(subset);
    }
    let returnMessage = {powerSet: powerSet};
    res.send(returnMessage);
})

app.post('/powerset-iter', jsonParser, function(req,res) {
    const message = req.body;
    const initialSet = message.set;
    
    let powerSet = [];
    for (let subset of powerSetIter(initialSet)) {
        powerSet.push(subset);
    }
    let returnMessage = {powerSet: powerSet};
    res.send(returnMessage);
})

app.listen(port, () => console.log(`Listening on port ${port}!`));