// Important: In order for resolution to work in the browser without additional loaders like tsloader
// library with js suffix must be included here (because there is no file named hof or hof.ts in the lib folder)
import { HofHtmlElement, html } from "../../../lib/esm/hof.js";

class CounterComponent extends HofHtmlElement {
    count = 10

    get doubled() { return this.count * 2; }

    increment() {
        this.count++;
    }

    templates() {
        return html`
            <div>First rendered: ${new Date()}</div>
            <button onclick="${this.increment}">++</button>

            <ul>
                <li>Count: ${this.count}</li>
                <li>Doubled + 1: ${this.doubled + 1}</li>
            </ul>
        `;
    }
}
customElements.define("counter-component", CounterComponent)