'use strict';

window.MineSweeper.module('NavApp.Nav', function(Nav, App, Backbone, Marionette, $, _) {
    Nav.Controller = App.Controllers.Base.extend({
        initialize: function(options) {
            var view = new Nav.List({
                    el: this.region.el
                });

            //this.show(view);

            this.region.attachView(view);
        }
    });
});
