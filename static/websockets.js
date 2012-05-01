$(document).ready(function () {

    $('input[class="close"]').attr('disabled','true');
    $('input[class="msgbutton"]').attr('disabled','true');
    $('input[class="msginput"]').attr('disabled','true');

    var ws;
    var host;
    var port;
    var uri;

    function connect(){
        try{
            // test url echo.websocket.org:80/(no uri)
            host = $("#host").val();
            port = $("#port").val();
            uri = $("#uri").val();

            ws = new WebSocket("ws://" + host + ":" + port + "/" + uri);

            message('<p class="event">Socket Status: ' + ws.readyState);

            ws.onopen = function(){
               	message('<p class="event">Socket Status: ' + ws.readyState + ' (open)');
                $('input[class="open"]').attr('disabled','true');
                $('input[class="close"]').removeAttr('disabled');
                $("body").css("background", "#CCFFCC"); //green
                $('input[class="msgbutton"]').removeAttr('disabled');
                $('input[class="msginput"]').removeAttr('disabled');               		 
            }

            ws.onmessage = function(msg){
                message('<p class="received">' + msg.data);
            }

            ws.onclose = function(){
                message('<p class="event">Socket Status: ' + ws.readyState + ' (Closed)');
                $('input[class="open"]').removeAttr('disabled');
                $('input[class="close"]').attr('disabled','true');
                $('input[class="msgbutton"]').attr('disabled','true');
                $('input[class="msginput"]').attr('disabled','true');
                $("body").css("background", "#FF6666");
            }			

        } catch(exception){
            message('<p class="error">' + exception);
        }
    }

    function message(msg){
        $('#chatlog').append(msg+'</p>');
        $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight - $('#chatlog').height());
    }

	if(!("WebSocket" in window)){
		$('#container, msgbutton, msginput, #textlog').fadeOut("fast");
		$('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');
	}
	else{
		$('<p>Ok, your browser supports WebSockets').appendTo('#container');

        connect();

        $("#open").click(function(evt) {
        	connect();
        });        
        
        $("#close").click(function(evt) {
            ws.close()
        });    	

        $('#message').keypress(function(event) {
            if (event.keyCode == '13') {
                var message = $("#message").val();
                ws.send(message);
                $("body").css("background", "#CAAFCC"); //velvet
                $('#chatlog').append('<p class="message">' + message + '</p>');
                $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight - $('#chatlog').height());
                $('input[class="msginput"]').val('');
            }
        });
    }    
});

