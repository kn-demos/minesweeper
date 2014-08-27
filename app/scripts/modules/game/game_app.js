'use strict';

window.MineSweeper.module('GameApp', function(GameApp, App, Backbone, Marionette, $, _) {
    var API, Game;

    API = {
        start: function(difficulty) {
            API.close();
            
            if(difficulty) {
                localStorage.setItem('difficulty', difficulty);
            }
            else {
                difficulty = localStorage.getItem('difficulty');
            }

            return new GameApp.Game.Controller({
                region: App.GameRegion,
                difficulty: difficulty || 'easy'
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

    App.vent.on('game:start', function(difficulty) {
        API.start(difficulty);
    });

    App.vent.on('game:cheat', function() {
        API.cheat();
    });

    App.vent.on('game:validate', function() {
        API.validate();
    });
});
