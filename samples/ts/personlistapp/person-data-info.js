import { HofHtmlElement, html } from "../../../lib/esm/hof.js";
class PersonDataInfo extends HofHtmlElement {
    constructor() {
        super(...arguments);
        this.value = [];
    }
    templates() {
        var _a, _b, _c, _d, _e, _f;
        return html `
            <br/><br/>Person Info
            <li>First Person: ${(((_a = this.value[0]) === null || _a === void 0 ? void 0 : _a.name) || "-<b>Hi</b>") + " (" + (((_b = this.value[0]) === null || _b === void 0 ? void 0 : _b.age) || "") + ")"}</li>
            <li>Last Person: ${((_d = (_c = this.value[this.value.length - 1]) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "-") + " (" + ((_f = (_e = this.value[this.value.length - 1]) === null || _e === void 0 ? void 0 : _e.age) !== null && _f !== void 0 ? _f : "") + ")"}</li>
        `;
    }
}
customElements.define("person-data-info", PersonDataInfo);
