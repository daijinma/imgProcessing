let  through2 = require('through2') ;
let  path = require('path') ;
var  Jimp = require('Jimp');


module.exports = function(output){
	return through2.obj(function(file, enc, callback){
		Jimp.read(file.contents, function (err, image) {
			var name = path.basename(file._path);
			var out = path.resolve(output,'./'+file.newName);
			if(file.w || file.h){
				var w = parseInt(file.w) || Jimp.AUTO;
				var h = parseInt(file.h) || Jimp.AUTO;

				image = image.resize(w, h)
				

			}


			image.write(out, function(){
				console.log('done:', out)
			});
		})
		this.push(file);
		callback();
	})
}


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
