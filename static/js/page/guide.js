/*
* Author:zhaoql
* date:2017/4/24
* description:引导页
*/
$(function(){

	/*3s后跳转*/
	var timer ='';
	timer = setInterval(function(){

		var txt = parseInt($('.time strong').text());
		txt --;
		$('.time strong').text(txt);
		if(txt<=0){
			clearInterval(timer);
			window.location.href='./index.html';
		}
	},1000);
});	