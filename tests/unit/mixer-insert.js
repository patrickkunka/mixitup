'use strict';

require('jsdom-global')();

const chai    = require('chai');
const dom     = require('../mock/dom');
const mixitup = require('../../dist/mixitup.js');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-as-promised'));

describe('mixitup.Mixer', () => {
    describe('#insert()', () => {
        it('should accept an element as an argument', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget)
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);

                    mixer.destroy();
                });
        });

        it('should accept an element and an index as arguments', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget, 3)
                .then(state => {
                    chai.assert.equal(state.show[3].id, 7);

                    mixer.destroy();
                });
        });

        it('should accept an html string as an argument', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget.outerHTML)
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);

                    mixer.destroy();
                });
        });

        it('should accept an html and an index as arguments', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget.outerHTML, 5)
                .then(state => {
                    chai.assert.equal(state.show[5].id, 7);

                    mixer.destroy();
                });
        });

        it('should accept accept an element collection as an argument', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget1 = dom.getTarget();
            let newTarget2 = dom.getTarget();

            newTarget2.id = '8';

            return mixer.insert([newTarget1, newTarget2])
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);
                    chai.assert.equal(state.show[1].id, 8);

                    mixer.destroy();
                });
        });

        it('should accept accept a document fragment as an argument', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let frag = document.createDocumentFragment();

            frag.appendChild(newTarget);

            return mixer.insert(frag)
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);

                    mixer.destroy();
                });
        });

        it('should accept accept an element collection and an index as an argument', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget1 = dom.getTarget();
            let newTarget2 = dom.getTarget();

            newTarget2.id = '8';

            return mixer.insert([newTarget1, newTarget2], 4)
                .then(state => {
                    chai.assert.equal(state.show[4].id, 7);
                    chai.assert.equal(state.show[5].id, 8);

                    mixer.destroy();
                });
        });

        it('should throw an error if an element, index and sibling are passed simultaneously', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let sibling = container.children[4];

            chai.assert.throws(() => {
                mixer.insert(newTarget, 4, sibling);
            }, Error, mixitup.messages.errorInsertInvalidArguments());
        });

        it('should accept an element and sibling reference to insert before', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let sibling = container.children[4];

            return mixer.insert(newTarget, sibling)
                .then(state => {
                    chai.assert.equal(state.show[4].id, '7');

                    mixer.destroy();
                });
        });

        it('should accept an element, sibling reference and position string', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let sibling = container.children[4];

            return mixer.insert(newTarget, sibling, 'after')
                .then(state => {
                    chai.assert.equal(state.show[5].id, '7');

                    mixer.destroy();
                });
        });

        it('should insert at end if the insertion index is above range', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget, 10)
                .then(state => {
                    chai.assert.equal(state.show[6].id, '7');

                    mixer.destroy();
                });
        });

        it('should insert at start if the insertion index is below range', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget, -2)
                .then(state => {
                    chai.assert.equal(state.show[0].id, '7');

                    mixer.destroy();
                });
        });

        it('should throw an error if the element to insert already exists', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = container.children[1];

            chai.assert.throws(() => {
                mixer.insert(newTarget);
            }, Error, mixitup.messages.errorInsertPreexistingElement());
        });

        it('should allow no elements to be inserted with a warning', () => {
            let container = dom.getContainer();
            let totalTargets = container.children.length;
            let mixer = mixitup(container);

            return mixer.insert()
                .then(state => {
                    chai.assert.equal(state.totalShow, totalTargets);

                    mixer.destroy();
                });
        });

        it('should accept a callback function which is invoked after insertion', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            let promise = new Promise(resolve => mixer.insert(newTarget, resolve));

            chai.assert.isFulfilled(promise);

            return promise
                .then(() => {
                    chai.assert.equal(newTarget.parentElement, container);

                    mixer.destroy();
                });
        });

        it('should accept a boolean allowing toggling off of animation', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.insert(newTarget, false)
                .then(() => {
                    chai.assert.equal(newTarget.parentElement, container);

                    mixer.destroy();
                });
        });

        it('should accept a HTML with padding whitespace as an argument', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = ' ' + dom.getTarget().outerHTML + ' ';

            return mixer.insert(newTarget)
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);

                    mixer.destroy();
                });
        });
    });

    describe('#prepend()', () => {
        it('should insert an element at the start', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.prepend(newTarget)
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);

                    mixer.destroy();
                });
        });

        it('should insert a collection of elements at the start', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget1 = dom.getTarget();
            let newTarget2 = dom.getTarget();

            newTarget2.id = '8';

            return mixer.prepend([newTarget1, newTarget2])
                .then(state => {
                    chai.assert.equal(state.show[0].id, 7);
                    chai.assert.equal(state.show[1].id, 8);

                    mixer.destroy();
                });
        });
    });

    describe('#append()', () => {
        it('should insert an element at the end', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();

            return mixer.append(newTarget)
                .then(state => {
                    chai.assert.equal(state.show[6].id, 7);

                    mixer.destroy();
                });
        });

        it('should insert a collection of elements at the end', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget1 = dom.getTarget();
            let newTarget2 = dom.getTarget();

            newTarget2.id = '8';

            return mixer.append([newTarget1, newTarget2])
                .then(state => {
                    chai.assert.equal(state.show[6].id, 7);
                    chai.assert.equal(state.show[7].id, 8);

                    mixer.destroy();
                });
        });

        it('should accept accept a document fragment as an argument to append', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let frag = document.createDocumentFragment();

            frag.appendChild(newTarget);

            return mixer.append(frag)
                .then(state => {
                    chai.assert.equal(state.show[6].id, 7);

                    mixer.destroy();
                });
        });
    });

    describe('#insertBefore()', () => {
        it('should insert an element before the referenced element', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let sibling = container.children[3];

            return mixer.insertBefore(newTarget, sibling)
                .then(state => {
                    chai.assert.equal(state.show[3].id, 7);

                    mixer.destroy();
                });
        });

        it('should insert a collection of elements before the referenced element', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget1 = dom.getTarget();
            let newTarget2 = dom.getTarget();
            let sibling = container.children[3];

            newTarget2.id = '8';

            return mixer.insertBefore([newTarget1, newTarget2], sibling)
                .then(state => {
                    chai.assert.equal(state.show[3].id, 7);
                    chai.assert.equal(state.show[4].id, 8);

                    mixer.destroy();
                });
        });
    });

    describe('#insertAfter()', () => {
        it('should insert an element after the referenced element', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget = dom.getTarget();
            let sibling = container.children[3];

            return mixer.insertAfter(newTarget, sibling)
                .then(state => {
                    chai.assert.equal(state.show[4].id, 7);

                    mixer.destroy();
                });
        });

        it('should insert a collection of elements after the referenced element', () => {
            let container = dom.getContainer();
            let mixer = mixitup(container);
            let newTarget1 = dom.getTarget();
            let newTarget2 = dom.getTarget();
            let sibling = container.children[3];

            newTarget2.id = '8';

            return mixer.insertAfter([newTarget1, newTarget2], sibling)
                .then(state => {
                    chai.assert.equal(state.show[4].id, 7);
                    chai.assert.equal(state.show[5].id, 8);

                    mixer.destroy();
                });
        });
    });
});