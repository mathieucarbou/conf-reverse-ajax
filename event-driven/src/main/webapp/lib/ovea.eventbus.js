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
if (window.EventBus == undefined) {

    EventBus = function(options) {
        this.options = {
            name: "no-name",
            onPublish: function() {
                this.fire.apply(this, arguments);
            },
            onSubscribe: function(callback) {
            },
            onUnsubscribe: function(callback) {
            },
            onTopicEmpty: function() {
            }
        };
        if (options)
            for (var p in options)
                this.options[p] = options[p];
        this.logger = new Logger(this.options.name);
        this.topics = {};
    };

    EventBus.Topic = function(bus, topicName) {
        this.bus = bus;
        this.name = topicName;
        this.subscribers = [];
    };

    EventBus.Topic.prototype = {
        subscribe: function(callback) {
            var logger = this.bus.logger;
            if (!this.isRegistered(callback)) {
                logger.debug('Adding subscription to ' + this.name);
                this.subscribers.push(callback);
                this.bus.options.onSubscribe.call(this, callback);
            }
        },
        unsubscribe: function(callback) {
            if (callback) {
                var pos = this.subscribers.indexOf(callback);
                if (pos != -1) {
                    this.bus.logger.debug('Removing subscription to ' + this.name);
                    this.subscribers.splice(pos, 1);
                    this.bus.options.onUnsubscribe.call(this, callback);
                    if (!this.subscribers.length) {
                        this.bus.options.onTopicEmpty.call(this);
                    }
                }
            } else {
                this.subscribers = [];
                this.bus.options.onTopicEmpty.call(this);
            }
        },
        isRegistered: function(callback) {
            return this.subscribers.indexOf(callback) != -1;
        },
        publish: function() {
            this.bus.logger.debug('Publishing to ' + this.name);
            this.bus.options.onPublish.apply(this, arguments)
        },
        fire: function() {
            for (var i in this.subscribers)
                this.subscribers[i].apply(this, arguments);
        }
    };

    EventBus.prototype = {
        topic: function(name) {
            if (this.topics[name] == undefined)
                this.topics[name] = new EventBus.Topic(this, name);
            return this.topics[name];
        },
        start: function() {
        },
        stop: function() {
        }
    };

}
