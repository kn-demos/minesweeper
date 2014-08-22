'use strict';

window.MineSweeper.module("Controllers", function(Controllers, App, Backbone, Marionette, $, _) {
    Controllers.Base = Marionette.Controller.extend({

        constructor: function(options) {
            if (options == null) {
                options = {};
            }

            this.region = options.region || App.request("default:region");
            this._instance_id = _.uniqueId("controller");
            App.execute("register:instance", this, this._instance_id);
            Marionette.Controller.prototype.constructor.apply(this, arguments);
        },

        destroy: function() {
            // unregister the controller
            App.execute("unregister:instance", this, this._instance_id);
            Marionette.Controller.prototype.destroy.apply(this, arguments);

            return this;
        },

        show: function(view, options) {
            if (options == null) {
                options = {};
            }
            _.defaults(options, {
                region: this.region
            });

            this._setMainView(view);
            this._manageView(view, options);

            return this;
        },

        resetMainView: function(view) {
            this._removeMainView();

            if(view) {
                this._setMainView(view);
            }

            return this;
        },

        getInstanceID: function() {
            return this._instance_id;
        },

        _setMainView: function(view) {
            if (this._mainView) {
                return;
            }

            this._mainView = view;
            this.listenTo(view, "close", this.close);

            return this;
        },

        _manageView: function(view, options) {
            options.region.show(view);

            return this;
        },

        _removeMainView: function() {
            this.stopListening(this._mainView);
            delete this._mainView;
            return this;
        }
    });

});
