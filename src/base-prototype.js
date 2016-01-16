/* global mixitup */
/* global h */

mixitup.basePrototype = {

    /**
     * extend
     * @public
     * @since   2.1.0
     * @param   {object}
     * @void
     *
     * Shallow extend the base prototype with new methods
     */

    // TODO: make the extend helper method more robust with deep/shallow flag, and call here as shallow

    extend: function(extension) {
        var key = '';

        for (key in extension) {
            if (extension[key]) {
                this[key] = extension[key];
            }
        }
    },

    /**
     * addAction
     * @public
     * @since   2.1.0
     * @param   {string}    hook name
     * @param   {string}    name
     * @param   {function}  func
     * @param   {number}    priority
     * @void
     *
     * Register a named action hook on the prototype
     */

    addAction: function(hook, name, func, priority) {
        this._addHook('_actions', hook, name, func, priority);
    },

    /**
     * addFilter
     * @public
     * @since   2.1.0
     * @param   {string}    hook
     * @param   {string}    name
     * @param   {function}  func
     * @void
     *
     * Register a named action hook on the prototype
     */

    addFilter: function(hook, name, func) {
        this._addHook('_filters', hook, name, func);
    },

    /**
     * _addHook
     * @private
     * @since   2.1.0
     * @param   {string}    type of hook
     * @param   {string}    hook name
     * @param   {function}  function to execute
     * @param   {number}    priority
     * @void
     *
     * Add a hook to the object's prototype
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
     * _execAction
     * @private
     * @since   2.0.0
     * @param   {string}    methodName
     * @param   {boolean}   isPost
     * @param   {*[]} args
     * @void
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
     * _execFilter
     * @private
     * @since   2.0.0
     * @param   {string}    methodName
     * @param   {*}         value
     * @param   {*[]}       args
     * @return  {*}
     * @void
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