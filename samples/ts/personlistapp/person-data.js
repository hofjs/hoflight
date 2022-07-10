import { HofHtmlElement, html } from "../../../lib/esm/hof.js";
import { Person } from "./Person.js";
import "./person-data-input.js";
import "./person-data-list.js";
import "./person-data-info.js";
class PersonData extends HofHtmlElement {
    constructor() {
        super(...arguments);
        this.selected = new Person();
        this.persons = [new Person("Alex", 21), new Person("Chris", 19), new Person("Mike", 19)];
    }
    changeName(event) { this.selected.name = event.detail; this.selected = Object.assign({}, this.selected); }
    changeAge(event) { this.selected.age = event.detail; this.selected = Object.assign({}, this.selected); }
    create() { this.selected = new Person(); }
    edit(event) { this.selected = Object.assign({}, event.detail); } // Copy object to avoid live update on text change
    delete(event) { this.persons = this.persons.filter(p => p.id != event.detail.id); this.create(); }
    save() {
        const person = new Person(this.selected.name, this.selected.age);
        if (this.selected.id) // Existing person?
            this.persons = this.persons.map(p => (p.id == this.selected.id) ? person : p);
        else
            this.persons = [...this.persons, person];
        this.create();
    }
    templates() {
        return html `
            <fieldset>
                <person-data-input label="Name" value="${this.selected.name}" onchange="${(event) => this.changeName(event)}"></person-data-input>
                <person-data-input label="Age" value="${this.selected.age}" onchange="${(event) => this.changeAge(event)}"></person-data-input>
                <button onclick="${this.save}">Speichern</button>
            </fieldset>                    
            
            ${this.persons.length} persons in list
            <person-data-list persons="${this.persons}" onedititem="${this.edit}" ondeleteitem="${this.delete}"></person-data-list>
            
            <a href="#" onclick="${this.create}">Neu</a>

            <person-data-info value="${this.persons}"></person-data-info>  
        `;
    }
}
customElements.define("person-data", PersonData);
