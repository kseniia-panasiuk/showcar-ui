require('../../vendor/zepto/zepto.min.js');
require('./components/rotating-arrow.js')();
require('./components/sticky.js')();
require('./components/navigation.js');
require('./components/polyfills.js')();
require('./components/collapse.js')();

window.notification = require('./components/notification.js');

var FontFaceObserver = require('fontfaceobserver');
var observer = new FontFaceObserver('Source Sans Pro');
var warn = function (msg) {
    if (!window || !window.console) {
        return;
    }
    window.console.warn(msg);
};
var isRegistered = function(name) {
    return document.createElement(name).constructor !== HTMLElement;
};

if (!isRegistered('as24-icon')) {
    require('../../vendor/showcar-icons/dist/showcar-icons.min.js');
} else {
    warn('as24-icon is already registered.');
}

if (!isRegistered('custom-dropdown')) {
    require('./components/custom-dropdown.js');
} else {
    warn('custom-dropdown is already registered.');
}

if (!window.storage) {
    window.Storage = require('../../vendor/showcar-storage/src/storage.js');
} else {
    warn('window.storage is already registered.');
}

if (!window.notification) {
    window.notification = require('./components/notification.js');
} else {
    warn('window.notification is already registered.');
}

try {
    observer.check().then(function () {
        $('body').addClass('font-loaded');
    }, function () {
        warn('Cannot load font.');
    });
} catch (e) {
    warn('Failed to use FontFaceObserver', e);
}


