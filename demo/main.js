var sandbox = document.querySelector('.sandbox');
var mixer   = null;

mixer = mixItUp(sandbox);

mixer.init()
    .then(function(state) {
        console.log(mixer, state);
    });