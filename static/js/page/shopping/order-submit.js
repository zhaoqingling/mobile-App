/*
* author:zhaoql
* date:2017/4/24
* description:订单提交页
*/
$(function(){


	/*从json中获取数据源*/
	ajaxLoad();
	
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./order-submit.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';

					for(var i=0;i<dataSource.productList.length;i++){
						result +='<section class="product-order">'+
									'<h3 class="tit">'+dataSource.productList[i].name+'</h3>'+
								'<section class="con">'+
									'<section class="pic">'+
									'<img src="'+dataSource.productList[i].route+'" />'+
									'</section>'+
									'<p class="info">'+dataSource.productList[i].info+'</p>'+
									'<p class="color"><span>颜色：</span>'+
									'<span class="value">'+dataSource.productList[i].color+'</span><span>大小：</span>'+
									'<span>'+dataSource.productList[i].size+'</span></p>'+
									'<p class="count">'+
										'<span class="money"><strong>'+dataSource.productList[i].money+'</strong>积分</span>'+
										'<span class="num"> x <strong>'+dataSource.productList[i].num+'</strong></span></p>'+
								'</section>'+
								'<p class="method">'+
									'<span class="key">配送方式</span>'+
									'<span class="value">快递：<strong>'+dataSource.productList[i].post+'</strong></span>'+
								'</p>'+
								'<p class="back"><input type="text" placeholder="请填写订单备注" /></p>'+
								'<p class="total">'+
									'<span class="num-count">共<strong>'+dataSource.productList[i].account+'</strong>件商品</span>'+
									'<span>商家合计：<strong class="money">0</strong>积分</span>'+
								'</p>'+
							'</section>';
					}
					$('.order-submit').append(result);

					// 数据加载完成后调用页面的js完成相应效果
					page();
				}else{

					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='',
						timer1='';
					$('.order-submit').append('<p class="notice-txt">信息读取失败，请重新返回重新提交~~</p>');
					timer = setTimeout(function(){
						$('.notice-txt').fadeOut(600,function(){
							$('.notice-txt').remove();
						});
						clearTimeout(timer);
					},1000);
					timer1 = setTimeout(function(){
						clearTimeout(timer1);
						window.location.href="./submit-fail.html";
					},2000);
				} 
			},
			error:function(xhr,type){
				// 只有火狐允许读本地json 谷歌会报ajax error
				alert('Ajax error !')
			}
		});
	}

	/*页面中的js*/
	function page(){

		/*计算单个订单 积分+快递金额*/
		var money2 = 0;
		$('.product-order').each(function(){
			var m1 = $(this).find('.count .money strong').text();
			var m2 = $(this).find('.count .num strong').text();
			var m3 = $(this).find('.method .value strong').text();
			if(m3 == ''){
				m3 = 0;
			}
			money2 = m1 * m2 + parseFloat(m3);
			$(this).find('.total .money').text(money2);
		});

		/*计算页面订单总数 及总金额*/
		
		var index =0,
			money =0;
		$('.product-order').each(function(){
			index ++;
			money += parseFloat($(this).find('.total .money').text());
		});
		$('[num]').text(index);
		$('[money]').text(money);

		/*点击提交订单 支付密码弹窗*/
		$(document).on('tap','[submit-order]',function(){
			$('[password]').val('');
			$('[password]').attr('type','password');
			$('[eye]').removeClass('eye');
			$('[mask]').removeClass('undis');
			$('[submit-dialog]').removeClass('undis');
		});

		/*点击取消及确定按钮*/
		$(document).on('tap','[cancel-btn]',function(){
			$('[mask]').addClass('undis');
			$('[submit-dialog]').addClass('undis');
			return false;
		});

		/*弹窗中支付效果*/
		$(document).on({
			focus:function(){
				$(this).addClass('focus');
			},
			blur:function(){
				$(this).removeClass('focus');
			}
		},'[password]');
		
		/*眼睛效果*/
		$(document).on('tap','[eye]',function(){
			if(!$(this).hasClass('eye')){
				$(this).addClass('eye');
				$('[password]').attr('type','text');
			}else{
				$(this).removeClass('eye');
				$('[password]').attr('type','password');
			}
		});

		/*点击确定 支付成功 1.5s后则页面跳转到提交成功页面*/

		/*这里仅对支付密码为空 和 不为空进行校验 后期开发可更改*/
		var timer ='',
			timer1 ='';
		$(document).on('tap','[confirm-btn]',function(){
			$('[mask]').addClass('undis');
			$('[submit-dialog]').addClass('undis');
			var password = $('[password]').val();
			if(password != ''){
				$('body').append('<p class="notice-txt">支付成功~~~</p>');
				timer1 =setTimeout(function(){
					$('.notice-txt').fadeOut(600,function(){
						$('.notice-txt').remove();
						clearTimeout(timer1);
					});
				},800);
				timer = setTimeout(function(){
					
					clearTimeout(timer);
					window.location.href='./submit-success.html';
				},1500);
			}else{
				$('body').append('<p class="notice-txt">支付失败~~~</p>');
				timer1 =setTimeout(function(){
					$('.notice-txt').fadeOut(600,function(){
						$('.notice-txt').remove();
						clearTimeout(timer1);
					});
				},800);
				timer = setTimeout(function(){
					
					clearTimeout(timer);
					window.location.href='./submit-fail.html';
				},1500);
			}
		});
	}
	
});