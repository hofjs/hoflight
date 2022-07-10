import { LitElement, html as htmlTemplate, css as cssTemplate, TemplateResult, PropertyValues, CSSResult } from "lit-element";

export abstract class HofHtmlElement extends LitElement {
    static PARENT_PROPERTIES: string[] = null;
  
    _initialized: boolean = false;
  
    // @ts-ignore
    constructor(tagName: string = "div") {
      super();
  
      // Calculate parent properties
      HofHtmlElement.PARENT_PROPERTIES ??= [...Object.getOwnPropertyNames(this), "templates", "renderRoot"];
    }
  
    async connectedCallback() {
      super.connectedCallback();

      // Initialize component
      await this.init?.();

      // Delete instance properties and assign their old values to observed static properties
      // (instance properties interfere with static properties so they have to be removed)
      for (const propName of Object.getOwnPropertyNames(this).filter(p => !HofHtmlElement.PARENT_PROPERTIES.includes(p))) {
        this[propName] = this._removeProperty(propName);
      }
  
      // Render based on initialized values
      this._initialized = true;
      this.requestUpdate();
    }

    async disconnectedCallback() {
        super.disconnectedCallback();

        await this.dispose?.();
    }

    render() {
      // Calculate templates with current values
      return this.templates();
    }
       
    shouldUpdate(changedProperties: PropertyValues) {
      // Handle deep observability
      // if (!this._initialized)
      //   this._handleDeepObservability(changedProperties);

      // Suppress single updates until all properties are initialized
      // to perform single render after initialization
      if (!this._initialized) return false;

      // Handle value change hooks
      if (!this._handlePropertyChangedHooks(changedProperties)) return false;

      // Accept update
      return true;
    }

    emitEvent(type: string, detail: any) {
      this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }))
    }

    abstract templates(): TemplateResult;

    styles: CSSResult;
    init: Function;
    dispose: Function;

    _removeProperty(propName: string) {
      // Remove property by redefining it and then deleting it
      // (can't directly use delete or set property to null because this would do the same to the original object)
      const value = this[propName];

      Object.defineProperty(this, propName, { value: undefined });
      delete(this[propName]);

      return value;
    }

    _callPropertyChangedHooks(hookName: string, changedProperties: PropertyValues, restoreValue: boolean) {
      for (const [propName, propValue] of changedProperties.entries())
        if (this[`${propName.toString()}${hookName}`]?.(this[propName], propValue) === false) {
          if (restoreValue) // Restore old value
            this[propName] = propValue;
          
          return false;
        }

      return true;
    }

    _handlePropertyChangedHooks(changedProperties: PropertyValues): Boolean {
      // Call BeforeChanged hooks and restore old value if hook returns false
      if (!this._callPropertyChangedHooks("BeforeChanged", changedProperties, true))
        return false;

      // Call AfterChanged hooks
      this._callPropertyChangedHooks("AfterChanged", changedProperties, false);

      return true;
    }

    _handleDeepObservability(changedProperties: PropertyValues) {
      for (const [propName] of changedProperties.entries())
        if (this[propName] && typeof(this[propName]) == "object")
          this._createObserveredProperty(this, propName.toString());
    }

    _createObserveredProperty(propObj: Object, propName: string) {
      // Property already observed (by other component instance that uses same store object)?
      if (!propObj[propName]["__isProxy"]) {
        let objProxy = this._createObserverProxy(propObj, propName);
        Object.defineProperty(propObj, propName, {
            get() { return objProxy },
            set(value)  { objProxy = value },
            enumerable: true,
            configurable: true
        });

        propObj[propName]["_observers"] = new Set();
      }

      // Register this component as observer for property changes
      propObj[propName]["_observers"].add(this);

      // Create obseerved properties for child properties
      for (const [childPropName, childPropValue] of Object.entries(propObj[propName]))
        if (childPropName != "_observers" && childPropValue && typeof(childPropValue) == "object")
          this._createObserveredProperty(propObj[propName], childPropName);
    }

    _createObserverProxy(propObj: Object, propName: string) {
      return new Proxy(propObj[propName], {
        set(o: Object, prop: string, value: Object) {
          o[prop] = value;                        

          for (const component of propObj[propName]["_observers"])
            component.requestUpdate();
            
          return true;
        },
        get(target, key) {
          if (key !== "__isProxy")
            return typeof(target[key]) == "function" ? target[key].bind(target) : target[key]; // Rebind this to support inner store object references
    
          return true;
        }
      });
    }
    
}

// render function for single html expressions
export function item(htmlRenderFunc: Function) { return htmlRenderFunc; }

// render function for list html expressions
// @ts-ignore
export function list(list: Array<Object>, htmlRenderFunc: Function, parentElement: string = "div", renderParentElementOnEmptyList: boolean = false) {
    return () => list.map((element) => htmlRenderFunc(element, 0, false)); }

// html template literal
const _cachedTemplateStrings = new Map();

function _calculateTemplate(html: String) {
  // Create lit html compatible event handlers
  html = html.replace(/\son([A-Za-z0-9])/g, (_, eventName) => ` @${eventName.toLowerCase()}`);

  // Create lit html compatible property setters
  html = html.replace(/\s(([A-Za-z0-9])+\s*=\s*\\?["']?)$/g, (_, attributeExpr) => ` .${attributeExpr}`);

  // Return lit html
  return html;
}

export function html(strings: TemplateStringsArray, ...values: Array<any>) {
  // All templates have to be replaced recursively, which is accomplished by
  // replacing the html template helper
  if (!_cachedTemplateStrings.has(strings)) {
    const mappedStrings = strings.map(s => _calculateTemplate(s));
    mappedStrings["raw"] = strings.raw.map(s => _calculateTemplate(s));
    _cachedTemplateStrings.set(strings, mappedStrings);
  }

  // Restore cached template strings
  const mappedstrings = _cachedTemplateStrings.get(strings);

  return htmlTemplate(mappedstrings, ...values);
}

// css template literal
export const css = cssTemplate;

// Custom Elements
if (!customElements.define.toString().includes(HofHtmlElement.name)) {
    const oldDefine = customElements.define;
  
    customElements.define = function(name, constructor, options) {
      if (constructor.prototype instanceof HofHtmlElement) {
        Object.defineProperty(constructor, "properties", {
          get() {
            const componentExpr: String = this.toString();
            const renderExpr: String = this.prototype.templates.toString();

            if (renderExpr) {
                const matches = renderExpr.match(/this\.[A-Za-z0-9_]+/g);

                const props = matches
                    ?.filter((v, i, a) => a.indexOf(v) === i) // Filter duplicates
                    ?.filter(p => !componentExpr.includes(`${p.substring(5)}(`)) // Filter methods
                    ?.filter(p => p.substring(5) != p.substring(5).toUpperCase()) // Filter constants
                    ?.map(p => [p.substring(5), {
                      type: String,
                      state: p.startsWith("this._") // Don't create attributes for private properties, but make them observable
                }]) ?? [];

                return Object.fromEntries(props);
            }
            return {};
          },
          configurable: true,
          enumerable: false
        });
      }
  
      oldDefine.call(this, name, constructor, options);
    }
  }