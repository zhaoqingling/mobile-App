/*
* author:zhaoql
* date:2017/4/24
* description:抢购页
*/
$(function(){
 	
	/*从json中获取数据源*/
	ajaxLoad();
	
	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./my-timeshop.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';
					var result1 = '';

					//添加底部的商家特卖下的商品内容
					for(var i=0;i<dataSource.productList.length;i++){
						result +='<li>'+
						'<a href="./detail.html">'+
							'<p class="pic"><img src="'+dataSource.productList[i].route+'" /></p>'+
							'<p class="txt">'+dataSource.productList[i].info+'</p>'+
							'<p class="total"><strong>'+dataSource.productList[i].money+'</strong>积分</p>'+
						'</a>'+	
						'<p class="btn"><a href="javascript:;">加入购物车</a></p>'+
					'</li>';
					}
					result = '<section class="shop-list"><ul>'+result+'</ul></section>';
					$('.time-shop .shop-bottom').append(result);

					//添加上面的时间抢购商品
					for(var j=0;j<dataSource.productTimeList.length;j++){
						result1 +='<li>'+
						'<a href="./detail.html">'+
							'<p class="pic"><img src="'+dataSource.productTimeList[j].route+'" /></p>'+
							'<p class="txt">'+dataSource.productTimeList[j].info+'</p>'+
							'<p class="total"><strong>'+dataSource.productTimeList[j].money+'</strong>积分</p>'+
							'<p class="price">原价：'+dataSource.productTimeList[j].price+'积分</p>'+
							'<p class="time" id="'+dataSource.productTimeList[j].idValue+'" data="'+dataSource.productTimeList[j].dataValue+'" ><span>0</span>天<span>0</span>时<span>0</span>分<span>0</span>秒</p>'+
						'</a>'+
						'<p class="btn"><a href="javascript:;">加入购物车</a></p>'+
					'</li>';
					}
					result1 = '<section class="shop-list"><ul>'+result1+'</ul></section>';
					$('.time-shop .shop-top').append(result1);

					// 数据加载完成后调用页面的js完成相应效果
					page();
				}else{

					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
						
					$('.time-shop').append('<p class="notice-txt">信息读取失败，请重新返回~~</p>');
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
		// 左侧第一个商品到期时间 
		var s1 = "2017/5/28,15:52:00";
		var s2 = hxtime; 

		// 左侧第二个商品到期时间 
		var s3 = "2017/2/23,21:49:00";
		var s4 = hxtime1; 

		// 左侧第三个商品到期时间 
		var s5 = "2017/5/23,21:49:39";
		var s6 = hxtime2;

		// 左侧第四个商品到期时间 
		var s7 = "2017/2/23,21:49:00";
		var s8 = hxtime3;

		var timer1 = '';
		timer1 =setInterval(function(){
			ShowTimes(s1,s2);
		},1000);

		var timer2 = '';
		timer2 =setInterval(function(){
			ShowTimes(s3,s4);
		},1000);

		var timer3 = '';
		timer3 =setInterval(function(){
			ShowTimes(s5,s6);
		},1000);

		var timer4 = '';
		timer4 =setInterval(function(){
			ShowTimes(s7,s8);
		},1000);

		function ShowTimes(s1,s2){  
			var endtime=new Date(s1); 
			var nowtime = new Date(); 
			LeaveTime=endtime-nowtime;
			LeaveDays=Math.floor(LeaveTime/(1000*60*60*24));//天
			LeaveHours=Math.floor(LeaveTime/(1000*60*60)%24);//时 
			LeaveMinutes=Math.floor(LeaveTime/(1000*60)%60);//分
			LeaveSeconds=Math.floor(LeaveTime/1000%60);//秒

			if(LeaveTime<0){
				s2.innerHTML="<span>"+0+"</span>天<span>"+0+"</span>时<span>"+0+"</span>分<span>"+0+"</span>秒";
				var ss = '#'+s2.id;
				$(ss).parent().siblings('.btn').addClass('disable');
				var ss1 = 'timer' + s2.data;
				clearInterval(ss1);//结束循环
			}else{
			  	$(ss).parent().siblings('.btn').removeClass('disable');
				s2.innerHTML="<font color=red>"+LeaveDays+"</font>天<font color=red>"+LeaveHours+"</font>时<font color=red>"+LeaveMinutes+"</font>分<font color=red>"+LeaveSeconds+"</font>秒";  
			}
		} 

		/*点击底下商家特卖加入购物车提示效果*/
		var navTimer = '';
		$(document).on('tap','.shop-bottom .btn a',function(){

			$('.notice-txt').remove();
			clearTimeout(navTimer);
			$('body').append('<p class="notice-txt">商品成功加入购物车~~</p>');
			navTimer = setTimeout(function(){

				$('.notice-txt').fadeOut(600,function(){
					$('.notice-txt').remove();
					clearTimeout(navTimer);
				});
			},1000);
		});

		/*上面抢购的按钮不为灰色的弹窗效果*/
		$(document).on('tap','.shop-top .btn a',function(){
			if(!$(this).parent().hasClass('disable')){
				$('[mask]').removeClass('undis');
				$('[delete-dialog]').removeClass('undis');
			}
			return false;
		});

		$(document).on('tap','[cancel-btn]',function(){
			$('[mask]').addClass('undis');
			$('[delete-dialog]').addClass('undis');
			return false;
		});
	}	
});