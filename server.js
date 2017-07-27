var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var static=require("express-static")
let arr=[];
app.use(static("www"))
app.get('/data', function(req, res){
	console.log("访问了")
    res.send(arr);
    res.end()
});

io.on('connection', function(socket){
    console.log('a user connected');

     
    socket.on("disconnect", function() {
        console.log("a user go out");
    });

    socket.on("message", function(obj) {
    	obj.time1=new Date().toLocaleString()
         arr.push(obj)
    	     io.emit("message", arr);
    	     console.log(arr)
    
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});