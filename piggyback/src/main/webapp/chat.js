jQuery(function($) {

    setTitle('Piggyback Chat');

    $('#connect').click(function() {

        $.ajax({
            url: 'chat',
            type: 'post',
            data: {
                user: $('#user').val()
            }
        }).success(function() {

            // when connected successfully
            log('Connected !');

            $('#send').click(function() {
                log('Sending message...');
                $.post('chat', {
                    msg: $('#msg').val()
                }, function(messages) {

                    log('Message sent !');
                    $('#msg').val('');

                    if (messages) {
                        log(messages.length + ' message(s).');
                        addChats(messages);
                    } else {
                        log('No messages !');
                    }
                })
            });

            activateChat();
        });
    });

});