class ValueList extends HTMLElement {
    constructor () {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        const template = document.getElementById('value-list');
        const templateContent = template.content;
        
        const cloned = templateContent.cloneNode(true);
        shadow.appendChild(cloned);

        const inputs = shadow.querySelector('.table .inputs');
        const addButton = shadow.querySelector('.table .buttons #add');
        const table = shadow.querySelector('.table');
        const deleteButton = shadow.querySelector('.table .buttons #delete');
        const heading = shadow.querySelector('.table .heading');
        heading.innerHTML = this.innerHTML;

        const updateValues = (evt) => {
            const allInputs = shadow.querySelector('.table .inputs')
            let newValues = [];
            for(let i = 0; i < allInputs.childNodes.length; i++) {
                newValues[i] = allInputs.childNodes[i].value;
            }
            this.setAttribute('value', newValues);
        }

        addButton.addEventListener('click', (evt) => {
            const newValue = document.createElement('input');
            newValue.setAttribute('class', 'value');
            newValue.value = '0';
            
            newValue.addEventListener('change', updateValues);
            inputs.appendChild(newValue);
        })

        let selectedInput = null;
        table.addEventListener('click', (evt) => {
            
            const target = evt.target;
            const targetName = target.nodeName;
            if (targetName !== 'INPUT') return;
            selectedInput = target;
        })

        deleteButton.addEventListener('click', (evt) => {
            if (selectedInput === null) return;
            inputs.removeChild(selectedInput);
            selectedInput = null;
            updateValues;
        })
    }
}
customElements.define('value-list', ValueList);