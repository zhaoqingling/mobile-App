/*
* Author:zhaoql
* date:2017/4/24
* description:个人中心页
*/
$(function(){
	
	/*退出登录弹窗*/
	$(document).on('tap','[exit]',function(){
		$('[mask]').removeClass('undis');
		$('[exit-dialog]').removeClass('undis');
		return false;
	});

	$(document).on('tap','[cancel-btn]',function(){
		$('[mask]').addClass('undis');
		$('[exit-dialog]').addClass('undis');
		return false;
	});
	
});