/* global mixitup, h */

/**
 * A group of properties relating to the behavior of the Mixer.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        behavior
 * @namespace
 * @public
 * @since       3.1.12
 */

mixitup.ConfigBehavior = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A boolean dictating whether to allow "live" sorting of the mixer.
     *
     * Because of the expensive nature of sorting, MixItUp makes use of several
     * internal optimizations to skip redundant sorting operations, such as when
     * the newly requested sort command is the same as the active one. The caveat
     * to this optimization is that "live" edits to the value of a target's sorting
     * attribute will be ignored when requesting a re-sort by the same attribute.
     *
     * By setting to `behavior.liveSort` to `true`, the mixer will always re-sort
     * regardless of whether or not the sorting attribute and order have changed.
     *
     * @example <caption>Example: Enabling `liveSort` to allow for re-sorting</caption>
     *
     * var mixer = mixitup(containerEl, {
     *     behavior: {
     *         liveSort: true
     *     },
     *     load: {
     *         sort: 'edited:desc'
     *     }
     * });
     *
     * var target = containerEl.children[3];
     *
     * console.log(target.getAttribute('data-edited')); // '2015-04-24'
     *
     * target.setAttribute('data-edited', '2017-08-10'); // Update the target's edited date
     *
     * mixer.sort('edited:desc')
     *     .then(function(state) {
     *         // The target is now at the top of the list
     *
     *         console.log(state.targets[0] === target); // true
     *     });
     *
     * @name        liveSort
     * @memberof    mixitup.Config.behavior
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.liveSort = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigBehavior);

mixitup.ConfigBehavior.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigBehavior.prototype.constructor = mixitup.ConfigBehavior;