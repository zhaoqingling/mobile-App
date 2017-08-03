/*
* Author:zhaoql
* date:2017/4/24
* description:登录页
*/
$(function(){

	/*删除手机号码效果*/
	$(document).on('keyup','[input-num]',function(){
		var txt = $(this).val();
		if(txt != ''){
			$(this).siblings('.delete').css('display','block');
		}else{
			$(this).siblings('.delete').css('display','none');
		}
	});

	$(document).on('tap','.delete',function(){
		$(this).siblings('input').val('');
		$(this).css('display','none');
	});

	/*眼睛效果*/
	$(document).on('tap','[eye]',function(){
		if(!$(this).hasClass('eye')){
			$(this).addClass('eye');
			$(this).siblings('input').attr('type','text');
		}else{
			$(this).removeClass('eye');
			$(this).siblings('input').attr('type','password');
		}
	});

	/*登录效果*/
	var timer = '';
	$(document).on('tap','[btn-sign]',function(){
		$('.notice-txt').remove();
		clearTimeout(timer);
		var txt = $('[input-num]').val(),
			txt1 = $('[input-password]').val();
		if(txt == '' || txt1 == ''){
			$('body').append('<p class="notice-txt">请输入正确的手机号码或服务密码</p>');
			timer = setTimeout(function(){

				$('.notice-txt').fadeOut(600,function(){
					$('.notice-txt').remove();
					clearTimeout(timer);
				});
			},1000);
		}else{
			window.location.href="../guide.html";
		}	
	});

	var url ='http://192.168.1.100:8080/Shopping/Online';
	$(document).on('tap','[btn-sign]',function(){
		var user = $('[input-num]').val();
		var password = $('[input-password]').val();
		var json = {
				servCode : "user",
				busiCode : "login",
				data : {
					"user" : "",
					"password" :"" 
				}
			};
		$.ajax({
			url : url,
			data : JSON.stringify(json),
			contentType : "application/json; charset=utf-8",
			type : "POST",
			dataType : "json",
			success : function(data) {
				if(data.code == 1){
					//console.log(data);
					alert(JSON.stringify(data));
					localStorage.setItem("dataSource",data.data);
					window.location.href="../guide.html";
				}else{
					alert('登录失败');
				}
			},
			error : function(data) {
				alert('登录失败');
			}
		});
	});
});