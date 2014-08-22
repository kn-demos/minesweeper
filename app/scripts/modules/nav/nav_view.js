'use strict';

window.MineSweeper.module('NavApp.Nav', function(Nav, App, Backbone, Marionette, $, _) {
    Nav.List = Marionette.ItemView.extend({
        events: {
            'click .nav__item > a': 'openNav',
            'click .js-start': 'start',
            'click .js-validate': 'validate',
            'click .js-cheat': 'cheat'
        },

        openNav: function(e) {
            var nav = $(e.target).siblings('.dropdown__content');

            if(nav && this.open_nav && nav[0] !== this.open_nav[0]) {
                this.closeNav(false);
            }

            if(!this.open_nav) {
                this.open_nav = nav;

                this.toggleNav(true);
                window.setTimeout(_.bind(function() {
                    $('html').on('click.nav', _.bind(this.closeNav, this));
                }, this), 25);
            }
        },

        closeNav: function(e) {
            if(!e || $(e.target).closest('.dropdown__content').length === 0) {
                this.toggleNav(false);
                this.open_nav = null;
                $('html').off('click.nav');
            };
        },

        toggleNav: function(toggle) {
            this.open_nav.toggleClass('active', toggle);
        },

        start: function() {
            App.vent.trigger('game:start');
        },

        cheat: function() {
            App.vent.trigger('game:cheat');
        },

        validate: function() {
            App.vent.trigger('game:validate');
        }
    });
});
