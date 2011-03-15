WEB_SOCKET_SWF_LOCATION = '/chat/WebSocketMain.swf';

jQuery(function($) {

    setTitle('Event-Driven Web Chat');

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('User logged.');

            var bus = EventBus.socketIO({
                name: 'EventBus for Chat',
                path: 'chat',
                onConnect: function() {

                    log('Connected !');

                    bus.topic('/bus/chatroom').subscribe(function(messages, event) {
                        addChats(messages);
                    });

                    activateChat();

                    $('#send').click(function() {

                        log('Sending message...');
                        bus.topic('/bus/chatroom').publish([
                            {
                                from: $('#user').val(),
                                msg: $('#msg').val(),
                                at: new Date().getTime()
                            }
                        ]);
                        $('#msg').val('');

                    });
                }
            });

            bus.start();

        });

    });

});
