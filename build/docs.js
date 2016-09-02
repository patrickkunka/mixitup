var parse       = require('jsdoc-parse');
var handlebars  = require('handlebars');
var path        = require('path');
var fs          = require('fs');

var DocsBuilder = function() {
    var _ = new DocsBuilder.Private();

    this.init = _.init.bind(_);

    Object.seal(this);
};

DocsBuilder.Private = function() {
    this.startTime  = -1;
    this.factory    = null;
    this.namespaces = {};
    this.templates  = {};
    this.root       = '';
    this.hbs        = null;

    Object.seal(this);

    this.init();
};

DocsBuilder.Private.prototype = {
    constructor: DocsBuilder.Private,

    init: function() {
        var self = this;

        return Promise.resolve()
            .then(function() {
                self.root       = process.cwd();
                self.hbs        = handlebars.create();
                self.startTime  = Date.now();

                console.log('[MixItUp-DocsBuilder] Initialising build...');

                return self.parseScript();
            })
            .then(self.readTemplates.bind(self))
            .then(self.renderDocs.bind(self))
            .catch(console.error.bind(console));
    },

    parseScript: function() {
        var self = this;

        return new Promise(function(resolve, reject) {
            var input = '';

            parse({
                src: './dist/mixitup.js'
            })
                .on('data', function(data) {
                    input += data;
                })
                .on('end', function() {
                    resolve(input);
                })
                .on('error', reject);
        })
            .then(self.sortDoclets.bind(self));
    },

    sortDoclets: function(input) {
        var self    = this,
            doclets = JSON.parse(input);

        doclets.forEach(function(doclet) {
            if (doclet.kind === 'namespace') {
                self.namespaces[doclet.id] = new DocsBuilder.Namespace(doclet);
            }
        });

        doclets.forEach(function(doclet) {
            var namespace = null,
                model     = new DocsBuilder.Doclet();

            if (
                doclet.memberof &&
                typeof (namespace = self.namespaces[doclet.memberof]) !== 'undefined'
            ) {
                Object.assign(model, doclet);

                namespace.members.push(model);
            } else if (doclet.scope === 'global') {
                Object.assign(model, doclet);

                self.factory = model;
            }
        });
    },

    readTemplates: function() {
        var self        = this,
            dirPath     = path.join(self.root, 'build'),
            fileNames   = [];

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
                    return fileName.charAt(0) !== '.' && fileName.indexOf('.md') > -1;
                });

                return filtered;
            })
            .then(function(filtered) {
                var tasks = [];

                fileNames = filtered;

                fileNames.forEach(function(fileName) {
                    var filePath = path.join(self.root, 'build', fileName);

                    tasks.push(new Promise(function(resolve, reject) {
                        fs.readFile(filePath, function(err, data) {
                            if (err) reject;

                            resolve(data);
                        });
                    }));
                });

                return Promise.all(tasks);
            })
            .then(function(buffers) {
                buffers.forEach(function(buffer, i) {
                    var slug = fileNames[i].replace('.md', '');

                    self.templates[slug] = self.hbs.compile(buffer.toString());
                });
            });
    },

    renderDocs: function() {
        var self            = this,
            factoryOutput   = '',
            factoryPath     = '',
            totalFiles      = 0,
            tasks           = [];

        Object.keys(self.namespaces).forEach(function(key) {
            var namespace   = self.namespaces[key],
                filePath    = path.join(self.root, 'docs', key + '.md'),
                output      = '';

            output = self.templates['template-docs-namespace'](namespace);

            totalFiles++;

            tasks.push(new Promise(function(resolve) {
                fs.writeFile(filePath, output, resolve);
            }));
        });

        factoryOutput   = self.templates['template-docs-factory'](self.factory);
        factoryPath     = path.join(self.root, 'docs', 'mixitup.md');

        totalFiles++;

        tasks.push(new Promise(function(resolve) {
            fs.writeFile(factoryPath, factoryOutput, resolve);
        }));

        return Promise.all(tasks)
            .then(function() {
                var duration = Date.now() - self.startTime;

                console.log('[MixItUp-DocsBuilder] ' + totalFiles + ' documentation files generated in ' + duration + 'ms');
            });
    }
};

DocsBuilder.Namespace = function(doclet) {
    this.doclet     = doclet;
    this.members    = [];

    Object.seal(this);
};

DocsBuilder.Doclet = function() {
    this.id             = '';
    this.name           = '';
    this.access         = '';
    this.longname       = '';
    this.scope          = '';
    this.kind           = '';
    this.description    = '';
    this.memberof       = '';
    this.since          = '';
    this.order          = -1;
    this.type           = '';
    this.meta           = {};
    this.defaultvalue   = [];
    this.params         = [];
    this.returns        = [];
    this.examples       = [];

    Object.defineProperties(this, {
        isFactory: {
            get: function() {
                return this.kind === 'function' && !this.memberof;
            }
        },
        isMethod: {
            get: function() {
                return this.kind === 'function' && this.memberof;
            }
        },
        isProperty: {
            get: function() {
                return this.kind === 'member';
            }
        },
        syntax: {
            get: function() {
                if (this.isMethod || this.isFactory) {
                    return this.examples[0];
                }
            }
        },
        codeExamples: {
            get: function() {
                if (this.isMethod || this.isFactory) {
                    return this.examples.slice(1);
                } else {
                    return this.examples;
                }
            }
        }
    });

    Object.seal(this);
};

module.exports = new DocsBuilder();