/*
* Author:zhaoql
* date:2017/4/24
* description:订单详情页
*/
$(function(){

	ajaxLoad();
	/*加载数据源*/
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./order-detail.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';
					for(var i=0;i<dataSource.orderListInfo.length;i++){

						result +='<section class="order-info">'+
							'<section class="group">'+
								'<p class="txt">'+dataSource.orderListInfo[i].orderState+'</p>'+
								'<p class="txt"><span>订单号：</span><span>'+dataSource.orderListInfo[i].orderNumber+'</span></p>'+
							'</section>'+
							'<section class="group">'+
								'<p class="txt"><span>快递公司：</span><span>'+dataSource.orderListInfo[i].postCompany+'</span></p>'+
								'<p class="txt"><span>快递单号：</span><span>'+dataSource.orderListInfo[i].postNum+'</span></p>'+
							'</section></section>'+
						'<section class="address">'+
							'<p class="user">'+
								'<span class="name">'+dataSource.orderListInfo[i].name+'</span>'+
								'<span class="tel">'+dataSource.orderListInfo[i].tel+'</span>'+
							'</p>'+
							'<p class="user-address">'+dataSource.orderListInfo[i].address+'</p>'+
							'<i class="icon-top"></i><i class="icon-bottom"></i>'+
						'</section>'+
						'<section class="product-order">'+
							'<h3 class="tit">'+dataSource.orderListInfo[i].companyName+'</h3>'+
							'<section class="con">'+
								'<section class="pic"><img src="'+dataSource.orderListInfo[i].route+'" /></section>'+
								'<p class="info">'+dataSource.orderListInfo[i].info+'</p>'+
								'<p class="color"><span>颜色：</span>'+
								'<span class="value">'+dataSource.orderListInfo[i].color+'</span><span>大小：</span>'+
								'<span>'+dataSource.orderListInfo[i].size+'</span></p>'+
								'<p class="count">'+
									'<span class="money"><strong>'+dataSource.orderListInfo[i].money+'</strong>积分</span>'+
									'<span class="num"> x <strong>'+dataSource.orderListInfo[i].num+'</strong></span>'+
								'</p>'+
							'</section>'+
							'<p class="back"><span class="back-tit">订单备注</span>'+
							'<span class="back-con">'+dataSource.orderListInfo[i].orderBack+'</span></p>'+
						'</section>'+
						'<section class="info-list">'+
							'<p class="txt"><span class="key">配送方式</span>'+
							'<span class="value">'+dataSource.orderListInfo[i].postMethod+'</span></p>'+
							'<p class="txt"><span class="key">运费</span>'+
							'<span class="value" post>'+dataSource.orderListInfo[i].post+'</span></p>'+
							'<p class="text"><span class="key">实付款</span>'+
							'<span class="value" real><strong>0</strong>积分</span></p>'+
						'</section>';		
					}
					
					$('.order-detail').prepend(result);
					page();
				}else{
					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.order-detail').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
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

		/*计算实付款金额*/
		var txt = parseFloat($('.money strong').text());
		var num = parseInt($('.num strong').text());
		var money ='';
		var post = parseFloat($('[post]').text());
		money = txt*num + post;
		$('[real]').find('strong').text(money);
	}
});	