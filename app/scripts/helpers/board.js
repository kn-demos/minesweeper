'use strict';

window.MineSweeper.module('Helpers', function(Helpers, App, Backbone, Marionette, $, _) {
    Helpers.Board = {
        /**
         * Get the position of the tile in the tiles collection (array)
         * @param w - width
         * @param x - x pos on board
         * @param y - y pos on board
         * @returns {number}
         */
        tilePositionInArray: function(w, x, y) {
            return w * x + y;
        }
    }
});
