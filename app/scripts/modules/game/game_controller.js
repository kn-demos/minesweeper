'use strict';

window.MineSweeper.module('GameApp.Game', function(Game, App, Backbone, Marionette, $, _) {
    Game.Controller = App.Controllers.Base.extend({
        initialize: function(options) {
            var collection = App.request('board:tiles', {
                    difficulty: options.difficulty
                }),
                view = new Game.Board({
                    collection: collection
                });

            this.listenTo(view, 'childview:tile:click', this.handleClick);
            this.listenTo(view.collection, 'game:win', this.win);

            this.show(view);
        },

        handleClick: function(view, e) {
            var toggle = false,
                flagged = view.model.isFlagged(),
                right_click = (e.ctrlKey && e.button === 0) || e.button === 2;

            if(view.model.get('revealed')) {
                if(!right_click) {
                    view.trigger('click:toggle', e.type !== 'mouseup');
                }

                return false;
            }

            if(e.type === 'mouseup') {
                if(right_click) {
                    view.model.toggleFlag();
                }
                else {
                    view.trigger('click:toggle', false);

                    if(!flagged) {
                        this.checkTile(view);
                    }
                }
            }

            if(!right_click && !flagged && e.type === 'mousedown') {
                toggle = true;
                view.trigger('click:toggle', true);
            }

            view.togglePressed(toggle);
        },

        checkTile: function(view) {
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
        },

        win: function() {
            this.region.currentView.win();
        }
    });
});
