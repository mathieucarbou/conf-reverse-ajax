jQuery(function($) {

    setTitle('WebSocket Chat');

    if (!('WebSocket' in window)) {
        alert('WebSocket not supported in your browser !');
    }

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('User logged.');

            var location = document.location.toString().replace('http://', 'ws://') + 'chat';

            log('Connecting to: ' + location);
            var ws = new WebSocket(location);

            ws.onopen = function() {
                log('Connected !');
            };

            ws.onerror = function(e) {
                log('ERROR ! See console !');
                console.log(e);
            };

            ws.onclose = function() {
                log('Closed !');
            };

            ws.onmessage = function(evt) {
                addChats($.parseJSON(evt.data));
            };

            $('#send').click(function() {

                log('Sending message...');
                ws.send($('#msg').val());
                $('#msg').val('');
                
            });

            activateChat();

        });

    });

});
