/*
* Author:zhaoql
* date:2017/4/24
* description:首页
*/
$(function(){

	ajaxLoad();
	/*加载数据源*/
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./index.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result1 = '';
					var result2 = '';
					var result3 = '';
					for(var i=0;i<dataSource.ProductList1.length;i++){
						result1 +='<li>'+
							'<a href="./shopping/detail.html">'+
								'<p class="pic"><img src="'+dataSource.ProductList1[i].route+'" /></p>'+
								'<p class="txt">'+dataSource.ProductList1[i].info+'</p>'+
								'<p class="total"><strong>'+dataSource.ProductList1[i].money+'</strong>积分</p>'+
							'</a>'+	
						'</li>';
					}
					result1 = '<section class="shop-bottom"><section class="shop-list"><ul>'+result1+'</ul></section></section>';
					    $('[line1]').append(result1);

					for(var i=0;i<dataSource.ProductList2.length;i++){
						result2 +='<li>'+
							'<a href="./shopping/detail.html">'+
								'<p class="pic"><img src="'+dataSource.ProductList2[i].route+'" /></p>'+
								'<p class="txt">'+dataSource.ProductList2[i].info+'</p>'+
								'<p class="total"><strong>'+dataSource.ProductList2[i].money+'</strong>积分</p>'+
							'</a>'+	
						'</li>';
					}
					result2 = '<section class="shop-bottom"><section class="shop-list"><ul>'+result2+'</ul></section></section>';
					    $('[line2]').append(result2);

					 for(var i=0;i<dataSource.ProductList3.length;i++){
						result3 +='<li>'+
							'<a href="./shopping/detail.html">'+
								'<p class="pic"><img src="'+dataSource.ProductList3[i].route+'" /></p>'+
								'<p class="txt">'+dataSource.ProductList3[i].info+'</p>'+
								'<p class="total"><strong>'+dataSource.ProductList3[i].money+'</strong>积分</p>'+
							'</a>'+	
						'</li>';
					}
					result3 = '<section class="shop-bottom"><section class="shop-list"><ul>'+result3+'</ul></section></section>';
					    $('[line3]').append(result3);   

					//调用页面js    
					page();
				}else{
					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.index').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
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
	
	//页面js
	function page(){
		/*banner 轮播图*/
		$('#slider').slider({
			speed:400,
			timeout:4000,
			auto:true,
			pager:'#slideNum'
		});

		/*打卡效果*/
		$(document).on('tap','[card]',function(){
			var _this =this;
			if(!$(_this).hasClass('disable')){
				$(_this).find('.add').css('display','block').animate({
					'top':'-1.8rem',
					'opacity':0
				},500,function(){
					$(_this).addClass('disable');
					$(_this).html('<i class="card"></i>已打卡</strong><span class="add">+2积分</span>');
				});
			}
		});
	}
});	