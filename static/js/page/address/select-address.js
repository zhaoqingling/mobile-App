/*
* Author:zhaoql
* date:2017/4/24
* description:选择收货地址页
*/
$(function(){

	ajaxLoad();
	/*加载数据源*/
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./select-address.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';
					for(var i=0;i<dataSource.addressList.length;i++){

						// state 为1 时 ，添加默认按钮 .为 0 时不添加
						if(dataSource.addressList[i].state == 1){
							result +='<li class="selected">'+
								'<span class="circle"><i></i></span>'+
								'<div class="group">'+
									'<p><span class="name">'+dataSource.addressList[i].name+'</span>'+
									'<span class="tel">'+dataSource.addressList[i].tel+'</span></p>'+
									'<p><span class="default">默认</span><span class="txt">'+dataSource.addressList[i].address+'</span></p>'+
								'</div>'+
								'<a href="./edit-address.html" class="icon-edit"></a>'+
							'</li>';
						}else{
							result +='<li>'+
								'<span class="circle"><i></i></span>'+
								'<div class="group">'+
									'<p><span class="name">'+dataSource.addressList[i].name+'</span>'+
									'<span class="tel">'+dataSource.addressList[i].tel+'</span></p>'+
									'<p><span class="txt">'+dataSource.addressList[i].address+'</span></p>'+
								'</div>'+
								'<a href="./edit-address.html" class="icon-edit"></a>'+
							'</li>';
						}
							
					}
					
					$('.address-list').append(result);
					page();
				}else{
					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.address-list').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
					timer = setTimeout(function(){
						$('.notice-txt').fadeOut(600,function(){
							$('.notice-txt').remove();
						});
						clearTimeout(timer);
					},1000);
				}
			},
			error:function(xhr,type){
				// 只有火狐允许读本地json 谷歌会报ajax error
				alert('Ajax error !')
			}
		});
	}
	function page(){
		/*点击地址进行选择效果*/
		$(document).on('tap','[select-address] ul li',function(){
			$(this).addClass('selected');
			$(this).siblings().removeClass('selected');
		});
	}
	
});