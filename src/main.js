var ipc = require('electron').ipcRenderer;
var remote = require('electron').remote;
var dialog = remote.dialog;
var vm = new Vue({
	el:'#app',
	data:{
		originFiles:[
			'D:\\daijnma\\test\\Electron\\imgElectron\\test\\主播@2\\1.png',
		],
		doActionArray:{
			do:[
				{
					method:'rename',
					reg:''
				},
				{
					method:'jcrop',
					data:'',
				}
			],
			dist:''
		},
		rename:'new_$1',
		useNumber:true,
		resizeW: '',
		resizeH: '',

	},
	methods:{
		openFile:function(){
			var self = this;
			dialog.showOpenDialog({
				properties: ['openFile', 'multiSelections'],
				filters: [
					{name: 'Images', extensions: ['jpg', 'png']},
				]
			}, function(optional){
				self.originFiles.concat(optional);
				optional.forEach(function(item, index){
					if(!self.originFiles.includes(item)){
						self.originFiles.push(item);
					}
				})
			})

		},
		distFile:function(){
			var self= this;
			var title = '导出地址';
			dialog.showOpenDialog({
				title:title,
				properties: ['openDirectory', 'createDirectory'],
				filters: [
					{name: 'Images', extensions: ['jpg', 'png']},
				]
			}, function(optional){
				var oldPath = self.$refs.outPutPath.innerHTML;
				self.$refs.outPutPath.innerHTML = optional?optional:oldPath;
				self.doActionArray.dist = optional?optional:'./';
			})

		},
		delFile: function(index){
			this.originFiles.splice(index,1);
		},
		openJcrop: function(){

			dialog.showOpenDialog({
				properties: ['openFile'],
				filters: [
					{name: 'Images', extensions: ['jpg', 'png']},
				]
			}, function(optional){

				
				ipc.send('jcropShow', optional[0]);

				// self.originFiles.concat(optional);

			})

			
		},
		doControll:function(){
			// 重命名
			this.doActionArray.do[0].reg = this.rename || '';

			this.doActionArray.do.push({
				method:'resize',
				value:this.resizeW+","+this.resizeH,
			})

			originFiles = JSON.stringify(this.originFiles);
			doActionArray = JSON.stringify(this.doActionArray);
			ipc.send('docontroll', '['+originFiles+','+doActionArray+']');
		}
	}
});

openClip = function(){
	ipc.send('jcropShow', this.originFiles[0]);
}