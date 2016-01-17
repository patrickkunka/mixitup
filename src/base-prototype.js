/* global mixitup, h */

mixitup.basePrototype = {

    /**
     * Shallow extend the base prototype with new methods
     *
     * @public
     * @since   2.1.0
     * @param   {object} extension
     * @return  {void}
     */

    extend: function(extension) {
        var key = '';

        // TODO: make the h extend helper method more robust with deep/shallow flag,
        // and call here as shallow

        for (key in extension) {
            if (extension[key]) {
                this[key] = extension[key];
            }
        }
    },

    /**
     * Register a named action hook on the prototype
     *
     * @public
     * @since   2.1.0
     * @param   {string}    hook
     * @param   {string}    name
     * @param   {function}  func
     * @param   {number}    priority
     * @return  {void}
     */

    addAction: function(hook, name, func, priority) {
        this._addHook('_actions', hook, name, func, priority);
    },

    /**
     * Register a named action hook on the prototype
     *
     * @public
     * @since   2.1.0
     * @param   {string}    hook
     * @param   {string}    name
     * @param   {function}  func
     * @return  {void}
     */

    addFilter: function(hook, name, func) {
        this._addHook('_filters', hook, name, func);
    },

    /**
     * Add a hook to the object's prototype
     *
     * @private
     * @since   2.1.0
     * @param   {string}    type
     * @param   {string}    hook
     * @param   {string}    name
     * @param   {function}  func
     * @param   {number}    priority
     * @return  {void}
     */

    _addHook: function(type, hook, name, func, priority) {
        var collection  = this[type],
            obj         = {};

        priority = (priority === 1 || priority === 'post') ? 'post' : 'pre';

        obj[hook]                   = {};
        obj[hook][priority]         = {};
        obj[hook][priority][name]   = func;

        h.extend(collection, obj);
    },

    /**
     * @private
     * @since   2.0.0
     * @param   {string}    methodName
     * @param   {boolean}   isPost
     * @param   {*[]}       args
     * @return  {void}
     */

    _execAction: function(methodName, isPost, args) {
        var self    = this,
            key     = '',
            context = isPost ? 'post' : 'pre';

        if (!self._actions.isEmptyObject && self._actions.hasOwnProperty(methodName)) {
            for (key in self._actions[methodName][context]) {
                self._actions[methodName][context][key].call(self, args);
            }
        }
    },

    /**
     * @private
     * @since   2.0.0
     * @param   {string}    methodName
     * @param   {*}         value
     * @param   {*[]}       args
     * @return  {*}
     */

    _execFilter: function(methodName, value, args) {
        var self    = this,
            key     = '';

        if (!self._filters.isEmptyObject && self._filters.hasOwnProperty(methodName)) {
            for (key in self._filters[methodName].pre) {
                return self._filters[methodName].pre[key].call(self, value, args);
            }
        } else {
            return value;
        }
    }
};