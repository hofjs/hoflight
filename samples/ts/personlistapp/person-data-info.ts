import { HofHtmlElement, html } from "../../../lib/esm/hof.js";

class PersonDataInfo extends HofHtmlElement {
    value = [];

    templates() {
        return html`
            <br/><br/>Person Info
            <li>First Person: ${(this.value[0]?.name || "-<b>Hi</b>") + " (" + (this.value[0]?.age || "") + ")"}</li>
            <li>Last Person: ${(this.value[this.value.length-1]?.name ?? "-") + " (" + (this.value[this.value.length-1]?.age ?? "") + ")"}</li>
        `;
    }
}

customElements.define("person-data-info", PersonDataInfo)