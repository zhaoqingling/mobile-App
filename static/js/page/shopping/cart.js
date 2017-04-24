/*
* author:zhaoql
* date:2017/4/24
* description:购物车页
*/
$(function(){
	// 加载数据源
	ajaxLoad();
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./cart.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '',
						result1 ='';

					for(var i=0;i<dataSource.cartList.length;i++){
						if(dataSource.cartList[i].state ==1){
							//未失效的商品状态为 1

							result+='<section class="group">'+
								'<p class="tit"><span class="select"></span>'+dataSource.cartList[i].companyName+'</p>'+
								'<section class="info">'+
									'<span class="select"></span>'+
									'<a href="javascript:;">'+
										'<div class="list">'+
											'<p class="pic"><img src="'+dataSource.cartList[i].route+'" /></p>'+
											'<p class="descript">'+dataSource.cartList[i].info+'</p>'+
											'<p class="color"><span>颜色：</span>'+
											'<span class="value">'+dataSource.cartList[i].color+'</span>'+
											'<span>大小：</span><span>'+dataSource.cartList[i].size+'</span></p>'+
											'<p class="money"><strong>'+dataSource.cartList[i].money+'</strong>积分</p>'+
										'</div>'+
									'</a>'+
									'<div class="num-box">'+
										'<span class="minus">-</span>'+
										'<span class="num">1</span>'+
										'<span class="add">+</span>'+
									'</div>'+
									'<i class="delete"></i>'+
								'</section></section>';
						}else if(dataSource.cartList[i].state ==0){
							//失效的商品状态为 0

							result1 +='<section class="group">'+
									'<section class="info">'+
										'<span class="dis">失效</span>'+
										'<a href="javascript:;">'+
											'<div class="list">'+
												'<p class="pic"><img src="'+dataSource.cartList[i].route+'" /><span class="pro-mask"></span></p>'+
												'<p class="descript">'+dataSource.cartList[i].info+'</p>'+
												'<p class="txt">宝贝已不能购买</p>'+
											'</div>'+
										'</a>'+
										'<i class="delete"></i>'+
									'</section>'+
								'</section>';
						}
					}
					$('.product-cart .use').append(result);
					$('.product-cart .dis-use').append(result1);
					
					// 数据加载完成后调用页面的js完成相应效果
					page();
				}else{

					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.product-cart').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
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
		/*删除按钮*/
		var index =0;
		$(document).on('tap','.use .group .delete',function(){
			$('[mask]').removeClass('undis');
			$('[delete-dialog]').removeClass('undis');
			index = $(this).parents('.group').index();
			return false;
		});
		$(document).on('tap','.dis-use .group .delete',function(){
			$(this).parents('.group').remove();

			//当删除全部订单时跳转到无历史订单页面
			if(!$('.product-cart').find('.group').length>0){
				window.location.href='empty-cart.html';
			}
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
			$('.group').eq(index).find('.select').removeClass('active');
			$('.group').eq(index).remove();
			money();

			if(!$('.use').find('.group').length>0){
				$('[all-select]').removeClass('active');
			}
			//当删除全部订单时跳转到无历史订单页面
			if(!$('.product-cart').find('.group').length>0){
				window.location.href='empty-cart.html';
			}
			return false;
		});

		/*点击商家实现全选效果*/
		$(document).on('tap','.group .tit',function(){
			if(!$(this).find('.select').hasClass('active')){
				$(this).find('.select').addClass('active');
				$(this).siblings('.info').find('.select').addClass('active');
				yan();
				money();
			}else{
				$('[all-select]').removeClass('active');
				$(this).find('.select').removeClass('active');
				$(this).siblings('.info').find('.select').removeClass('active');
				yan();
				money();
			}
			return false;
		});

		$(document).on('tap','.group .info .select',function(){
			if(!$(this).hasClass('active')){
				$(this).addClass('active');
				$(this).parent('.info').siblings('.tit').find('.select').addClass('active');
				yan();
				money();
			}else{
				$('[all-select]').removeClass('active');
				$(this).removeClass('active');
				$(this).parent('.info').siblings('.tit').find('.select').removeClass('active');
				yan();
				money();
			}
			return false;
		});

		/*点击全选*/
		$(document).on('tap','[all-select]',function(){
			var _this = this;
			if(!$(_this).hasClass('active')){
				$(_this).addClass('active');
				$('.use .group').each(function(){
					$(this).find('.select').addClass('active');
				});
				money();
			}else{
				$(_this).removeClass('active');
				$('.use .group').each(function(){
					$(this).find('.select').removeClass('active');
				});
				money();
			}
			
		});

		/*点击商品所有都选中，底部全选会被选中*/
		function yan(){
			var flag = [];
			var orderLength =$('.use .group').length;
			$('.use .group').each(function(){
				if($(this).find('.tit .select').hasClass('active')){
					var index = $(this).index();
					flag.push(index);
				}
				if(flag.length == orderLength){
					$('[all-select]').addClass('active');
				}else{
					$('[all-select]').removeClass('active');
				}
			});
		}

		/*点击商品加减的数量*/
		$(document).on('tap','.use .group .num-box .minus',function(){
			if($(this).siblings('.num').text() >1){
				var text = parseInt($(this).siblings('.num').text())-1;
				$(this).siblings('.num').text(text);
			}
			money();
		});
		$(document).on('tap','.use .group .num-box .add',function(){
			
			var text = parseInt($(this).siblings('.num').text())+1;
			$(this).siblings('.num').text(text);
			money();
		});

		/*计算总金额*/
		function money(){
			var total = 0;
			$('.use .group .info').each(function(){
				if($(this).find('.select').hasClass('active')){
					var num = parseInt($(this).find('.num-box .num').text());
					var price = parseInt($(this).find('.list .money strong').text());
					total += num * price ;
				}
			});
			var total1 = parseInt($('.product-cart .total strong').text());

			// 如果所购东西的积分超过现有积分则所有选中商品将不在选中并提示
			if(total > total1){
				var timer = ''
				$('body').append('<p class="notice-txt">积分不足，清空所选商品</p>');
				timer = setTimeout(function(){
					$('.notice-txt').fadeOut(600,function(){
						$('.notice-txt').remove();
						$('.use .group').each(function(){
							$(this).find('.select').removeClass('active');
							$(this).find('.num-box .num').text(1);
							$('[all-select]').removeClass('active');
							$('[money]').text(0);
						});
						clearTimeout(timer);
					});

				},1000);
			}else{
				$('[money]').text(total);
			}
		}
		
		/*点击去结算按钮 如果没有选中任何商品 则不跳转*/
		$(document).on('tap','[submit-order]',function(){
			if($('[money]').text() == '0'){
				var timer1 = ''
				$('body').append('<p class="notice-txt">您还没选择任何商品~~</p>');
				timer1 = setTimeout(function(){
					$('.notice-txt').fadeOut(600,function(){
						$('.notice-txt').remove();
						clearTimeout(timer1);
					});
				},1000);
			}else{
				window.location.href="./order-submit.html";
			}
		});
	}

});	