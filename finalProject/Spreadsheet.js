class Spreadsheet extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: open});
        const template = document.getElementById('spreadsheet');
        const templateContent = template.content;
        const cloned = templateContent.cloneNode(true);
        shadow.appendChild(cloned);
    }
}