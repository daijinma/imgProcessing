'use strict';

let  fs = require('fs') ;
let  path = require('path') ;
let  through2 = require('through2') ;
let  vfs = require('vinyl-fs') ;
let  files = [];
var  rename = require('./rename.js');
var  sharp = require('./sharp.js');
var  dest = require('./dest.js');



var  log = console.log;
module.exports = function(arg){
	arg = JSON.parse(arg);
	files =  arg[0];
	var result = arg[1];
	var outPath = result.dist;
	var doAction = result.do;
	var AUTO_VAR = result.auto;

	if('[object Array]' === Object.prototype.toString.call(outPath)){
		outPath = outPath[0];
	};

	if(!outPath){
		outPath = path.resolve(path.dirname(files[0]), './output');
	};

	log('导出目录：', outPath);

	var conFiles = vfs.src(files,{
		base: outPath
	})

	if(doAction && doAction.length){
		while(doAction.length){
			var nowAction = doAction.shift();
			if(nowAction.method=='rename' && nowAction.reg){
				// var name = reg.
				process.stdout.write('rename'+'\n')
				conFiles.pipe(rename({
					reg:nowAction.reg
				}))
				.on('finish', function(){
					process.stdout.write('rename done'+'\n')
				})
			}

			if(nowAction.method=='jcrop'){
				if(global.sharedObject.jcrop){
					var coordinate = global.sharedObject.jcrop.value;
					if(coordinate){
						process.stdout.write('jcrop'+'\n')
						conFiles.pipe(sharp.crop(coordinate))
						.on('finish', function(){
							process.stdout.write('jcrop done'+'\n')
						})	
					}
					

				}
				
			}

			if(nowAction.method=='resize'){
				
				var value = ''+nowAction.value;
				value = value.split(',');
				process.stdout.write('resize'+'\n')
				conFiles.pipe(sharp.resize({
					width:value[0],
					height:value[1]
				}))
				.on('finish', function(){
					process.stdout.write('resize done'+'\n')
				})
				
			}
		}
	}

	conFiles.pipe(dest(outPath));

	// conFiles.pipe(vfs.dest(function(file){
	// 	var name = path.basename(file.path);
	// 	file.path = path.resolve(outPath, './'+(file.newName || name));
	// 	return file.path;
	// },{
	// 	base: function(file){
	// 		var dirpath = path.dirname(file.path);
	// 		log(dirpath);
	// 		return dirpath;
	// 	}
	// }))
	// .on('finish', function(){
	// 	process.stdout.write('done'+'\n')
	// });

}
