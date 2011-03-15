jQuery(function($) {

    setTitle('Comet Http Streaming Chat with Servlet 3.0 API');

    if (!('XMLHttpRequest' in window && 'multipart' in window.XMLHttpRequest.prototype)) {
        alert('Comet Http Streaming Chat not supported in your browser !');
    }

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
