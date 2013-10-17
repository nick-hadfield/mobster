(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'knockout'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.jQuery, root.ko);
    }

}(this, function ($, ko) {
    "use strict";

    var mobster = (function() {

        var $;
        var ko;
        var mobster = {};

        // Log //
        var log = function(text) {
            if (console) {
                console.log('[ Mobster ] ' + text);
            }
        };

        // Each //
        var each = function(values, f) {
            for (var property in values) {
                if (values.hasOwnProperty(property)) {
                    f(values[property]);
                }
            }
        };

        // Each (for promises) //
        var peach = function (enumerable, f) {
            var deferred = new $.Deferred();

            if (enumerable.length == 0) {
                deferred.resolve();
            } else {
                var value = enumerable.shift();
                $.when()
                    .pipe(function() { return f(value); })
                    .pipe(function() { return peach(enumerable, f); })
                    .pipe(function() { deferred.resolve(); });
            }

            return deferred.promise();
        };

        // While (for promises) //
        var pwhile = function(condition, f) {
            var deferred = new $.Deferred();
            if (condition()) {
                $.when()
                    .pipe(function() { return f(); })
                    .pipe(function() { return pwhile(condition, f); })
                    .pipe(function() { return deferred.resolve(); });
            } else {
                deferred.resolve();
            }
            return deferred.promise();
        };

        // Delay (for promises) //
        var pdelay = function(milliseconds) {
            var deferred = new $.Deferred();
            setTimeout(function() {
                deferred.resolve();
            }, milliseconds);
            return deferred.promise();
        };

        // Uri //
        var Uri = function(url) {
            var that = this;

            var a = document.createElement('a');
            a.href = url; //"http://example.com:3000/pathname/?search=test#hash";

            that.url = url;
            that.protocol = a.protocol; // => "http:"
            that.hostname = a.hostname; // => "example.com"
            that.port = a.port;         // => "3000"
            that.pathname = a.pathname; // => "/pathname/"
            that.search = a.search;     // => "?search=test"
            that.hash = a.hash;         // => "#hash"
            that.host = a.host;         // => "example.com:3000"

            // if search appears as part of hash, move it to the search //
            if (-1 != that.hash.indexOf('?')) {
                that.search = that.hash.substring(that.hash.indexOf('?'));
                that.hash = that.hash.substring(0, that.hash.indexOf('?'));
            }

            that.params = {};
            each(that.search.substring(1).split('&'), function(pair) {
                var name;
                var value;
                var i = pair.indexOf('=');
                if (-1 == i) {
                    name = pair;
                } else {
                    name = pair.substring(0, i);
                    value = pair.substring(i + 1);
                }
                that.params[name] = value;
            });

            return that;
        };

        // Router //
        var Router = (function() {
            var Router = function() {
                var that = this;
                that.routes = {};
                that.basePath = '';
                $(window).on('hashchange', function() {
                    that.execute();
                });
                return that;
            };
            Router.prototype.setBasePath = function(basePath) {
                var that = this;
                that.basePath = basePath;
                return that;
            };
            Router.prototype.get = function(route, handler) {
                var that = this;
                that.routes[route] = handler;
                return that;
            };
            Router.prototype.route = function(url) {
                log('Routing ' + url);
                var that = this;
                var uri = new Uri(url);
                var route = uri.pathname + uri.hash;
                if (that.basePath) {
                    if (route.substring(0, that.basePath.length) == that.basePath) {
                        route = route.substring(that.basePath.length);
                    }
                }
                var handler = that.routes[route] || that.routes[uri.hash];
                if (handler) {
                    handler(uri.params);
                }
                return that;
            };
            Router.prototype.execute = function() {
                var that = this;
                that.route(document.URL);
                return that;
            };
            return Router;
        })();

        // Container - Not yet implemented. //
        var Container = (function() {
            var Container = function() {
                var that = this;
                that.$el = $('<div></div>');
                return that;
            };
            Container.prototype.resolve = function() {
                var that = this;
                var deferred = new $.Deferred();
                deferred.resolve(that);
                return deferred.promise();
            };
            Container.prototype.setTemplateText = function(text) {
                var that = this;
                that.$el.html(text);
                return that.resolve();
            };
            Container.prototype.applyBindings = function(model) {
                var that = this;
                log('Container: Binding');
                ko.applyBindings(model || {}, that.$el[0]);
                return that;
            };
            return Container;
        })();

        // Navigator - Not yet implemented. //
        var Navigator = (function() {
            var Navigator = function() {
                var that = this;
                that.containers = ko.observableArray();
                return that;
            };
            Navigator.prototype.back = function() {
                var that = this;
                var deferred = new $.Deferred();
                var value = that.containers.pop();
                return {
                    value: value,
                    promise: deferred.promise()
                };
            };
            return Navigator;
        })();

        // JQuery //
        mobster.setJquery = function(jquery) {
            $ = jquery;
            return mobster;
        };

        // Knockout //
        mobster.setKnockout = function(knockout) {
            ko = knockout;
            return mobster;
        };

        // Initialise //
        var initialised = false;
        mobster.initialise = function() {
            if (!$) throw "Jquery has not been initialised. Please call 'setJquery($)'.";
            if (!ko) throw "Knockout has not been initialised. Please call 'setKnockout(knockout)'.";
            if (initialised) throw "Mobster has already been initialised.";
            initialised = true;
            mobster.Uri = Uri;
            mobster.Router = Router;
            mobster.Container = Container;
            mobster.Navigator = Navigator;
            mobster.f = {
                each: each,
                peach: peach,
                pwhile: pwhile,
                pdelay: pdelay
            };
            return mobster;
        };

        return mobster;
    })();

    mobster
        .setJquery($)
        .setKnockout(ko);

    if ($ && ko) {
        mobster.initialise();
    }

    return mobster;
}));


