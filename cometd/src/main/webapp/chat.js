WEB_SOCKET_SWF_LOCATION = '/chat/WebSocketMain.swf';

jQuery(function($) {

    setTitle('Cometd Chat');

    $('#connect').click(function() {

        $.post('login', {user: $('#user').val()}, function() {

            log('User logged.');

            $.cometd.websocketEnabled = true;
            $.cometd.configure({
                url: document.location + 'cometd',
                logLevel: 'debug',
                maxNetworkDelay: 30000
            });

            $.cometd.handshake();

            $.cometd.subscribe("/topics/chatroom", function(event) {
                console.log(arguments);
                addChats(event.data);
            });

            $('#send').click(function() {

                log('Sending message...');

                $.cometd.publish('/topics/chatroom', [
                    {
                        from: $('#user').val(),
                        msg: $('#msg').val(),
                        at: new Date().getTime()
                    }
                ]);

                $('#msg').val('');

            });

            activateChat();

        });

    });

});
