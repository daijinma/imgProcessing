'use strict';

let  fs = require('fs') ;
let  path = require('path') ;
let  through2 = require('through2') ;
var  Jimp = require('Jimp');
let  vfs = require('vinyl-fs') ;



var  log = console.log;
module.exports = {
	crop:function(opt){
		let x1 = parseInt(opt.x1);
		let y1 = parseInt(opt.y1);
		let w = parseInt(opt.w);
		let h = parseInt(opt.h);
		var tempFile = path.resolve(process.cwd(), './temp');
		log('裁剪',opt,'\n')
		log('临时目录',tempFile,'\n')
		return through2.obj(function(file, encod, callback){
			var self = this;

			Jimp.read(file._path, function (err, image) {

				var name = path.basename(file._path);
			    var tempImage = path.resolve(tempFile, name)

			    //image.crop( x1, y1, w, h)
			    image.resize(250, 250)
			    .write(tempImage, function(){
			    	file.contents = fs.readFileSync(tempImage);
			    	self.push(file);
			    	callback();
			    }); 
			    
			    
			    

			    // .getBuffer(Jimp.AUTO, function(err, buffer){
			    // 	if(err){
			    // 		log(err);
			    // 		return;
			    // 	}
			    // 	log(image)
			    // 	file.contents = buffer;

			    	
			    // });

			}).catch(function (err) {
			    console.error(err);
			});


		})
	},
	resize:function(opt){
		// var w = parseInt(opt.width) || Jimp.AUTO;
		// var h = parseInt(opt.height) || Jimp.AUTO
		// var tempFile = path.resolve(process.cwd(), './temp');
		log('缩放',opt,'\n')
		return through2.obj(function(file, encod, callback){
			file.w = opt.width;
			file.h = opt.height;
			this.push(file);
			callback();

			// Jimp.read(file._path, function (err, image) {

			// 	var name = path.basename(file._path);
			//     var tempImage = path.resolve(tempFile, name)

			//     image.resize(w, h)
			//     .write(tempImage, function(){
			//     	vfs.src(tempImage)
			//     	.pipe(through2.obj(function(file2){
			    			
			//     	}))
			//     	// file.contents = fs.readFileSync(tempImage);
			//     	// log(file);
			    	
			//     	//fs.unlink(tempImage);
			    	
			//     }); 

			// }).catch(function (err) {
			//     console.error(err);
			// });


		})
	}

}