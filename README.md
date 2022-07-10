# Hof.js light

**Hof.js light** is a **modern framework** for the development of **Single Page Applications** and a part of the Hof.js project. It is an **open source project of Hof University of Applied Sciences** and **was created by Prof. Dr. Walter Kern**.

Unlike Hof.js (https://github.com/hofjs/hof), **Hof.js light is based on LitElement** (https://lit.dev/), but **extends it with typical Hof.js features**. While Hof.js is an experimental framework for trying out innovative new features, Hof.js light aims at building regular applications. Features from Hof.js will be gradually adopted in Hof.js light.

Contact us if you are a student of Hof University of Applied Sciences and would like to contribute.

## Contact
* Organization: https://www.hof-university.de
* Mail: hofjs@hof-university.de
* Impressum / Imprint: https://www.hof-university.de/impressum.html

## Key features
This framework has the following advantages, among others:
* **Extremely simple implementation** of apps based on Web Components and other web standards.
* **Property observability without the requirement to explictly define them, because all properties that are referenced within templates function are automatically recognizied and made observable**.
* **Properties are automatically exposed as attributes**.
* **Properties with leading underscore are used as internal state** and not exposed as attributes.
* **Properties written in Uppercase are treated as constants** and are not tracked.
* **Easy start of development**, since no transpiler, CLI or tool is needed. It is enough to include the framework which is only a few KB in size.
* **IDEs provide best support even without extensions/plugins** since the code is pure JS.

## Introductory example

The following example shows a simple counter component that demonstrates key features such as derived properties and automatic ui rerendering based on property changes.

**simple-counter.js**

```js
class SimpleCounter extends HofHtmlElement {
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
customElements.define("simple-counter", SimpleCounter)
```

**index.html**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple counter app</title>
    <script src="../../lib/nomodule/hof.js"></script>
    <script src="simple-counter.js"></script>
</head>
<body>
    <h1>Simple counter app</h1>
    <simple-counter></simple-counter>
</body>
</html>
```

## Usage

Minimal esm example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Minimal demo</title>
    <script type="module">
        // Inline JS - should be outsourced to external file.      
        import { HofHtmlElement, html } from "../lib/esm/hof.js";

        customElements.define("main-app", class extends HofHtmlElement {
            templates() { return html`<h1>Hello at ${new Date()}</h1>`; }
        });
    </script>
</head>
<body>
    <p>This must be running on a web server to work, for example the vscode live server.</p>

    <main-app></main-app>
</body>
</html>
```

Minimal cjs example
```js
// window.customElements polyfill must be available to use
// component helper to create component for server-side rendering

const { HofHtmlElement, html } = require("../lib/esm/hof.js");

customElements.define("main-app", class extends HofHtmlElement {
    templates() { return html`<h1>Hello at ${new Date()}</h1>`; }
});

...
```


Minimal nomodules example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Counter app</title>
    <script src="../lib/nomodule/hof.js"></script>
    <script>    
        // Inline JS - should be outsourced to external file.      
        customElements.define("main-app", class extends HofHtmlElement {
            templates() { return html`<h1>Hello at ${new Date()}</h1>`; }
        });
    </script>
</head>
<body>
    <main-app></main-app>
</body>
</html>
```

## Documentation

Samples that illustrate basic usage of this framework can be found in this repository.

You can contribute by sending pull requests to [this repository](https://github.com/hofjs/hoflight).


## License

Hof.js light is [MIT licensed](./LICENSE.md).