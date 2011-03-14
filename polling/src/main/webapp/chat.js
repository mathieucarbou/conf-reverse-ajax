jQuery(function($) {

    document.title = 'Polling Chat';
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

            setInterval(function() {
                log('Checking for messages...');
                $.ajax({
                    url: 'chat',
                    type: 'GET',
                    dataType: 'json'
                }).success(function(messages) {
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
                }).error(function() {
                    clearInterval(interval);
                    $('#send').attr('disabled', 'disabled');
                    $('#msg').attr('disabled', 'disabled');
                    $('#connect').removeAttr('disabled');
                    $('#user').removeAttr('disabled');
                });
            }, 4000);
        });
    });

});