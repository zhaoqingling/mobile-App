/*
* Author:zhaoql
* date:2017/4/24
* description:新增地址页
*/
$(function(){

	/*返回首页点击效果*/
	$(document).on({

		touchstart:function(){
			//active点击
		}	
	},'[back]');	

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