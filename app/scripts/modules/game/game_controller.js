'use strict';

window.MineSweeper.module('GameApp.Game', function(Game, App, Backbone, Marionette, $, _) {
    Game.Controller = App.Controllers.Base.extend({
        initialize: function(options) {
            var collection = App.request('board:tiles'),
                view = new Game.Board({
                    collection: collection
                });

            this.listenTo(view, 'childview:tile:click', this.handleClick);

            this.show(view);
        },

        handleClick: function(view) {
            var status = this.region.currentView.collection.checkTile(view.model);

            if(!status) {
                this.fail(view);
            }
        },

        cheat: function() {
            this.region.currentView.cheat();
        },

        validate: function() {
            var status = this.region.currentView.collection.checkMines();

            this.region.currentView.toggleValidate();

            if(!status) {
                this.fail();
            }
            else {
                this.win();
            }
        },

        fail: function(tile) {
            // show mines
            this.region.currentView.fail(tile);
            // show clicked on mine with background red and x over it
        }
    });
});
