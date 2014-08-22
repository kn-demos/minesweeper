'use strict';

window.MineSweeper.module('NavApp', function(NavApp, App, Backbone, Marionette, $, _) {
    var API, Nav;

    API = {
        start: function() {
            return new NavApp.Nav.Controller({
                region: App.NavRegion
            });
        }
    };


    // events/listeners

    NavApp.on('start', function() {
        Nav = API.start();
    });
});
