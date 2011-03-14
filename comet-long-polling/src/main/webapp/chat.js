jQuery(function($) {

    setTitle('Comet Long Polling Chat');

    function startLongPolling() {
        $.getJSON('chat', function(messages) {
            if (messages) {
                log(messages.length + ' message(s).');
                addChats(messages);
            } else {
                log('No messages !');
            }
            startLongPolling();
        });
    }

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('Connected !');

            $('#send').click(function() {

                log('Sending message...');

                $.post('chat', {msg: $('#msg').val()}, function(messages) {

                    log('Message sent !');
                    $('#msg').val('');

                })
            });

            activateChat();

            startLongPolling();
        });
    });

});