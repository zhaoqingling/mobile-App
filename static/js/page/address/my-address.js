/*
* Author:zhaoql
* date:2017/4/24
* description:我的收货地址页
*/
$(function(){

	/*加载数据源*/
	ajaxLoad();
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./my-address.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';
					for(var i=0;i<dataSource.addressList.length;i++){

						// state 为1 时 ，添加默认按钮 为 0 时不添加
						if(dataSource.addressList[i].state == 1){
							result +='<li>'+
								'<div class="group">'+
									'<p><span class="name">'+dataSource.addressList[i].name+'</span>'+
									'<span class="tel">'+dataSource.addressList[i].tel+'</span></p>'+
									'<p><span class="default">默认</span>'+
									'<span class="txt">'+dataSource.addressList[i].address+'</span></p>'+
								'</div>'+
								'<a href="./edit-address.html" class="icon-edit"></a>'+
							'</li>';
						}else{
							result +='<li>'+
								'<div class="group">'+
									'<p><span class="name">'+dataSource.addressList[i].name+'</span>'+
									'<span class="tel">'+dataSource.addressList[i].tel+'</span></p>'+
									'<p>'+
									'<span class="txt">'+dataSource.addressList[i].address+'</span></p>'+
								'</div>'+
								'<a href="./edit-address.html" class="icon-edit"></a>'+
							'</li>';
						}
							
					}
					
					$('.address-list').append(result);
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

	$(document).on({

		touchstart:function(){
			//active点击
		}	
	},'[back]');	
});