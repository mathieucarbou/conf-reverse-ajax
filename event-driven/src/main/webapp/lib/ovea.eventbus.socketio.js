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
if (window.EventBus.socketIO == undefined) {
    (function($) {

        window.EventBus.socketIO = function(options) {

            options = $.extend({
                reconnectDelay: 10000,
                path: document.location.pathname,
                name: 'EventBus.SocketIO',
                onConnect: function(eventbus) {
                }
            }, options || {});

            var MessageType = {
                SUBSCRIBE: 1,
                UNSUBSCRIBE: 2,
                PUBLISH: 3,
                ACK: 4
            };
            var logger = new Logger(options.name);
            var eventbus = undefined;
            var queue = [];
            var socket = new io.Socket(document.domain, {
                resource: options.path
            });

            function send(msg) {
                if (socket.isConnected()) {
                    logger.debug('send - Sending message type=' + msg.type);
                    socket.send($.toJSON([msg]));
                } else {
                    if (msg.type == MessageType.SUBSCRIBE || msg.type == MessageType.UNSUBSCRIBE)
                        for (var i in queue)
                            if (queue[i].type == msg.type && queue[i].topic == msg.topic)
                                return;
                    logger.debug('send - Queueing message type=' + msg.type);
                    queue.push(msg);
                }
            }

            socket.on('connect', function() {
                logger.debug('on connect - Socket connected !');
                if (queue.length) {
                    logger.debug('on connect - Dequeueing messages');
                    socket.send($.toJSON(queue));
                    queue = [];
                }
                options.onConnect.call(eventbus);
            });

            socket.on('disconnect', function(disconnectReason, errorMessage) {
                logger.debug('on disconnect - {args}', {args: arguments});
                if (disconnectReason != socket.DR_CLOSED && disconnectReason != socket.DR_CLOSED_REMOTELY) {
                    // prepare burst message offline to reactivate topics
                    logger.debug('on disconnect - preparing offline messages');
                    for (var name in eventbus.topics) {
                        send({
                            type: MessageType.SUBSCRIBE,
                            topic: name
                        });
                    }
                    // try reconnect
                    setTimeout(function() {
                        logger.debug('on disconnect - trying to reconnect');
                        socket.connect();
                    }, options.reconnectDelay);
                }
            });

            socket.on('message', function(mtype, obj, error) {
                var msg = $.parseJSON(obj);
                if (msg.type == MessageType.PUBLISH) {
                    logger.debug('on message - publishing to ' + msg.topic);
                    var data = $.parseJSON(msg.data);
                    eventbus.topic(msg.topic).fire(data, msg);
                }
            });

            eventbus = new EventBus({
                name: options.name,
                onPublish: function(data) {
                    logger.debug('onPublish - sending to ' + this.name);
                    data = $.toJSON(data);
                    send({
                        type: MessageType.PUBLISH,
                        topic: this.name,
                        data: data
                    });
                },
                onSubscribe: function(callback) {
                    logger.debug('onSubscribe - to ' + this.name);
                    send({
                        type: MessageType.SUBSCRIBE,
                        topic: this.name
                    });
                },
                onTopicEmpty: function() {
                    logger.debug('onTopicEmpty - unsubscribing from ' + this.name);
                    send({
                        type: MessageType.UNSUBSCRIBE,
                        topic: this.name
                    });
                }
            });

            eventbus.start = function() {
                if (!socket.isConnected()) {
                    logger.debug('starting');
                    socket.connect();
                }
            };

            eventbus.stop = function() {
                if (socket.isConnected()) {
                    logger.debug('stopping');
                    socket.close();
                }
            };

            eventbus.socket = socket;

            return eventbus;
        };

    })(jQuery);
}
