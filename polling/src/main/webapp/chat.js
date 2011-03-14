jQuery(function($) {

    setTitle('Polling Chat');

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('Connected !');

            $('#send').click(function() {

                log('Sending message...');

                $.post('chat', {msg: $('#msg').val()}, function() {

                    log('Message sent !');
                    $('#msg').val('');
                })
            });

            activateChat();

            setInterval(function() {
                log('Checking for messages...');
                $.getJSON('chat', function(messages) {
                    if (messages) {
                        log(messages.length + ' message(s).');
                        addChats(messages);
                    } else {
                        log('No messages !');
                    }
                });
            }, 4000);
        });
    });

});