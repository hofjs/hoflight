import { HofHtmlElement, html } from "../../../lib/esm/hof.js";
class PersonDataList extends HofHtmlElement {
    constructor() {
        super(...arguments);
        // Property
        this.persons = [];
    }
    // Helper Function
    getBirthday(person) {
        let birthday = new Date();
        birthday.setFullYear(birthday.getFullYear() - person.age);
        return birthday.toLocaleDateString();
    }
    templates() {
        return html `
            ${this.persons.map(person => html `
                <li>
                    ${person.name} - ${person.age} years (birthday: ${this.getBirthday(person)})
                    [<a href="#" onclick="${() => this.emitEvent('edititem', person)}">Edit</a>]
                    [<a href="#" onclick="${() => this.emitEvent('deleteitem', person)}">Delete</a>]
                    
                </li>`)}`;
    }
}
customElements.define("person-data-list", PersonDataList);
