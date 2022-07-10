import { HofHtmlElement, html, css } from "../../../lib/esm/hof.js";

class PersonDataInput extends HofHtmlElement {
    label = ""
    value = ""

    constructor() {
        super("label");
    }

    styles = css`
        input { color: blue; }
    `;

    test(e) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: e.target.value }))
    }

    templates() {
        return html`
            ${this.label}: <input value="${this.value}" onchange="${this.test}" />
        `
    }
}

customElements.define("person-data-input", PersonDataInput)