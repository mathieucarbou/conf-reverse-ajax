WEB_SOCKET_SWF_LOCATION = '/chat/WebSocketMain.swf';

jQuery(function($) {

    setTitle('Socket.IO Chat');

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('User logged.');

            var socket = new io.Socket(document.domain, {
                resource: 'chat'
            });

            socket.on('connect', function() {
                log('Connected !');
            });

            socket.on('disconnect', function(disconnectReason, errorMessage) {
                log('Closed ! reason=' + disconnectReason + ', error=' + errorMessage);
            });

            socket.on('message', function(mtype, data, error) {
                addChats($.parseJSON(data));
            });

            socket.connect();

            $('#send').click(function() {

                log('Sending message...');
                socket.send($('#msg').val());
                $('#msg').val('');

            });

            activateChat();

        });

    });

});
