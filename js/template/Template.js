/**
 * Manages a section of HTML used with a view. See {@link TemplateType} to see
 * how you can import one
 */
export default class Template {
    /**
     * Creates a template from some form of HTML fragment. This can be from the
     * DOM or a JS-based HTMLElement
     *
     * @param {HTMLElement} root - Root view of the template
     * @param {TemplateType} [type=none] - Type of the template to reference.
     */
    constructor(root, type = TemplateType.none) {
        if (root instanceof Template) {
            this._root = root._root;
            this._type = root._type;
        } else if (typeof root === 'string') {
            this._root = document.getElementById(root);
            this._type = type;
        } else {
            this._root = root;
            this._type = type;
        }

        this._parent = this._root.parentNode;

        this._hasLoaded = false;
    }

    /**
     * Returns the underlying element
     * @type {HTMLElement}
     */
    get getUnderlyingNode() {
        return this._root;
    }

    /**
     * Performs a `move` {@link TemplateType} for a given HTML id to return a
     * template based on the id's root.
     * @param {string} id HTML ID of a {@link HTMLElement}
     * @param {TemplateType} type Type of the template
     * @return {Template} New template.
     */
    static fromId(id, type = TemplateType.none) {
        return new Template(
            document.getElementById(id),
            type
        );
    }

    /**
     * Creates template `<div>` with text.
     * @param {string} text - text of new elem
     * @param {TemplateType} [type=none] - Type of the generated template.
     * @return {Template} new template.
     */
    static fromText(text, type) {
        let elem = document.createElement('div');
        elem.appendChild(document.createTextNode(text));
        return new Template(elem, type);
    }

    /**
     * Returns a unique instance of the template as an HTMLElement.
     * @return {HTMLElement} unique instance of the DOM element.
     */
    unique() {
        switch (this._type) {
            case TemplateType.move:
                this._root.parentNode.removeChild(this._root);
                this._root.classList.remove('template');
                this._type = TemplateType.none;
                return this._root;
            case TemplateType.clone:
                return this._root.cloneNode(true);
            default:
                return this._root;
        }
    }

    /**
     * Gets the original parent or else a default
     * @param {?HTMLElement} defaultElement
     * @return {HTMLElement} parent element or the `defualt` provided.
     */
    getParent(defaultElement) {
        return this._parent || defaultElement;
    }

    /**
     * Called when the view has loaded
     */
    didLoad() {
        void 0;
    }

    /**
     * Called right before the view will appear on screen
     */
    willLoad() {
        this._hasLoaded = true;
        void 0;
    }

    /**
     * Called before disappearing
     */
    willUnload() { void 0; }

    /**
     * Called when disappeared
     */
    didUnload() { void 0; }

    /**
     * Loads the template in a context
     * @param {HTMLElement} parent - Will be appended to this node.
     * @param {boolean} allowDupliacte If should allow to be loaded multiple times
     * @return {HTMLElement} rendered element
     */
    loadInContext(parent, allowDuplicate = true) {
        if (!allowDuplicate && this._hasLoaded) return;

        let elem = this.unique();
        this.willLoad();
        parent.appendChild(elem);
        this.didLoad();
        return elem;
    }

    /**
     * Loads before an element
     * @param {HTMLElement} elem - Element to load before
     * @return {HTMLElement} rendered element
     */
    loadBeforeContext(elem) {
        let instance = this.unique();
        elem.parentNode.insertBefore(instance, elem);
        return instance;
    }
}

/**
 * @typedef {Object} TemplateType type of template.
 */
export const TemplateType = {
    move: 0,
    clone: 1,
    none: 2
};
