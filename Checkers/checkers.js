function createGame(boardLayout, divId) {
    const boardLookup = boardLayout.split('\n').map((i) => i.split(''));
    
    const boardDiv = document.getElementById(divId);
    
    const SVG_URL = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(SVG_URL, 'svg');

    const length = 500;
    svg.setAttribute('width', `${length}`);
    svg.setAttribute('height', `${length}`);
    svg.setAttribute('viewBox', `0 0 10 10`);

    for(i = 0; i < 10; i++) {
        for(j = 0; j < 10; j++) {
            
            const boardSquare = document.createElementNS(SVG_URL, 'rect');
            boardSquare.setAttribute('x', j);
            boardSquare.setAttribute('y', i);

            if (i%2 === 0) {
                if (j%2 === 0) {
                    boardSquare.setAttribute('class', 'lightSquare');
                }
                else {
                    boardSquare.setAttribute('class', 'darkSquare');
                }
            }
            else {
                if (j%2 === 0) {
                    boardSquare.setAttribute('class', 'darkSquare');
                }
                else {
                    boardSquare.setAttribute('class', 'lightSquare');
                }
            }
            svg.appendChild(boardSquare);

            const pieceSymbol = boardLookup[i][j];
            let checkersPiece = document.createElementNS(SVG_URL, 'circle');
            checkersPiece.setAttribute('cx', `${j+0.5}`);
            checkersPiece.setAttribute('cy', `${i+0.5}`);
            checkersPiece.setAttribute('r', 0.4);

            if(pieceSymbol === 'W') {
                checkersPiece.setAttribute('class', 'lightPiece');
                svg.appendChild(checkersPiece);
            }
            else if(pieceSymbol === 'B') {
                checkersPiece.setAttribute('class', 'darkPiece');
                svg.appendChild(checkersPiece);
            }
        }
    }
    let checkersPiece = document.createElementNS(SVG_URL, 'circle');
    checkersPiece.setAttribute('fill', 'black');
    
    
    svg.appendChild(checkersPiece);

    boardDiv.appendChild(svg);
    console.log(boardLookup);
}

const stateA = `-W-W-W-W-W
W-W-W-W-W-
-W-W-W-W-W
W-W-W-W-W-
----------
----------
-B-B-B-B-B
B-B-B-B-B-
-B-B-B-B-B
B-B-B-B-B-`

const stateB = `-W-W-W-W-W
W-W-W-W-W-
-W-W-W-W-W
W-W-W-W---
---------W
--B-------
-B---B-B-B
B-B-B-B-B-
-B-B-B-B-B
B-B-B-B-B-`

const stateC = `-W-W-W-W-W
W-W-W-W-W-
-W-W-W-W-W
W-W---W-W-
---W------
--B-------
-B---B-B-B
B-B-B-B-B-
-B-B-B-B-B
B-B-B-B-B-`

const stateD = `-W-W-W-W-W
W-W-W-W-W-
-W-W-W-W-W
W-W---W-W-
-B---W----
----------
-B---B-B-B
B-B-B-B-B-
-B-B-B-B-B
B-B-B-B-B-`

const stateE = `-W-W-W-W-W
W-W-W-W-W-
-W-W-W-W-W
W-W-W-W---
-B--------
--------W-
-B---B-B-B
B-B-B-B-B-
-B-B-B-B-B
B-B-B-B-B-`

createGame(stateA, 'checkerboard_1');
createGame(stateB, 'checkerboard_2');
createGame(stateC, 'checkerboard_3');
createGame(stateD, 'checkerboard_4');
createGame(stateE, 'checkerboard_5');