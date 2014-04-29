$('#chatbox').keyup(function(e) {
	if (e.keyCode == 13){
		if (app.online){
			app.socket.emit('chat', { id: app.socketId, msg: this.value });
			var entry = "<b>"+app.socketId+"</b>: "+this.value+"<br>";
			$('#chats').append(entry);
			this.value = "";
		} else {
			alert("Sorry, it seems that you're not connected to the others :(");
		}
	}
});

app.socket.on('chat', function (data) {
	var entry = "<b>"+data['id']+"</b>: "+data['msg']+"<br>";
	$('#chats').append(entry);
})