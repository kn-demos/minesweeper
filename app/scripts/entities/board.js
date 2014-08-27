'use strict';

window.MineSweeper.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
    var API,
        difficulties = {
            easy: { width: 8, height: 8 },
            medium: { width: 16, height: 16 },
            hard: { width: 30, height: 16 }
        };

    Entities.Tile = Backbone.Model.extend({
        defaults: {
            mine: false,
            revealed: false,
            danger: 0,
            coords: [0,0],
            flag: 0
        },

        toggleFlag: function() {
            var flag = this.get('flag');

            switch(flag) {
                case 0:
                case 1:
                    flag++;
                    break;
                case 2:
                default:
                    flag = 0;
                    break;

            }

            this.set('flag', flag);
        },

        isFlagged: function() {
            return this.get('flag') === 1;
        }
    });

    Entities.Tiles = Backbone.Collection.extend({
        Model: Entities.Tile,

        initialize: function(models, options) {
            _.extend(this, {
                dims: options.dims,
                tiles: options.dims.width * options.dims.height,
                mines: options.mines,
                clicking: false,
                revealed: 0,
                win: false,
                fail: false
            });

            this.on('change:revealed', this.trackRevealed, this);
        },

        placeMines: function(mines) {
            var i, tile, rand,
                min = 0;

            this.mines = mines; // maybe take this out

            for(i = 0; i < mines; i++) {
                rand = _.random(min, this.tiles),
                tile = this.models[rand];

                while(tile == undefined || tile.get('mine') === true) {
                    tile = this.models[_.random(min, this.tiles)];
                }

                tile.set('mine', true);

                this.setNeighborsDanger(tile);
            }

            return this;
        },

        setNeighborsDanger: function(tile) {
            var neighbors = this.getNeighbors(tile, true);

            _.each(neighbors, function(neighbor) {
                if(neighbor) {
                    neighbor.set('danger', neighbor.get('danger') + 1);
                }
            });
        },

        getNeighbors: function(tile, diagnals) {
            if(diagnals == null) {
                diagnals = false;
            }

            var model, model_coords,
                neighbors = [],
                coords = tile.get('coords'),
                x = coords[0],
                y = coords[1],
                indicies = [
                    this.dims.width * (x - 1) + y, // top
                    this.dims.width * x + (y + 1), // right
                    this.dims.width * (x + 1) + y, // bottom
                    this.dims.width * x + (y - 1) // left
                ];

            if(diagnals) {
                indicies.push(this.dims.width * (x - 1) + (y + 1)); // top-right);
                indicies.push(this.dims.width * (x - 1) + (y - 1)); // top-left);
                indicies.push(this.dims.width * (x + 1) + (y + 1)); // bottom-right);
                indicies.push(this.dims.width * (x + 1) + (y - 1)); // bottom-left);
            }

            _.each(indicies, _.bind(function(index) {
                model = this.models[index];
                if(model) {
                    model_coords = model.get('coords');
                    if(Math.abs(model_coords[0] - coords[0]) <= 1 && Math.abs(model_coords[1] - coords[1]) <= 1) {
                        neighbors.push(model);
                    }
                }
            }, this));

            return neighbors;
        },

        checkTile: function(tile) {
            if(tile.get('mine')) {
                return 0;
            }

            var curr, q = [tile],
                visited = {};

            visited[tile.cid] = true;
            tile.set('revealed', true);

            while(q.length) {
                curr = q.shift();

                if(curr.get('danger') === 0) {
                    _.each(this.getNeighbors(curr), _.bind(function(neighbor) {
                        if(neighbor && !neighbor.get('mine') && this.inBounds(neighbor) && !visited[neighbor.cid]) {
                            visited[neighbor.cid] = true;

                            if(neighbor.get('danger') === 0) {
                                q.push(neighbor);
                            }

                            neighbor.set('revealed', true);
                        }
                    }, this));
                }
            }

            return 1;
        },

        checkMines: function() {
            var status = 1,
                tiles = _.filter(this.models, function(model) {
                    return model.get('flag') > 0
                });

            if(tiles.length < this.mines) {
                status = 0;
            }
            else {
                _.each(tiles, function(tile) {
                    if(!tile.get('mine')) {
                        status = 0;
                        return;
                    }
                });
            }

            return status;
        },

        trackRevealed: function() {
            this.revealed++;

            // trigger win
            if(this.revealed === (this.tiles - this.mines)) {
                this.trigger('game:win');
            }
        },

        inBounds: function(tile) {
            var coords = tile.get('coords');

            return 0 <= coords[0] < this.dims.width && 0 <= coords[1] < this.dims.height
        }

    });

    API = {
        getBoard: function(params) {
            var tiles, i, j, pos = 0, models = [];

            _.defaults(params, {
                // defaults here
                difficulty: 'easy',
                mines: {
                    easy: 10,
                    medium: 40,
                    hard: 99
                }
            });

            if(params.width && params.height) {
                params.difficulty = 'custom';
            }
            else {
                if(params.mines[params.difficulty] == null) {
                    params.difficulty = 'easy';
                }

                params.mines = params.mines[params.difficulty];
            }

            params.dims = difficulties[params.difficulty];

            for(i = 0; i < params.dims.height; i++) {
                for(j = 0; j < params.dims.width; j++) {
                    models.push(new Entities.Tile({
                        coords: [i, j],
                        pos: pos++
                    }));
                }
            }

            tiles = new Entities.Tiles(models, params);
            tiles.placeMines(params.mines);

            return tiles;
        }
    };

    App.reqres.setHandler('board:tiles', function(params) {
        params = params || {};
        return API.getBoard(params);
    });

});
