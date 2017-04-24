/*
* author:zhaoql
* date:2017/4/24
* description:商品详情页
*/
$(function(){

	/*从json中获取数据源*/
	ajaxLoad();

	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./detail.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';

					for(var i=0;i<dataSource.detailList.length;i++){
						result +='<section class="slider">'+
								'<section class="slider-img" id="slider" slider-img>'+
									'<ol>'+
										'<li><a href="javascript:;">'+
										'<img src="'+dataSource.detailList[i].route+'" />'+
										'</a></li>'+
										'<li><a href="javascript:;">'+
										'<img src="'+dataSource.detailList[i].route+'" />'+
										'</a></li>'+
										'<li><a href="javascript:;">'+
										'<img src="'+dataSource.detailList[i].route+'" />'+
										'</a></li>'+
										'<li><a href="javascript:;">'+
										'<img src="'+dataSource.detailList[i].route+'" />'+
										'</a></li>'+
									'</ol></section><ul class="slider-num" id="slideNum">'+
									'<li>1</li><li>2</li><li>3</li><li>4</li></ul>'+
							    '</section>'+
							   '<section class="money"><p class="seller-name">'+dataSource.detailList[i].name+'</p>'+
								'<p class="old"><span>原价：</span>'+
								'<span class="value">'+dataSource.detailList[i].oldPrice+'</span><span>市场价：</span>'+
								'<span class="value">￥<span>'+dataSource.detailList[i].price+'</span></span></p>'+
								'<p class="total-credit"><strong>'+dataSource.detailList[i].credit+'</strong>积分</p>'+
							'</section>'+
							'<section class="select-scale" select-scale>'+
								'<span class="tit">选择规格</span>'+
								'<p class="text">已选：<span class="value color">'+dataSource.detailList[i].color+'</span><span class="value lg">'+dataSource.detailList[i].large+'</span></p>'+
							'</section>'+
							'<section class="descript"><p class="tit">商品简介：</p>'+
								'<p class="txt1">'+dataSource.detailList[i].txt1+'</p>'+
								'<p class="txt1">'+dataSource.detailList[i].txt2+'</p>'+
								'<p class="txt1">'+dataSource.detailList[i].txt3+'</p>'+
								'<p class="tit">描述：</p>'+
								'<p class="txt1 value">'+dataSource.detailList[i].value+'</p>'+
								'<p class="tit">说明：</p>'+
								'<p class="txt1">'+dataSource.detailList[i].description+'</p>'+
							'</section>';
					}
					$('.detail').append(result);

					// 数据加载完成后调用页面的js完成相应效果
					page();
				}else{

					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.detail').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
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
	
	// 页面 js
	function page(){
		/*banner 轮播图*/
		$('#slider').slider({
			speed:400,
			timeout:4000,
			auto:true,
			pager:'#slideNum'
		});

		/*点击加入购物车*/
		$(document).on('tap','[add-cart]',function(){

			// 点击加入购物车清空上次点击数据
			$('[buy-dialog]').find('.select span').removeClass('active');
			$('[buy-dialog]').find('.num-box .num').text(1);
			$('[mask]').removeClass('undis');
			$('[buy-dialog]').slideDown();
			return false;
		});

		/*点击关闭弹窗按钮*/
		$(document).on('tap','[close]',function(){
			$('[mask]').addClass('undis');
			$('[buy-dialog]').slideUp();
			return false;
		});

		/*点击弹窗确定按钮*/
		var timer = '',
			timer1 = '';
		$(document).on('tap','[confirm]',function(){
			if(!$('[select-color]').find('span').hasClass('active') || !$('[select-lg]').find('span').hasClass('active')){

				$('body').append('<p class="notice-txt">颜色、大小请选择完整哦~~</p>');
				timer = setTimeout(function(){

					$('.notice-txt').fadeOut(600,function(){
						$('.notice-txt').remove();
						clearTimeout(timer);
					});
				},1000);
			}else{
				var color = $('[select-color]').find('span.active').text();
				var lg = $('[select-lg]').find('span.active').text();
				$(this).addClass('active');
				$('[mask]').addClass('undis');
				$('[buy-dialog]').slideUp();
				$('[select-scale]').find('.color').text(color);
				$('[select-scale]').find('.lg').text(lg);
				$('body').append('<p class="notice-txt">宝贝已在购物车等你了哦~~</p>');
				timer1 = setTimeout(function(){

					$('.notice-txt').fadeOut(600,function(){
						$('.notice-txt').remove();
						clearTimeout(timer1);
					});
				},1000);
			}
			return false;
		});

		/*弹窗中颜色大小选项*/
		$(document).on('tap','[buy-dialog] .product .select span',function(){

			$(this).addClass('active').siblings().removeClass('active');
			return false;
		});

		/*点击商品加减的数量*/
		$(document).on('tap','[buy-dialog] .num-box .minus',function(){
			if($(this).siblings('.num').text() >1){
				var text = parseInt($(this).siblings('.num').text())-1;
				$(this).siblings('.num').text(text);
			}
		});
		$(document).on('tap','[buy-dialog] .num-box .add',function(){
			
			var text = parseInt($(this).siblings('.num').text())+1;
			$(this).siblings('.num').text(text);
		});

		/*点击立即购买*/
		$(document).on('tap','[buy-now]',function(){
			if(!$('[confirm]').hasClass('active')){
				// 点击加入购物车清空上次点击数据
			    $('[buy-dialog]').find('.select span').removeClass('active');
			    $('[buy-dialog]').find('.num-box .num').text(1);
				$('[mask]').removeClass('undis');
				$('[buy-dialog]').slideDown();
			}else{
				window.location.href='./order-submit.html';
			}
		});
	}
});