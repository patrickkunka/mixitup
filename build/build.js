/* global process */
var handlebars  = require('handlebars'),
    fs          = require('q-io/fs'),
    path        = require('path'),
    q           = require('q'),

    Build       = null,
    BuildData   = null,
    Private     = null,

    TEMPLATE    = '{{>wrapper}}';

Build = function() {
    this.fileName   = '';
    this._          = new Private();

    this.init();

    Object.seal(this);
};

Build.prototype = {
    /**
     * init
     * @public
     * @param   {string}    version
     * @return  {Promise}
     */

    init: function(version) {
        var self = this;

        self.fileName = 'mixitup.js';

        self._.hbs  = handlebars.create();
        self._.root = process.cwd(); // pass in as param?

        self._.readPartials.call(self)
            .then(function(partials) {
                return self._.registerPartials.call(self, partials);
            })
            .then(function() {
                var scope   = self._.mapScope.call(self, version),
                    code    = '';

                code = self._.render.call(self, scope);

                return self._.writeFile.call(self, code);
            })
            .catch(function(e) {
                console.error(e);
                console.info(e.stack);
            });
    }
};

Private = function() {
    this.hbs    = null;
    this.root   = '';
};

Private.prototype = {
    /**
     * readPartials
     * @private
     * @return  {Promise} -> {string[]}
     */

    readPartials: function() {
        var self    = this,
            dirPath = path.join(self._.root, 'src');

        return fs.exists(dirPath)
            .then(function(exists) {
                if (exists) {
                    return fs.list(dirPath);
                }
            })
            .then(function(list) {
                var filtered = list.filter(function(fileName) {
                    return fileName.charAt(0) !== '.' && fileName.indexOf('.js') > -1;
                });

                return filtered;
            });
    },

    /**
     * registerPartials
     * @private
     * @param {string[]} fileNames
     * @void
     */

    registerPartials: function(fileNames) {
        var self    = this,
            tasks   = [];

        fileNames.forEach(function(fileName) {
            var filePath = path.join(self._.root, 'src', fileName);

            tasks.push(fs.read(filePath));
        });

        return q.all(tasks)
            .then(function(buffers) {
                buffers.forEach(function(buffer, i) {
                    var slug = fileNames[i].replace('.js', '');

                    self._.hbs.registerPartial(slug, buffer);
                });
            });
    },

    /**
     * mapScope
     * @private
     * @param   {string}    version
     * @return  {BuildData}
     * @void
     */

    mapScope: function(version) {
        var scope = new BuildData();

        scope.title                     = 'MixItUp';
        scope.author                    = 'KunkaLabs Limited';
        scope.version                   = version || '*.*.*';
        scope.beginCopyrightYear        = '2014';
        scope.currentYear               = new Date().getFullYear();
        scope.websiteUrl                = 'https://kunkalabs.com/mixitup/';
        scope.commercialLicenseUrl      = 'https://kunkalabs.com/mixitup/licenses';
        scope.nonCommercialLicenseTitle = 'CC-BY-NC';
        scope.nonCommercialLicenseUrl   = 'http://creativecommons.org/licenses/by-nc/3.0/';

        return scope;
    },

    /**
     * render
     * @private
     * @param   {BuildData}     scope
     * @return  {string}
     */

    render: function(scope) {
        var self        = this,
            template    = self._.hbs.compile(TEMPLATE),
            output      = '';

        output = template(scope);

        return output;
    },

    /**
     * writeFile
     * @private
     * @param   {string} code
     * @return  {Promise}
     */

    writeFile: function(code) {
        var self        = this,
            outputPath  = path.join(self._.root, 'dist', self.fileName);

        return fs.write(outputPath, code);
    }
};

BuildData = function() {
    this.title                      = '';
    this.author                     = '';
    this.version                    = '';
    this.beginCopyrightYear         = '';
    this.currentYear                = '';
    this.websiteUrl                 = '';
    this.commercialLicenseUrl       = '';
    this.nonCommercialLicenseTitle  = '';
    this.nonCommercialLicenseUrl    = '';

    Object.seal(this);
};

module.exports = new Build();