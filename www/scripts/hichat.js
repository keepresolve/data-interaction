window.onload = function() {
    //实例并初始化我们的hichat程序
    // console.log([1,2,3]+[1,2])
    var hichat = new HiChat();
    hichat.init();
};

//定义我们的hichat类
var HiChat = function() {
    this.socket = null;

    // alert(1)
};

//向原型添加业务方法
HiChat.prototype = {
    init: function() {//此方法初始化程序
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function(aaa) {
        //连接到服务器后，显示昵称输入框
        document.getElementById('info').textContent = 'get yourself a nickname :)';
        document.getElementById('nickWrapper').style.display = 'block';
        document.getElementById('nicknameInput').focus();
      //昵称设置的确定按钮
      document.getElementById('loginBtn').addEventListener('click', function() {
       var nickName = document.getElementById('nicknameInput').value;
                //检查昵称输入框是否为空
                if (nickName.trim().length != 0) {
                    //不为空，则发起一个login事件并将输入的昵称发送到服务器
                    that.socket.emit('login', nickName);
                } else {
                    //否则输入框获得焦点
                    alert("不能为空")
                    document.getElementById('nicknameInput').focus();
                };
            }, false);
      console.log(aaa)
  });
        //判断用户面已存在返回执行代码
        this.socket.on('nickExisted', function() {
              document.getElementById('info').textContent = '!nickname is taken, choose another pls'; //显示昵称被占用的提示
          });
        // 用户名可用事件
        this.socket.on('loginSuccess', function() {
            document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
                 document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
                 document.getElementById('messageInput').focus();//让消息输入框获得焦点
             });
        this.socket.on('system', function(nickName, userCount, type) {
            //判断用户是连接还是离开以显示不同的信息
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            //系统默认的颜色
            that._displayNewMsg("system",msg,"blue")
            var p = document.createElement('p');
            p.textContent = msg;
            document.getElementById('historyMsg').appendChild(p);
             //将在线人数显示到页面顶部
             document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
         });
        //定义发送消息
        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                    msg = messageInput.value,
                //获取颜色值
                color = document.getElementById('colorStyle').value;
                messageInput.value = '';
                messageInput.focus();
                if (msg.trim().length != 0) {
                //显示和发送时带上颜色值参数
                that.socket.emit('postMsg', msg, color);
                that._displayNewMsg('me', msg, color);
            };
        }, false);
        //接收其他的消息
        this.socket.on('newMsg', function(user, msg,color) {
            that._displayNewMsg(user, msg,color);
        });
        //图片发送
        document.getElementById('sendImage').addEventListener('change', function() {
            //检查是否有文件被选中
            if (this.files.length != 0) {
                //获取文件并用FileReader进行读取
                var file = this.files[0],
                reader = new FileReader();
                if (!reader) {
                 that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                 this.value = '';
                 return;
             };
             reader.onload = function(e) {
                    //读取成功，显示到页面并发送到服务器
                    this.value = '';
                    that.socket.emit('img', e.target.result);
                    that._displayImage('me', e.target.result);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        //接收图片
        this.socket.on("newImg",function(user,img){
            that._displayImage(user, img);
        });
        this._initialEmoji();//图片创建
        document.getElementById('emoji').addEventListener('click', function(e) {
         var emojiwrapper = document.getElementById('emojiWrapper');
         emojiwrapper.style.display = 'block';
         e.stopPropagation();
     }, false);
        document.body.addEventListener('click', function(e) {
         var emojiwrapper = document.getElementById('emojiWrapper');
         if (e.target != emojiwrapper) {
             emojiwrapper.style.display = 'none';
         };
     });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
        //获取被点击的表情
        var target = e.target;
        if (target.nodeName.toLowerCase() == 'img') {
            var messageInput = document.getElementById('messageInput');
            messageInput.focus();
            messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
        };
    }, false);
       document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
      if (e.keyCode == 13) {
          var nickName = document.getElementById('nicknameInput').value;
          if (nickName.trim().length != 0) {
              that.socket.emit('login', nickName);
          };
      };
  }, false);
  document.getElementById('messageInput').addEventListener('keyup', function(e) {
      var messageInput = document.getElementById('messageInput'),
          msg = messageInput.value,
          color = document.getElementById('colorStyle').value;
      if (e.keyCode == 13 && msg.trim().length != 0) {
          messageInput.value = '';
          that.socket.emit('postMsg', msg, color);
          that._displayNewMsg('me', msg, color);
      };
  }, false);
    },
    //消息显示
    _displayNewMsg: function(user, msg, color) {
       var container = document.getElementById('historyMsg'),
       msgToDisplay = document.createElement('p'),
       date = new Date().toTimeString().substr(0, 8),
         //将消息中的表情转换为图片
         msg = this._showEmoji(msg);
         msgToDisplay.style.color = color || '#000';
         msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
         container.appendChild(msgToDisplay);
         container.scrollTop = container.scrollHeight;
     },
    //图片显示
    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('historyMsg'),
        msgToDisplay = document.createElement('p'),
        date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
     // 利用文档碎片存入表情
     _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiWrapper'),
        docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    //利用正则实现显示图片
    _showEmoji: function(msg) {
        var match, result = msg,
        reg = /\[emoji:\d+\]/g,
        emojiIndex,
        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');
            };
        };
        return result;
    }
};