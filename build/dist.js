var handlebars  = require('handlebars');
var fs          = require('fs');
var path        = require('path');
var p           = require('../package.json');

var DistBuilder = function() {
    var _ = new DistBuilder.Private();

    this.init = _.init.bind(_);

    Object.seal(this);

    this.init(DistBuilder.getParameter('-o'));
};

DistBuilder.Private = function() {
    this.hbs        = null;
    this.root       = '',
    this.startTime  = -1;

    Object.seal(this);
};

DistBuilder.Private.prototype = {
    /**
     * @public
     * @param   {string}    fileName
     * @return  {Promise}
     */

    init: function(fileName) {
        var self = this;

        self.hbs          = handlebars.create();
        self.root         = process.cwd();
        self.startTime    = Date.now();

        console.log('[MixItUp-DistBuilder] Initialising build...');

        self.readPartials.call(self)
            .then(function(partials) {
                return self.registerPartials(partials);
            })
            .then(function() {
                var data = self.mapData(),
                    code = '';

                code = self.render(data);
                code = self.cleanBuild(code);

                return self.writeFile(code, fileName);
            })
            .catch(function(e) {
                console.error(e);
                console.info(e.stack);
            });
    },

    /**
     * @private
     * @return  {Promise<string[]>}
     */

    readPartials: function() {
        var self    = this,
            dirPath = path.join(self.root, 'src');

        return new Promise(function(resolve, reject) {
            fs.stat(dirPath, function(err, stat) {
                if (err) reject(err);

                resolve(stat);
            });
        })
            .then(function(exists) {
                if (!exists) return [];

                return new Promise(function(resolve, reject) {
                    fs.readdir(dirPath, function(err, list) {
                        if (err) reject(err);

                        resolve(list);
                    });
                });
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
     * @param   {string[]}  fileNames
     * @return  {Promise}
     */

    registerPartials: function(fileNames) {
        var self    = this,
            tasks   = [];

        fileNames.forEach(function(fileName) {
            var filePath = path.join(self.root, 'src', fileName);

            tasks.push(new Promise(function(resolve, reject) {
                fs.readFile(filePath, function(err, data) {
                    if (err) reject;

                    resolve(data);
                });
            }));
        });

        console.log('[MixItUp-DistBuilder] ' + fileNames.length + ' modules found');

        return Promise.all(tasks)
            .then(function(buffers) {
                buffers.forEach(function(buffer, i) {
                    var slug        = fileNames[i].replace('.js', ''),
                        contents    = '';

                    contents = self.cleanPartial(buffer.toString());

                    self.hbs.registerPartial(slug, contents);
                });
            });
    },

    /**
     * @private
     * @param   {string}    contents
     * @return  {string}
     */

    cleanPartial: function(contents) {
        // Remove jshint global declarations

        contents = contents.replace(/(^)?\/\* global(|s) [\w:, ]+ \*\/\n/g, '');

        return contents;
    },

    /**
     * @private
     * @return {string}
     */

    generateUUID: function() {
        var date = new Date().getTime(),
            uuid = '';

        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var rand = (date + Math.random() * 16) % 16 | 0;

            date = Math.floor(date / 16);

            return (c === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    },

    /**
     * @private
     * @param   {name}      name
     * @param   {string}    version
     * @return  {BuildData}
     */

    mapData: function() {
        var self = this,
            data = new DistBuilder.Model();

        data.title                     = p.title;
        data.author                    = p.author;
        data.name                      = p.name;
        data.version                   = p.version;

        if (p.dependencies.mixitup) {
            data.coreVersion = p.dependencies.mixitup;
        }

        data.beginCopyrightYear        = '2014';
        data.currentYear               = new Date().getFullYear();
        data.websiteUrl                = p.homepage;
        data.commercialLicenseUrl      = p.homepage + 'licenses/';
        data.nonCommercialLicenseTitle = 'CC-BY-NC';
        data.nonCommercialLicenseUrl   = 'http://creativecommons.org/licenses/by-nc/3.0/';
        data.buildId                   = self.generateUUID.call(self);

        return data;
    },

    /**
     * @private
     * @param   {DistBuilder.Data}  data
     * @return  {string}
     */

    render: function(data) {
        var self        = this,
            template    = self.hbs.compile(DistBuilder.TEMPLATE),
            output      = '';

        output = template(data);

        return output;
    },

    /**
     * @private
     * @param   {string} buffer
     * @return  {string}
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
            outputPath  = path.join(self.root, 'dist', fileName),
            duration    = Date.now() - self.startTime;

        console.log('[MixItUp-DistBuilder] Build completed in ' + duration + 'ms');

        return new Promise(function(resolve) {
            fs.writeFile(outputPath, code, resolve);
        });
    }
};

/**
 * @static
 * @param   {string}    param
 * @return  {string}
 */

DistBuilder.getParameter = function(param) {
    var params      = process.argv,
        paramIndex  = -1,
        value       = '';

    paramIndex = params.indexOf(param);

    if (paramIndex > -1) {
        value = params[paramIndex + 1];
    }

    return value || '';
};

DistBuilder.Model = function() {
    this.title                      = '';
    this.author                     = '';
    this.name                       = '';
    this.version                    = '';
    this.coreVersion                = '';
    this.beginCopyrightYear         = '';
    this.currentYear                = '';
    this.websiteUrl                 = '';
    this.commercialLicenseUrl       = '';
    this.nonCommercialLicenseTitle  = '';
    this.nonCommercialLicenseUrl    = '';
    this.buildId                    = '';

    Object.seal(this);
};

DistBuilder.TEMPLATE = '{{>wrapper}}';

module.exports = new DistBuilder();