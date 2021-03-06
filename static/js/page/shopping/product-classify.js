/*
* author:zhaoql
* date:2017/4/24
* description:商品分类页
*/
$(function(){

	// Ajax 加载数据
	ajaxLoad();
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./product-classify.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result1 = '';
					var result2 = '';
					var result3 = '';
					var result4 = '';
					// 添加左侧的菜单栏
					for(var i=0;i<dataSource.productListLeft.length;i++){
						result1 +='<li>'+dataSource.productListLeft[i].title+'</li>';
					}

					$('[sidebar-box] ul').append(result1);
					$('[sidebar-box] ul li').eq(0).addClass('active');

					//添加右侧区域商品栏
					for(var j=0;j<dataSource.productRight.length;j++){
						result2='';
						result3 ='';
						result2 ='<h4 class="tit">'+dataSource.productRight[j].tit+'</h4>';
						for(var m=0;m<dataSource.productRight[j].list.length;m++){

							result3 +='<li><a href="./detail.html"><p class="pic">'+
							'<img src="'+dataSource.productRight[j].list[m].route+'" /></p>'+
						'<p class="txt">'+dataSource.productRight[j].list[m].info+'</p>'+
						'<p class="total"><strong>'+dataSource.productRight[j].list[m].money+'</strong>积分</p></a>'+
					'</li>';
						}
					    result4 += '<section class="product-list">'+result2+'<ul>'+result3+'</section></ul>';
					   
					}
					$('[product-box]').append(result4);
					 
					// 数据加载完成后调用页面的js完成相应效果
					page();

				}else{
					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
						
					$('.product-classify').append('<p class="notice-txt">信息读取失败，请重新返回~~</p>');
					timer = setTimeout(function(){
						$('.notice-txt').fadeOut(600,function(){
							$('.notice-txt').remove();
						});
						clearTimeout(timer);
					},1000);
				}

			},
			error:function(){
				// 只有火狐允许读本地json 谷歌会报ajax error
				alert('Ajax error !')
			}
		});
	}

	//页面js
	function page(){
		/*右侧滑动效果*/
		$(window).on('scroll',function(){

			wintop = $(window).scrollTop();
			$('[product-box] .product-list').each(function(){

				var index = $(this).index(),
					top = $(this).offset().top -100,
					bottom = top + $(this).height();
				if(top< wintop && wintop <bottom){
					$('[sidebar-box] ul li').eq(index).addClass('active').siblings().removeClass('active');
				}	
			});
			return false;
		}).scroll();

		/*点击左侧的分类栏目*/
		$(document).on('tap','[sidebar-box] ul li',function(){
			$(this).addClass('active').siblings().removeClass('active');
			var index = $(this).index();
			var top = $('[product-box] .product-list').eq(index).offset().top -60;
			$('html,body').scrollTop(top);
			return false;
		});
		}

});