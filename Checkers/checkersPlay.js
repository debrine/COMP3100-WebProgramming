class CheckerGame extends HTMLElement {
    constructor () {
        super();
        const SVG_URL = "http://www.w3.org/2000/svg";

        const shadow = this.attachShadow({mode: 'open'});
        const template = document.getElementById('checker-game');
        const templateContent = template.content;
        const svg = templateContent.getElementById('board');
        
        
        const boardLayout = this.innerHTML.trim();
        const boardLookup = boardLayout.split('\n').map((k) => k.split(''));
        console.log(svg);

        this.addEventListener('mousedown', function(evt) {
            evt.preventDefault();
            const target = evt.target;
            const targetName = target.nodeName;
            console.log(target);
            if (targetName !== 'circle') return;

            let oldX = parseFloat(target.getAttribute('cx'));
            let oldY = parseFloar(target.getAttribute('cy'));

            let delta = svg.createSVGPoint();
            delta.x = evt.clientX;
            delta.y = evt.clientY;

            const ctm = target.getScreenCTM();
            const inv_ctm = ctm.inverse();
            delta = delta.matrixTransform(inv_ctm);

            oldX -= delta.x;
            oldY -= delta.y;

            function dragging(evt) {
                let point = svg.createSVGPoint();
                point.x = evt.clientX;
                point.y = evt.clientY;
                svgPoint = point.matrixTransform(inv_ctm);
                svgPoint.x += oldX;
                svgPoint.y += oldY;
                target.setAttribute('cx', Math.round(svgPoint.x));
                target.setAttribute('cy', Math.round(svgPoint.y));
            }
            svg.addEventListener('mousemove', dragging);
            window.addEventListener('mouseup', function(evt) {
                editor.removeEventListener('mousemove', dragging);
                console.log('stop', evt);
            }, {once: true});

        });


        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                
                const boardSquare = document.createElementNS(SVG_URL, 'rect');
                boardSquare.setAttribute('x', j);
                boardSquare.setAttribute('y', i);
                boardSquare.setAttribute('height', 1);
                boardSquare.setAttribute('width', 1);
    
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
                
                let checkersPiece;
                if(pieceSymbol !== '-') {
                    checkersPiece = document.createElementNS(SVG_URL, 'circle');
                    checkersPiece.setAttribute('cx', `${j+0.5}`);
                    checkersPiece.setAttribute('cy', `${i+0.5}`);
                    checkersPiece.setAttribute('r', 0.4);
                }
    
                

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
        

        
        const cloned = templateContent.cloneNode(true);
        shadow.appendChild(cloned);

        

    }
     
    
}
customElements.define('checker-game', CheckerGame)