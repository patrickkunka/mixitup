/* global mixItUp */
var sandbox = document.querySelector('.sandbox');
var mixer   = null;

mixer = mixItUp(sandbox, {
    animation: {
        duration: 100
    }
});

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

mixer.init()
    .then(function(state) {
        console.log(mixer, state);
    });