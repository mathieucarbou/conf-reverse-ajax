/*
 * Copyright (C) 2011 Ovea <dev@ovea.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if (window.Log == undefined) {

    window.Log = {
        // constants
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,

        // default level for static logging
        level: 1,

        // static logging
        debug: function() {
            Log.log(Log.DEBUG, Log.level, 'main', arguments);
        },
        info: function() {
            Log.log(Log.INFO, Log.level, 'main', arguments);
        },
        warn: function() {
            Log.log(Log.WARN, Log.level, 'main', arguments);
        },
        error: function() {
            Log.log(Log.ERROR, Log.level, 'main', arguments);
        },

        // internal
        log: function(levelWanted, levelNow, name, args) {
            if (window.console != undefined && levelWanted >= levelNow) {
                var msg = args.length > 1 ? Log._merge(args[0], args[1]) : args[0];
                switch (levelWanted) {
                    case Log.DEBUG:
                        console.debug('DEBUG [' + name + '] ' + msg);
                        break;
                    case Log.INFO:
                        console.info('INFO [' + name + '] ' + msg);
                        break;
                    case Log.WARN:
                        console.warn('WARN [' + name + '] ' + msg);
                        break;
                    case Log.ERROR:
                        console.error('ERROR [' + name + '] ' + msg);
                        break;
                }
            }
        },
        _merge: function(template, data) {
            return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
                var keys = key.split(".");
                var value = data[keys.shift()];
                for (var i in keys) {
                    value = value[keys[i]];
                }
                if (value === null || value === undefined)
                    return "";
                if (typeof value == 'object')
                    return $.toJSON(value);
                return value;
            });
        }

    };

    window.Logger = function(name) {
        this.name = name;
    };

    window.Logger.prototype = {
        debug: function() {
            Log.log(Log.DEBUG, Log.level, this.name, arguments);
        },
        info: function(msg) {
            Log.log(Log.INFO, Log.level, this.name, arguments);
        },
        warn: function(msg) {
            Log.log(Log.WARN, Log.level, this.name, arguments);
        },
        error: function(msg) {
            Log.log(Log.ERROR, Log.level, this.name, arguments);
        }
    }

}
