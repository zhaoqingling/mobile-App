/*
* author:zhaoql
* date:2017/4/24
* description:拼图
*/
$(function(){
	/* 加入图片，运行代码 */	
	$('#imgArea').puzzle({
		readyPage:'#guide-page',  //进入游戏页面
		gamePage:'#game-page',  //开始游戏页面
		btnReady:'[name="btn-ready"]',  //进入游戏按钮
		btnStart:'[name="btn-start"]',  //开始游戏按钮
		time:'[name="time-box"] strong', //存储时间
		timeBar:'[name="time-progress"] .time-bar',  //存储时间
		startFn:function(callback){
			var status = {
					imgSrc:'../../static/img/puzzle.jpg',
					success:true
				};
			callback(status);
		},
		endFn:function(opt){
			var bln = opt.bln;
			
			var status = { // ajax返回值
					success:true
				};

			opt.callback(status);
		}
	});
});