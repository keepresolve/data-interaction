#####2017/8/17 20:50 更新一些功能
 1:添加了文字更改字体颜色功能。
 2:添加了一些上传图片以及表情功能。
#####运行 
安装git下（如果没有自行安装）
1:clone下来
2:本目录下右击运行根据package.json配置运行下载依赖包
    
      npm install 
3:node运行server.js（基于node）
4:打开localhost:80/localhost  [注：如果端口号起冲突请自行打开server更改端口]
5:如果部署上线,可以利用第三方服务（支持服务器），如果没有可以利用花生壳等映射网址，然后一个多人聊天室就可以实现。
####问题
1:如果不能运行请检查package.json 的依赖项是否都下载完整
2:如果图片，消息，字体不能使用请自行打开scripts文件下的hichat.js文件下的_开头的方法对应项（根据注释更改）
3:如果有其他问题请看下面

 1： socket.io 提供了三种默认的事件：connect 、message 、disconnect 。
  2：当与对方建立连接后自动触发 connect 事件，当收到对方发来的数据
 后触发 message 事件（通常为 socket.send() 触发），
3： 当对方关闭连接后触发 disconnect 事件。

     socket.emit() ：向建立该连接的客户端广播
     socket.broadcast.emit() ：向除去建立该连接的客户端的所有客户端广播
     io.sockets.emit() ：向所有客户端广播，等同于上面两个的和
socket.emit(“name”，data)通过emit定义事件发送消息（客户端和服务器相同）
通过socket.on("name",fn)来接受（客户端和服务器）
服务器通过 socket.broadcast.emit(“name”,fn) ：向除去建立该连接的客户端的所有客户端广播
————————————————————————————————————
面向对象的写法注意init的初始化。注意端口号的使用如果客户端的网页没有部署在服务器请注意前端的io.connect();填写的的地址
