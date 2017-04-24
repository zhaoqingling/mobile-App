/*
* author:zhaoql
* date:2017/4/24
* description:看你有多色
*/
$(function(){
	$('[name="color-start"] .btn-start').Color({
		longtime:60,//s秒
		isBegin:function(resultFn){
			// ajax返回的状态
			var status = {
					success:true
				};
			resultFn(status);
		},
		endFn:function(num){// 游戏结束时返回得分
			console.log(num);
		}
	});
});