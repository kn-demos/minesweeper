'use strict';

window.MineSweeper = (function(Backbone, Marionette) {
    var App, API;

    API = {};


    App = new Marionette.Application();

    App.addRegions({
        MainRegion: '.minesweeper',
        GameRegion: '#game-region',
        BoardRegion: '.game__board',
        SmileyRegion: '.game__header .sprite--smiley',
        NavRegion: '.nav--main'
    });

    App.addInitializer(function() {
        this.module('GameApp').start();
    });

    // return main region as default region
    App.reqres.setHandler("default:region", function() {
        return App.MainRegion;
    });

    // register any controller instance created to the App
    App.commands.setHandler("register:instance", function(instance, id) {
        App.register(instance, id);
    });

    // unregister any controller instance when it is killed/closed
    App.commands.setHandler("unregister:instance", function(instance, id) {
        App.unregister(instance, id);
    });


    App.DEBUG = false;

    return App;

})(Backbone, Marionette);