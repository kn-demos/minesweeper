'use strict';

(function(Marionette) {
    _.extend(Marionette.Application.prototype, {

        navigate: function(route, options) {
            options = options || {};
            Backbone.history.navigate(route, options);
        },

        getCurrentRoute: function() {
            var frag = Backbone.history.fragment;

            if(_.isEmpty(frag)) { return null; }

            return frag;
        },

        startHistory: function() {
            var silent = false;

            if(Backbone.history) {
                if (!(window.history && window.history.pushState)) {
                    silent = true;
                }

                Backbone.history.start({ pushState: "pushState" in window.history, silent: silent });
            }
        },

        register: function(instance, id) {
            this._registry = this._registry || {};

            this._registry[id] = instance;
        },

        unregister: function(instance, id) {
            return delete this._registry[id];
        },

        resetRegistry: function() {
            var msg, key, controller, newCount,
                oldCount = this.getRegistrySize();

            for(key in this._registry) {
                controller = this._registry[key];
                controller.region.close();

                // if debug
                if(this.DEBUG) {
                    newCount = this.getRegistrySize();
                    msg = "There were " + oldCount + "controllers in the registry, there are now " + newCount;
                    if(newCount > 0) {
                        console.warn(msg, this._registry);
                    }
                    else {
                        console.log(msg);
                    }
                }
            }
        },

        getRegistrySize: function() {
            return _.size(this._registry);
        }
    });

})(Marionette);
