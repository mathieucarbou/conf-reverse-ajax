jQuery(function($) {

    setTitle('Atmosphere Chat');

    function getTransport() {
        if ('WebSocket' in window)
            return 'websocket';
        if ('XMLHttpRequest' in window && 'multipart' in window.XMLHttpRequest.prototype)
            return 'streaming';
        return 'polling';
    }

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('User logged !');

            $.atmosphere.request = {
                transport: getTransport()
            };

            log('Transport choosed: ' + $.atmosphere.request.transport);

            $.atmosphere.subscribe('chatroom', function(response) {
                log('Transport used: ' + response.transport);
                if (response.transport != 'polling' && response.state != 'connected' && response.state != 'closed') {
                    if (response.status == 200) {
                        addChats($.parseJSON(response.responseBody));
                    }
                }
            }, $.atmosphere.request);

            var connectedEndpoint = $.atmosphere.response;

            $('#send').click(function() {

                log('Sending message...');

                $.atmosphere.request = {
                    data: $('#msg').val('')
                };
                connectedEndpoint.push('chatroom', null, $.atmosphere.request);

            });

            activateChat();

        });
    });

});
