/* global mixitup, h */

/**
 * A group of properties relating to MixItUp's dataset API.
 *
 * @constructor
 * @memberof    mixitup.Config
 * @name        data
 * @namespace
 * @public
 * @since       3.0.0
 */

mixitup.ConfigData = function() {
    mixitup.Base.call(this);

    this.callActions('beforeConstruct');

    /**
     * A string specifying the name of the key containing your data model's unique
     * identifier (UID). To use the dataset API, a UID key must be specified and
     * be present and unique on all objects in the dataset you provide to MixItUp.
     *
     * For example, if your dataset is made up of MongoDB documents, the UID
     * key would be `'id'` or `'_id'`.
     *
     * @example <caption>Example: Setting the UID to `'id'`</caption>
     * var mixer = mixitup(containerEl, {
     *     data: {
     *         uidKey: 'id'
     *     }
     * });
     *
     * @name        uidKey
     * @memberof    mixitup.Config.data
     * @instance
     * @type        {string}
     * @default     ''
     */

    this.uidKey = '';

    /**
     * A boolean dictating whether or not MixItUp should "dirty check" each object in
     * your dataset for changes whenever `.dataset()` is called, and re-render any targets
     * for which a change is found.
     *
     * Depending on the complexity of your data model, dirty checking can be expensive
     * and is therefore disabled by default.
     *
     * NB: For changes to be detected, a new immutable instance of the edited model must be
     * provided to mixitup, rather than manipulating properties on the existing instance.
     * If your changes are a result of a DB write and read, you will most likely be calling
     * `.dataset()` with a clean set of objects each time, so this will not be an issue.
     *
     * @example <caption>Example: Enabling dirty checking</caption>
     *
     * var myDataset = [
     *     {
     *         id: 0,
     *         title: "Blog Post Title 0"
     *         ...
     *     },
     *     {
     *         id: 1,
     *         title: "Blog Post Title 1"
     *         ...
     *     }
     * ];
     *
     * // Instantiate a mixer with a pre-loaded dataset, and a target renderer
     * // function defined
     *
     * var mixer = mixitup(containerEl, {
     *     data: {
     *         uidKey: 'id',
     *         dirtyCheck: true
     *     },
     *     load: {
     *         dataset: myDataset
     *     },
     *     render: {
     *         target: function() { ... }
     *     }
     * });
     *
     * // For illustration, we will clone and edit the second object in the dataset.
     * // NB: this would typically be done server-side in response to a DB update,
     * and then re-queried via an API.
     *
     * myDataset[1] = Object.assign({}, myDataset[1]);
     *
     * myDataset[1].title = 'Blog Post Title 11';
     *
     * mixer.dataset(myDataset)
     *    .then(function() {
     *        // the target with ID "1", will be re-rendered reflecting its new title
     *    });
     *
     * @name        dirtyCheck
     * @memberof    mixitup.Config.data
     * @instance
     * @type        {boolean}
     * @default     false
     */

    this.dirtyCheck = false;

    this.callActions('afterConstruct');

    h.seal(this);
};

mixitup.BaseStatic.call(mixitup.ConfigData);

mixitup.ConfigData.prototype = Object.create(mixitup.Base.prototype);

mixitup.ConfigData.prototype.constructor = mixitup.ConfigData;