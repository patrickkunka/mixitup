/* global mixitup */

var sandbox     = document.querySelector('.sandbox');

var mixer = mixitup('#sandbox-1', {
    animation: {
        effects: 'fade',
        easing: 'cubic-bezier(1, 0, 0, 1)',
        duration: 400
    },
    controls: {
        scope: 'global',
        live: false
        // toggleLogic: 'and'
    },
    pagination: {
        limit: 4,
        maxPagers: 6
    },
    load: {
        // filter: 'none',
        sort: 'random'
    },
    // dragndrop: {
    //     enable: true,
    //     hidePlaceholder: false,
    //     debounceDelay: 20,
    //     detection: 'collision',
    //     // liveSort: false
    //     // swap: true
    // },
    callbacks: {
        // onMixLift: function() {
        //     console.log('lift', this);
        // }
    }
}, null);

console.log(mixer.getState());

sandbox.addEventListener('mixStart', function(e) {
    console.log('mixStart', e.detail);
});

sandbox.addEventListener('mixEnd', function(e) {
    console.log('mixEnd', e.detail);
});

sandbox.addEventListener('mixClick', function(e) {
    console.log('mixClick', e.detail);
});

sandbox.addEventListener('mixBusy', function(e) {
    console.log('mixBusy', e.detail);
});

sandbox.addEventListener('mixFail', function(e) {
    console.log('mixFail', e.detail);
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
    mixer.paginate({limit: Infinity});
});

document.querySelector('.js-api-limit-10').addEventListener('click', function() {
    mixer.paginate({limit: 10});
});

var dataset = [{
    id: '12',
    category: '1'
}];

var dataMixer = mixitup('#sandbox-2', {
    load: {
        dataset: dataset
    },
    data: {
        uidKey: 'id',
        dirtyCheck: true
    },
    render: {
        target: function(data) {
            return `<div class="mix cat-${data.category}" id="${data.id}"></div>`;
        }
    }
});

dataset.push({
    id: '14',
    category: '2'
}, {
    id: '2',
    category: '3'
});

var first;

dataMixer.dataset(dataset)
    .then(function() {
        dataset.reverse();

        return dataMixer.dataset(dataset);
    })
    .then(function() {
        first = dataset.shift();

        return dataMixer.dataset(dataset);
    })
    .then(function() {
        dataset.push(first);

        return dataMixer.dataset(dataset);
    })
    .then(function() {
        dataset = [dataset[2], dataset[0]];

        return dataMixer.dataset(dataset);
    })
    .then(function() {
        dataset[1] = {
            id: '14',
            category: '4'
        };

        return dataMixer.dataset(dataset);
    });