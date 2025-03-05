const __isObject = value => Object.prototype.toString.call(value) === "[object Object]";
const __objectEquals = (obj1, obj2) => {
    if (!(__isObject(obj1) && __isObject(obj2))) return false;

    const k1 = Object.keys(obj1);
    const k2 = Object.keys(obj2);

    if (k1.length !== k2.length) return false;

    return k1.every(key => {
        const v1 = obj1[key];
        const v2 = obj2[key];
        return (__isObject(v1) && __isObject(v2)) ? __objectEquals(v1, v2) : v1 === v2;
    });
};

/**
 * Enhanced Set
 *
 * Collection for objects with StreamAPI like methods
 */
module.exports = class EnSet {
    /**
     * @param {object[]} initialValues
     */
    constructor(initialValues) {
        if (!Array.isArray(initialValues)) throw new TypeError(`${initialValues} is not an array`);
        if (!initialValues.every(v => __isObject(v))) throw new TypeError(`${initialValues} contains non-object value`);

        /** @type {object[]} */
        this._items = [...initialValues];
        /** @type {EnSet} */
        this._parent = null;
    }

    /**
     * Adds values
     * @param  {...object} value
     * @returns {this}
     */
    add(...value) {
        const target = this._parent || this;
        value.forEach(v => !target.has(v) ? target._items.push(v) : null);
        return this;
    }

    clear() {
        this._items = [];
    }

    delete(...value) {
        const target = this._parent || this;

        value.length && this._parent
            ? (target._items = target._items.filter(val => !this._items.some(v => __objectEquals(v, val))))
            : (target._items = target._items.filter(val => !value.some(v => __objectEquals(v, val))));
    }

    /**
     * @param {object} value
     * @returns {boolean}
     */
    has(value) {
        if (!__isObject(value)) throw new TypeError(`${value} is not an object`);
        return this._items.some(v => __objectEquals(v, value));
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this._items.length === 0;
    }

    /**
     * @param {(value: object, array: object[]) => any} fn
     * @returns {object[]}
     */
    map(fn) {
        if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
        return this._items.map((v, _, arr) => fn(v, arr));
    }

    /**
     * @param {(value: any, array: object[]) => boolean} fn
     * @returns {this}
     */
    query(fn) {
        const selected = new this.constructor(this._items.filter((v, _, arr) => fn(v, arr)));
        selected._parent = this._parent || this;
        return  selected;
    }

    /**
     * @returns {number}
     */
    size() {
        return this._items.length;
    }

    /**
     * @param {(value: object, array: object[]) => any} fn
     * @returns {this}
     */
    update(fn) {
        if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`);
        this._items.forEach((v, _, arr) => fn(v, arr));
        return this;
    }

    /**
     * @returns {object[]}
     */
    values() {
        return this._items;
    }
}
