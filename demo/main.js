/* global fastclick */
/* global mixItUp */

var sandbox = document.querySelector('.sandbox');
var mixer   = null;

mixer = mixitup(sandbox, {
    animation: {
        effects: 'fade translateZ(-150px) stagger(20ms)',
        easing: 'cubic-bezier(1, 0, 0, 1)',
        duration: 350
    },
    pagination: {
        limit: 4,
        maxPagers: 6
    },
    dragndrop: {
        enable: true
    }
});

sandbox.classList.add('sandbox__mixitup');

document.querySelector('.js-append').addEventListener('click', function() {
   mixer.append('<div class="mix cat-3" data-order="3">C 3</div>');
});

document.querySelector('.js-prepend').addEventListener('click', function() {
   mixer.prepend('<div class="mix cat-1" data-order="2">A 2</div>');
});

document.querySelector('.js-insert-at-index').addEventListener('click', function() {
   mixer.insert(4, '<div class="mix cat-4" data-order="5">D 5</div>');
});

document.querySelector('.js-remove-via-element').addEventListener('click', function() {
    var state = mixer.getState();

    if (state.targets[0]) {
        mixer.remove(state.targets[0]);
    }
});

document.querySelector('.js-remove-via-index').addEventListener('click', function() {
    mixer.remove(3);
});

document.querySelector('.js-insert-multiple-via-markup').addEventListener('click', function() {
    mixer.prepend(
        '<div class="mix cat-4" data-order="1">D 1</div>' +
        '<div class="mix cat-4" data-order="2">D 2</div>' +
        '<div class="mix cat-4" data-order="3">D 3</div>'
    );
});

document.querySelector('.js-insert-multiple-via-elements').addEventListener('click', function() {
    var h   = mixitup.h,
        el1 = h.createElement('<div class="mix cat-4" data-order="1">D 1</div>').children[0],
        el2 = h.createElement('<div class="mix cat-4" data-order="2">D 2</div>').children[0],
        el3 = h.createElement('<div class="mix cat-4" data-order="3">D 3</div>').children[0],
        elements = [el1, el2, el3];

    // Going into the mixer backwards?

    mixer.multiMix({
        insert: elements
    });
});

document.querySelector('.js-api-filter').addEventListener('click', function() {
    mixer.filter('.cat-2');
});

document.querySelector('.js-api-filter-compound').addEventListener('click', function() {
    mixer.filter('.cat-2, .cat-3');
});

document.querySelector('.js-api-sort').addEventListener('click', function() {
    mixer.sort('order:asc');
});

document.querySelector('.js-api-limit-3').addEventListener('click', function() {
    mixer.paginate({limit: 3});
});

document.querySelector('.js-api-limit-inf').addEventListener('click', function() {
    mixer.paginate({limit: -1});
});

document.querySelector('.js-api-limit-10').addEventListener('click', function() {
    mixer.paginate({limit: 10});
});

mixer.init(true)
    .then((state) => console.log(mixer, state));