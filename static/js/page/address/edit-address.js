/*
* Author:zhaoql
* date:2017/4/24
* description:编辑地址页
*/
$(function(){

	// 加载数据源
	ajaxLoad();

	function ajaxLoad(){
		$.ajax({
			type:'GET',
			url:'./edit-address.json',
			dataType:'json',
			data:'',
			success:function(dataSource){
				// code = 001 代表有数据  其他组合功能(000 002)暂定
				if(dataSource.code == 001){
					var result = '';
					for(var i =0;i<dataSource.addressList.length;i++){
						result +='<section class="group">'+
									'<input type="text" placeholder="收货人姓名" value="'+dataSource.addressList[i].name+'" input1/>'+
									'<p class="warning">请输入收货人姓名</p>'+
								'</section>'+
								'<section class="group">'+
									'<input type="text" placeholder="收货人手机号码" value="'+dataSource.addressList[i].tel+'" input2/>'+
									'<p class="warning">请输入收货人手机号码</p>'+
								'</section>'+
								'<section class="group" id="select-city">'+
									'<span class="select-city" choose-city>'+dataSource.addressList[i].address+'</span>'+
									'<p class="warning">请选择城市</p>'+
								'</section>'+
								'<section class="group">'+
									'<input type="text" placeholder="请输入您的详细地址" value="'+dataSource.addressList[i].detail+'" input4/>'+
									'<p class="warning">请输入详细地址</p>'+
								'</section>'+
								'<section class="group">'+
									'<input type="text" placeholder="邮政编码(选填)" value="'+dataSource.addressList[i].mail+'"/>'+
								'</section><section class="group"><span class="default">设为默认地址</span>'+
									'<span class="circle" default><i></i></span>'+
								'</section>';

						$('.edit-form').append(result);
						page();
					}
				}else{
					// 数据加载失败后相应操作 即 code !=001的操作
					var timer='';
					$('.edit-form').append('<p class="notice-txt">信息读取失败，请刷新或返回重新操作~~</p>');
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
	
		/*点击设为默认地址*/
		$(document).on('tap','[default]',function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
			}else{
				$(this).removeClass('on');
			}
		});

		/*选择城市*/
		(function($, doc) {
			$.init();
			var result = $('[choose-city]')[0];
			$.ready(function() {
				var cityPicker = new $.PopPicker({
					layer: 2
				});
				cityPicker.setData(cityData);
				var showCityPickerButton = doc.getElementById('select-city');
				showCityPickerButton.addEventListener('tap', function(event) {
					cityPicker.show(function(items) {
						result.innerText = items[0].text + " " + items[1].text;
					});
				}, false);
			});
		})(mui, document);

		/*表单验证*/
		$(document).on({

			focus:function(){
				$(this).siblings('.warning').hide();
			},
			blur:function(){
				var val = $(this).val();
				if(val == ''){
					$(this).siblings('.warning').show();
				}else{
					$(this).siblings('.warning').hide();
				}	
			}

		},'input');

		$('input').each(function(){
			var _this = $(this);
			$(document).on('tap','[btn-save]',function(){
				if(_this.val()==''){
					_this.siblings('.warning').show();
				}
				if($('[select-city]').text() == '请选择城市'){
					$('[select-city]').siblings('.warning').show();
				}
				
			});
		});

		$(document).on('keyup','input',function(){
			var txt3 = $('[select-city]').text();
			if(txt3 == '请选择城市'){
				$('[btn-save]').addClass('disable');
			}else{
				yanzheng();
			}
		});

		$(document).on('tap','[name="btn-confirm"]',function(){
			$('[select-city]').siblings('.warning').hide();
			var txt3 = $('[select-city]').text();
			if(txt3 !='请选择城市'){
				var txt1 = $('[input1]').val(),
			 		txt2 = $('[input2]').val(),
					txt4 = $('[input4]').val();
				if(txt1 == '' || txt2 == '' || txt4 ==''){
					$('[btn-save]').addClass('disable');
				}else{
					$('[btn-save]').removeClass('disable');
				}	
			}
		});

		/*删除地址弹框*/
		$(document).on('tap','[delete]',function(){
			$('[mask]').removeClass('undis');
			$('[delete-dialog]').removeClass('undis');
		});

		$(document).on('tap','[confirm-btn],[cancel-btn]',function(){
			$('[mask]').addClass('undis');
			$('[delete-dialog]').addClass('undis');
			return false;
		});
	}

	function yanzheng(){
		var txt1 = $('[input1]').val(),
	 		txt2 = $('[input2]').val(),
			txt4 = $('[input4]').val();
		if(txt1 == '' || txt2 == '' || txt4 ==''){
			$('[btn-save]').addClass('disable');
		}else{
			if($('[select-city]').text() !='请选择城市'){
				$('[btn-save]').removeClass('disable');
			}
		}
	}
});