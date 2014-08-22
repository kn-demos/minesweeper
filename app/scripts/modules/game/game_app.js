'use strict';

window.MineSweeper.module('GameApp', function(GameApp, App, Backbone, Marionette, $, _) {
    var API, Game;

    API = {
        start: function() {
            API.close();

            return new GameApp.Game.Controller({
                region: App.GameRegion
            });
        },

        close: function() {
            if(Game) {
                Game.destroy();
            }
        },

        cheat: function() {
            Game.cheat();
        },

        validate: function() {
            Game.validate();
        }
    };


    // events/listeners

    GameApp.on('start', function() {
        Game = API.start();
    });

    App.vent.on('game:start', function() {
        API.start();
    });

    App.vent.on('game:cheat', function() {
        API.cheat();
    });

    App.vent.on('game:validate', function() {
        API.validate();
    });
});
