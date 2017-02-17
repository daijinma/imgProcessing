let  through2 = require('through2') ;
let  path = require('path') ;

module.exports = function(opt){
	var reg = opt.reg;
	return through2.obj(function(file, enc, callback){
		file._path = file.path;
		var _path_ = file.path;
		var dir = path.dirname(_path_);
		var extname = path.extname(_path_);
		var basename = path.basename(_path_);
		console.log('---------------')
		if(reg){
			// 提取第一位数字
			var num = basename.match(/\d/)[0];
			file.newName = reg.replace('$1',num)+extname;
			console.log(basename, '>>', file.newName)
		}

		this.push(file);
		callback();
	})
}