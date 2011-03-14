jQuery(function($) {

    document.title = 'Piggyback Chat';
    $('h1').text(document.title);

    function log(msg) {
        $('#logs').prepend($('<p/>').text(msg));
    }

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

            $('#connect').attr('disabled', 'disabled');
            $('#user').attr('disabled', 'disabled');
            $('#send').removeAttr('disabled');
            $('#msg').removeAttr('disabled');

            $('#send').click(function() {
                log('Sending message...');
                $.post('chat', {
                    msg: $('#msg').val()
                }, function(messages) {

                    log('Message sent !');
                    $('#msg').val('');

                    if (messages) {
                        log(messages.length + ' message(s).');
                    } else {
                        log('No messages !');
                    }
                    for (var i in messages) {
                        var line = $('<p><span class="at"></span><br/><span class="from"></span> : <span class="msg"></span></p>');
                        $('.from', line).text(messages[i].from);
                        $('.at', line).text(new Date(messages[i].at).toLocaleString());
                        $('.msg', line).text(messages[i].msg);
                        $('#chatroom').prepend(line);
                    }
                })
            });
        });
    });

});