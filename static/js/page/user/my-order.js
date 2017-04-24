/*
* Author:zhaoql
* date:2017/4/24
* description:我的订单页
*/
$(function(){

	// 点击页面图片以及文字信息可进入订单详情页面查看具体信息
    ajaxLoad();
	/*加载数据源*/
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./my-order.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';
					for(var i=0;i<dataSource.orderList.length;i++){

						// 当状态为1 时表示已收货
					    if(dataSource.orderList[i].state==1){
							result +='<section class="group">'+
								'<p class="order-tit"><span class="name">'+dataSource.orderList[i].companyName+'</span>'+
								'<span class="state">'+dataSource.orderList[i].orderState+'</span></p>'+
								'<a href="./order-detail.html">'+
								'<section class="order-info">'+
									'<p class="pic"><img src="'+dataSource.orderList[i].route+'" /></p>'+
									'<p class="info">'+dataSource.orderList[i].info+'</p>'+	
								'</section>'+
								'</a>'+
								'<p class="real-money">'+
								'<span class="money">实付款：<strong>'+dataSource.orderList[i].realMoney+'</strong>'+
								'<span class="score">积分</span></span><i class="delete"></i></p></section>';
						}else if(dataSource.orderList[i].state==0){

							//state == 0 代表 待收货
							result +='<section class="group">'+
								'<p class="order-tit"><span class="name">'+dataSource.orderList[i].companyName+'</span>'+
								'<span class="state unfinish">'+dataSource.orderList[i].orderState+'</span></p>'+
								'<a href="./order-detail.html">'+
								'<section class="order-info">'+
									'<p class="pic"><img src="'+dataSource.orderList[i].route+'" /></p>'+
									'<p class="info">'+dataSource.orderList[i].info+'</p>'+	
								'</section>'+
								'</a>'+
								'<p class="real-money">'+
								'<span class="money">实付款：<strong>'+dataSource.orderList[i].realMoney+'</strong>'+
								'<span class="score">积分</span></span><i class="delete"></i></p></section>';
						}
					}
					
					$('.my-order').append(result);

					//加载页面js 
					page();
				}else{
					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.my-order').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
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
		/*删除图标为待发货时不显示*/
		$('.group').each(function(){

			if($(this).find('.state').hasClass('unfinish')){
				$(this).find('.delete').css('display','none');
			}
		});

		/*点击删除图标弹框*/
		var index =0;
		$(document).on('tap','.delete',function(){
			$('[mask]').removeClass('undis');
			$('[delete-dialog]').removeClass('undis');
			index = $(this).parents('.group').index();
			return false;
		});

		$(document).on('tap','[cancel-btn]',function(){
			$('[mask]').addClass('undis');
			$('[delete-dialog]').addClass('undis');
			return false;
		});

		/*点击确定按钮是*/
		$(document).on('tap','[confirm-btn]',function(){
			$('[mask]').addClass('undis');
			$('[delete-dialog]').addClass('undis');
			$('.group').eq(index).remove();

			//当删除全部订单时跳转到无历史订单页面
			if(!$('.my-order').find('.group').length>0){
				window.location.href='no-order.html';
			}
			return false;
		});
	}

});