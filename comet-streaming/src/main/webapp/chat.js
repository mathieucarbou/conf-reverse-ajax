jQuery(function($) {

    setTitle('Comet Http Streaming Chat');

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

            var xhr = jQuery.ajaxSettings.xhr();
            xhr.multipart = true;
            xhr.open('GET', 'chat', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    addChats($.parseJSON(xhr.responseText));
                }
            };
            xhr.send(null);
            
        });
    });

});
