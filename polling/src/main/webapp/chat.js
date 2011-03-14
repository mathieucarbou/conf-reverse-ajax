jQuery(function($) {

    setTitle('Polling Chat');

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
                var message = $('#msg').val();
                if (message) {
                    log('Sending message...');
                    $.post('chat', {
                        msg: message
                    }, function() {
                        log('Message sent !');
                        $('#msg').val('');
                    })
                }
            });

            activateChat();

            setInterval(function() {
                log('Checking for messages...');
                $.ajax({
                    url: 'chat',
                    type: 'GET',
                    dataType: 'json'
                }).success(function(messages) {
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