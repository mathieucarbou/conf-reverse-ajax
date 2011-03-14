(function($) {

    window.setTitle = function(title) {
        document.title = title;
        $('h1').text(title);
    };

    window.activateChat = function() {
        $('#connect').attr('disabled', 'disabled');
        $('#user').attr('disabled', 'disabled');
        $('#send').removeAttr('disabled');
        $('#msg').removeAttr('disabled');
    };

    window.log = function(msg) {
        $('#logs').prepend($('<div/>').text(msg));
    };

    window.addChats = function(messages) {
        for (var i in messages) {
            addChat(messages[i]);
        }
    };

    window.addChat = function(message) {
        var line = $('<p><span class="at"></span><br/><strong><span class="from"></span> : </strong><span class="msg"></span></p>');
        $('.from', line).text(message.from);
        $('.at', line).text(new Date(message.at).toLocaleString());
        $('.msg', line).text(message.msg);
        $('#chatroom').prepend(line);
    };

})(jQuery);
