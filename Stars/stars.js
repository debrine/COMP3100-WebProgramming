class NStar extends HTMLElement {
    constructor () {
        super();
        
        const SVG_URL = "http://www.w3.org/2000/svg";

        const shadow = this.attachShadow({mode: 'open'});
        const template = document.getElementById('npoint-star');
        const templateContent = template.content;
        const svg = templateContent.querySelector('svg');
        svg.innerHTML= '';
        svg.setAttribute('height', this.getAttribute('height'));
        svg.setAttribute('width', this.getAttribute('width'));

        const numPoints = this.getAttribute('n');
        const strokeColour = this.getAttribute('stroke');
        const fillColour = this.getAttribute('fill');
        const angleShift = (2*Math.PI) / (numPoints*2);
        
        let radius;
        let pointCoordinates = [];
        for(let i = 0; i < 2*numPoints; i++) {
            radius = 2;
            if (i % 2 !== 0) {
                radius = 1;
            }

            const theta = i * angleShift;
            const xCoord = (Math.cos(theta) * radius) + 5;
            const yCoord = (Math.sin(theta) * radius) + 5;

            let pointPair = [];

            pointPair[0] = xCoord;
            pointPair[1] = yCoord;
           
            pointCoordinates[i] = pointPair;
        }
        pointCoordinates[2*numPoints] = pointCoordinates[0];
        

        const star = document.createElementNS(SVG_URL, 'polygon');

        let coordinateString = "";
        for (let i = 0; i <= numPoints*2; i++) {
            let stringToAdd = `${pointCoordinates[i][0]},${pointCoordinates[i][1]} `;
            coordinateString += stringToAdd;
        }

        star.setAttribute('points', coordinateString);
        star.setAttribute('stroke', strokeColour);
        star.setAttribute('fill', fillColour);

        svg.appendChild(star);

        console.log(`${this}, height: ${this.getAttribute('height')}, svg height: ${svg.getAttribute('height')}`);

        const cloned = templateContent.cloneNode(true);
        shadow.appendChild(cloned);
    }
}
customElements.define('npoint-star', NStar);