jQuery(function($) {

    setTitle('Piggyback Chat');

    $('#connect').click(function() {

        $.post('chat', {user: $('#user').val()}, function() {

            log('Connected !');

            $('#send').click(function() {

                log('Sending message...');

                $.post('chat', {msg: $('#msg').val()}, function(messages) {

                    log('Message sent !');
                    $('#msg').val('');

                    addChats(messages);
                    
                })
            });

            activateChat();
        });
    });

});