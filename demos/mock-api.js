(function(window) {
    var Api = function(dataset) {
        var _db = [];

        Object.defineProperties(this, {
            db: {
                get: function() {
                    return _db.slice();
                },
                set: function(value) {
                    if (!Array.isArray(value)) {
                        throw new TypeError('[mock-api] Dataset must be an array');
                    }

                    if (!value.length) {
                        throw new TypeError('[mock-api] Dataset must contain one or more elements');
                    }

                    _db = value;
                }
            }
        });

        this.init(dataset);
    };

    Api.prototype = {
        constructor: Api,

        init: function(dataset) {
            this.db = dataset;
        },

        get: function(query) {
            var self = this;

            return Promise.resolve()
                .then(function() {
                    var output;

                    query = Object.assign(new Api.Query(), query);

                    Object.freeze(query);

                    output = self.filter(self.db, query);

                    output = self.sort(output, query);

                    return output;
                });
        },

        filter: function(input, query) {
            return input.filter(function(item) {
                var key;
                var value;

                for (key in query) {
                    if (key.match(/^\$/g)) continue;

                    value = query[key];

                    if (value === 'all') return true;

                    if (item[key] !== value) return false;
                }

                return true;
            });
        },

        sort: function(input, query) {
            return input.sort(function(a, b) {
                var valueA = a[query.$sort_by];
                var valueB = b[query.$sort_by];

                if (valueA > valueB) {
                    return query.$order === 'asc' ? 1 : -1;
                } else if (valueA < valueB) {
                    return query.$order === 'asc' ? -1 : 1;
                } else {
                    return 0;
                }
            });
        }
    };

    Api.Query = function() {
        this.$sort_by = 'id';
        this.$order   = 'asc';
    };

    window.Api = Api;
})(window);