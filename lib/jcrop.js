const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;

let sizeOf = require('image-size');
let fs = require('fs');
let path = require('path');
let  through2 = require('through2') ;


module.exports = function(){


	var jcropWindow = null;

	ipc.on('jcropShow', (event, img)=>{

		console.log('裁剪图片：', img);
		var type = path.extname(img).replace('.','image/')

		let size = sizeOf(img);
		size.swidth = size.width<500?'500':size.width;
		size.sheight = size.height<500?'500':size.height;


		// 处理响应，组合base64图片
		fs.readFile(img, 'binary', function(err, data){
			if(err){
				console.log(err);
				return;
			}
			prefix = "data:" + type + ";base64,";
			base64 = new Buffer(data, 'binary').toString('base64');

			jcropWindow = newWin(size,prefix + base64);

			jcropWindow.show();
		});

		

		


		
	})


	ipc.on('jcropHide', (event, arg)=>{
		jcropWindow.hide();
		var data = {};
		if(arg){
			data = JSON.parse(arg);
		}

		var buf = new Buffer(data.base64.split(';base64,')[1], 'base64')
		console.log(data.base64.split(';base64,')[1])
		fs.writeFile(data.url, buf, function(){
			console.log('1111111111111111111111');
		})
		
		
	})

	let newWin = (opts, base64)=>{
		global.sharedObject = {
			jcrop:{
				width:opts.width,
				height:opts.height,
				img:base64
			}
		};

		let jcropWindow = new BrowserWindow({
		    width: opts.swidth, 
		    height: (opts.sheight+opts.height),
		    frame: true,
		    show: false,
		    resizable:false
		});

		jcropWindow.ccc = '555';

		jcropWindow.loadURL(path.resolve(__dirname , '../src/jcrop.html')) //新窗口

		// 当 window 被关闭，这个事件会被发出
	    jcropWindow.on('closed', function() {
		    jcropWindow = null;
	    });
	    return jcropWindow
	}

}