const __isObject = value => Object.prototype.toString.call(value) === "[object Object]";
const __objectEquals = (obj1, obj2) => {
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
 * Additional methods for operating objects in Set.
 */
class EnSet extends Set {
    /**
     * @param {Array} array
     */
    constructor(array) {
        if (!Array.isArray(array)) throw new TypeError("EnSet constructor expects an array");
        super();
        this.add(...array);
    }

    /**
     * @override
     * @param  {...any} value
     * @returns {this}
     */
    add(...value) {
        value.forEach(v => {
            if (!this.has(v)) super.add(v);
        });
        return this;
    }

    /**
     * @override
     * @param {*} value
     * @returns {boolean}
     */
    delete(value) {
        if (!this.has(value)) return false;
        if (!__isObject(value)) return super.delete(value);

        // Store only non-matching values
        const remainingValues = Array.from(this).filter(v => !(__isObject(v) && __objectEquals(v, value)));
        const initialSize = this.size;

        this.clear();
        this.add(...remainingValues); // Re-add remaining values

        return this.size !== initialSize;
    }

    /**
     * Finds objects in Set.
     * @param {(value: object) => boolean} fn
     * @returns {object[]}
     */
    find(fn) {
        if (typeof fn !== "function") throw new TypeError("find() argument must be a function");
        return Array.from(this).filter(v => __isObject(v) && fn(v));
    }

    /**
     * @override
     * @param {*} value
     * @returns {boolean}
     */
    has(value) {
        return __isObject(value)
            ? Array.from(this).some(v => __isObject(v) && __objectEquals(v, value))
            : super.has(value);
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * Replaces a specific value.
     * @param {*} value
     * @param {*} newValue
     * @returns {*} Value before edit or null
     */
    replace(value, newValue) {
        if (this.has(value)) {
            this.delete(value);
            this.add(newValue);
            return value;
        }
        return null;
    }

    /**
     * Replaces value found by a function.
     * @param {(value: any) => boolean} fn
     * @param {*} newValue
     * @returns {*} Value before edit or null
     */
    replace(fn, newValue) {
        if (typeof fn !== "function") throw new TypeError("replace() argument must be a function");

        const value = this.find(fn)[0];
        return value ? this.replace(value, newValue) : null;
    }

    /**
     * Replaces all values found by a function.
     * @param {(value: any) => boolean} fn
     * @param {*} newValue
     * @returns {Array} Values before edit or null
     */
    replaceAll(fn, newValue) {
        if (typeof fn !== "function") throw new TypeError("replace() argument must be a function");

        const values = this.find(fn);
        return values.length !== 0 ? values.map(v => this.replace(v, newValue)) : null;
    }

    /**
     * Removes values that match the function.
     * @param {(value: any) => boolean} fn
     * @returns {Array} Removed values
     */
    sweep(fn) {
        if (typeof fn !== "function") throw new TypeError("sweep() argument must be a function");

        const values = this.find(fn);
        values.forEach(v => this.delete(v));
        return values;
    }

    /**
     * @returns {Array}
     */
    toArray() {
        return [...this];
    }

    /**
     * @override
     * @param {Set} other
     * @returns {EnSet}
     */
    union(other) {
        if (!(other instanceof EnSet)) throw TypeError("union() argument must be an instance of EnSet");
        return new this.constructor([...this, ...other]);
    }
}

module.exports = EnSet;
