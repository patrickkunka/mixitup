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
    var version     = '',
        fileName    = '';

    this._      = new Private();

    version     = this._.getParameter('-v');
    fileName    = this._.getParameter('-o');

    this.init(version, fileName);

    Object.seal(this);
};

Build.prototype = {
    /**
     * @public
     * @param   {string}    version
     * @param   {string}    fileName
     * @return  {Promise}
     */

    init: function(version, fileName) {
        var self = this;

        self._.hbs          = handlebars.create();
        self._.root         = process.cwd();
        self._.startTime    = Date.now();

        console.log('[MixItUp-Build] Initialising build...');

        self._.readPartials.call(self)
            .then(function(partials) {
                return self._.registerPartials.call(self, partials);
            })
            .then(function() {
                var scope   = self._.mapScope.call(self, version),
                    code    = '';

                code = self._.render.call(self, scope);
                code = self._.cleanBuild(code);

                return self._.writeFile.call(self, code, fileName);
            })
            .catch(function(e) {
                console.error(e);
                console.info(e.stack);
            });
    }
};

Private = function() {
    this.hbs        = null;
    this.root       = '',
    this.startTime  = -1;
};

Private.prototype = {
    /**
     * @param   {string}    param
     * @return  {string}
     */

    getParameter: function(param) {
        var params      = process.argv,
            paramIndex  = -1,
            value       = '';

        paramIndex = params.indexOf(param);

        if (paramIndex > -1) {
            value = params[paramIndex + 1];
        }

        return value || '';
    },

    /**
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

        console.log('[MixItUp-Build] ' + fileNames.length + ' modules found');

        return q.all(tasks)
            .then(function(buffers) {
                buffers.forEach(function(buffer, i) {
                    var slug = fileNames[i].replace('.js', '');

                    buffer = self._.cleanPartial(buffer);

                    self._.hbs.registerPartial(slug, buffer);
                });
            });
    },

    /**
     * @private
     * @param {string} buffer
     * @return {string}
     */

    cleanPartial: function(buffer) {
        // Remove jshint global declarations

        buffer = buffer.replace(/(^)?\/\* global [a-zA-Z:, ]+ \*\/\n/g, '');

        return buffer;
    },

    /**
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
     * @private
     * @param {string} buffer
     * @return {string}
     */

    cleanBuild: function(buffer) {
        // Remove trailing whitespace at ends of lines

        buffer = buffer.replace(/[ \t]+($|[\n])/g, '\n');

        // Replace multiple empty lines with one

        buffer = buffer.replace(/\n{3,}/g, '\n\n');

        return buffer;
    },

    /**
     * @private
     * @param   {string} code
     * @param   {string} fileName
     * @return  {Promise}
     */

    writeFile: function(code, fileName) {
        var self        = this,
            outputPath  = path.join(self._.root, 'dist', fileName),
            duration    = Date.now() - self._.startTime;

        console.log('[MixItUp-Build] Build completed in ' + duration + 'ms');

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