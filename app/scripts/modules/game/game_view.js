'use strict';

window.MineSweeper.module('GameApp.Game', function(Game, App, Backbone, Marionette, $, _) {
    Game.Tile = Marionette.ItemView.extend({
        tagName: 'li',
        template: function(data) {
            var t = '',
                danger = data.danger;

            if(data.mine) {
                t = '<span class="sprite sprite--mine"></span>';
            }
            else if(danger > 0) {
                t = '<span class="sprite sprite--danger sprite--danger-' + danger + '"></span>';
            }
            else {
                t = '<span class="sprite sprite--empty"></span>';
            }

            return _.template(t);
        },

        events: {
            'mousedown': 'handleMouseEvent',
            'mouseup': 'clickHandler',
            'mouseout': 'handleMouseEvent'
            //,'mousin': 'handleMouseEvent'
        },

        modelEvents: {
            'change:revealed': 'toggleRevealed',
            'change:flag': 'toggleFlag'
        },

        className: 'game__tile sprite sprite--tile',

        initialize: function() {
            this.clicking = false;
            this.flagging = false;
        },

        handleMouseEvent: function(e) {
            var toggle;

            if(e.type === 'mousedown' && (e.ctrlKey || e.button==2)) {
                this.flagging = true;
                this.model.toggleFlag();
                return false;
            }

            if(e.type === 'mousedown' || (this.clicking && e.type === 'mousin')) {
                toggle = true;

                if(e.type === 'mousedown') {
                    this.clicking = true;
                }
            }
            else {
                toggle = false;
            }

            this.togglePressed(toggle);
        },

        togglePressed: function(toggle) {
            this.$el.toggleClass('pressed', toggle);
        },

        toggleRevealed: function() {
            this.$el.toggleClass('revealed');
        },

        toggleFlag: function() {
            var flag = this.model.get('flag');

            switch(flag) {
                case 0:
                    this.$el.removeClass('flag question');
                    break;
                case 1:
                    this.$el.removeClass('flag');
                    this.$el.addClass('question');
                    break;
                case 2:
                    this.$el.removeClass('question');
                    this.$el.addClass('flag');
                    break;
            }
        },

        clickHandler: function(e) {
            if(!this.flagging) {
                this.clicking = false;
                this.handleMouseEvent(e);
                this.trigger('tile:click');
            }
        }

    });

    Game.Board = Marionette.CompositeView.extend({
        childView: Game.Tile,
        childViewContainer: '.game__board',
        template: _.template("<ul class='nav game__header'>"
            + " <li><div class='sprite sprite--smiley js-start'></div></li>"
            + "</ul>"
            + "<ul class='game__board grid cf'></ul>"),

        className: 'game',
        tile_size: 16,
        border_width: 4,

        ui: {
            'start': '.js-start'
        },

        events: {
            'mousedown @ui.start': 'pressStart',
            'mouseup  @ui.start': 'startGame'
        },

        onRender: function() {
            this.$('.game__board').width(this.collection.dims.width * this.tile_size + this.border_width);
        },

        startGame: function() {
            this.togglePressed(false);
            App.vent.trigger('game:start');
        },

        pressStart: function(e) {
            this.togglePressed(true);
        },

        togglePressed: function(toggle) {
            this.ui.start.toggleClass('pressed', toggle);
        },

        toggleValidate: function() {
            this.$el.addClass('validate');
        },

        cheat: function() {
            this.$el.addClass('cheat');
        },

        fail: function(view) {
            var class_name = 'fail';

            if(view) {
                view.$el.addClass(class_name);
            }

            this.$el.addClass(class_name);

            this.removeChildListeners();
        },

        win: function() {
            this.$el.addClass('win');
            this.removeChildListeners();
        },

        removeChildListeners: function() {
            _.each(this.children._views, _.bind(function(view) {
                this.stopListening(view);
            },this));
        }
    });
});
