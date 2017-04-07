/**
 @document
 @author:Yujianping
 @tel:13716506521
 @date:2016/1/12
 @param(int)  layer 显示列表数，默认为3
 @param(data) 列表数据 默认为空
 @param(okFn) 事件，点击确定事件后执行的代码，默认为空
 @example 使用示例
 @        $('[]name="choose-city"').cityPicker({
 @			  layer:3,
 @			  data:'',
 @			  okFn:function(){}
 @		 });
 **/
;(function($){
	function CityPicker(opts){
		// 取滑动id,fx,speed等参数,并初始化变量
		this.selector = $(opts.selector);
		this.layer = opts.layer;
		this.data = opts.data;
		this.okFn = opts.okFn;
		
		this.prefix = '';
		this.dataArr = [];
		
		this.dragging = false;
		// initDiffX : 初始时，鼠标与被移动元素原点的距离
		// moveX : 移动时，被移动元素定位位置 (新鼠标位置与initDiffX的差值)
		this.dragParams = {initDiffY:'',moveY:''};

		// 初始化事件
		this.init();
	}
	
	CityPicker.prototype = {
		init:function(){
			this.prefix = this._getVendorPrefix();// 设置浏览器前缀
			this._dataArr(); // 创建城市列表数组
			this._createPicker(); // 创建框架
			this._setDataHtml(); // 创建数据内容
			this._pikcerEvent(); // 绑定城市事件
		},
		_dataArr:function(){
			var _this = this;
			
			_this.dataArr.length = 0; //清空数据
			for(var i=0;i<_this.layer;i++){
				
				if(i == 0){
					_this.dataArr.push({
						index:0,
						data:_this.data 
					});
				}else{
					_this.dataArr.push({
						index:0,
						data:_this.dataArr[(i-1)]['data'][_this.dataArr[(i-1)]['index']]['children'] 
					});
				}
			}
		},
		_pikcerEvent:function(){
			var _this = this;

			_this.selector.on('tap',function(){
				// 展示动画
				$('[name="city-picker-mask"]').show();
				$('.city-picker').addClass('on');
				return false;
			});
			
			// 取消事件
			$('.city-picker .btn-cancel').on('tap',function(){
				// 重置城市
				_this._update();
			});
			
			//确定事件
			$('.city-picker .btn-confirm').on('tap',function(){
				var itemArr = [];
				
				for(var i=0;i<_this.layer;i++){
					var nowData = _this.dataArr[i]['data'][_this.dataArr[i]['index']];
					itemArr.push({
						value:nowData['value'],
						text:nowData['text']
					});

					if(!nowData['children']) break;
				}
				
				_this.okFn(itemArr);
				
				// 重置城市
				_this._update();
			});

			// 循环绑定列表滑动选择城市
			for(var i=0;i<_this.layer;i++){
				(function(arrIndex){
					$('.city-picker .bd .listpicker').eq(arrIndex).find('.listpicker-inner ul').on({
						touchstart:function(e){
							e.preventDefault();
							_this.dragging = true;
							_this.dragParams.initDiffY = e.originalEvent.targetTouches[0].pageY - $(this).position().top;
						},
						touchmove:function(e){
							var __this = this;

							if(_this.dragging){
								_this.dragParams.moveY = e.originalEvent.targetTouches[0].pageY - _this.dragParams.initDiffY;
								$(__this)[0].style[(_this.prefix + 'Transform')] = "translateY(" + _this.dragParams.moveY + "px)";

								// 执行省市区切换
								_this._activeSetPicker({
									dom:__this,
									scrollTop:Math.abs(parseInt(_this.dragParams.moveY)) + 83,
									arrIndex:arrIndex,
									posBln:false
								});
							}
						},
						touchend:function(){
							var __this = this;
							_this.dragging = false;  // 停止移动
							// 执行省市区切换
							_this._activeSetPicker({
								dom:__this,
								scrollTop:Math.abs(parseInt(_this.dragParams.moveY)) + 83,
								arrIndex:arrIndex,
								posBln:true
							});
						}
					});
				})(i);
			}
		},
		_activeSetPicker:function(opts){
			var _this = this,
				__this = opts.dom,// dom
				scrollTop = opts.scrollTop, // 滚动高度
				arrIndex = opts.arrIndex, // 当前是第几个执行
				posBln = opts.posBln, // 是否是end事件触发
				curTop = 0,
				ulTop = $(__this).position().top,
				ulBottom = $(__this).outerHeight() - $(__this).parent().height(),
				$li = $(__this).find('li'),
				liLen = $li.length;

			$li.each(function(){
				var top = $(this).position().top,
					bottom = top + 35;
				
				// 设置当前选项
				if(top <= scrollTop && scrollTop < bottom){
					_this.dataArr[arrIndex]['index'] = $(this).index();

					if(posBln){ // 判断是否是end触发
						curTop = -($li.eq(_this.dataArr[arrIndex]['index']).position().top - 83);
					}
					return false;
				}
			});
			
			if(posBln){ // 判断是否是end触发
				// 超出区域
				if(ulTop >= 0){
					_this.dataArr[arrIndex]['index'] = 0;
					curTop = 0;
				}

				if(Math.abs(ulTop) >= ulBottom){
					_this.dataArr[arrIndex]['index'] = liLen - 1;
					curTop = -ulBottom;
				}

				$(__this)[0].style[(_this.prefix + 'Transform')] = "translateY(" + curTop + "px)";
			}
			$li.eq(_this.dataArr[arrIndex]['index']).addClass('highlight').siblings().removeClass('highlight');
			
			// 初始化数据
			for(var h=0;h<(_this.layer-arrIndex-1);h++){
				var nextIndex = arrIndex + h + 1;
				_this.dataArr[nextIndex]['data'] = _this.dataArr[arrIndex+h]['data'][_this.dataArr[arrIndex+h]['index']]['children'];
				_this.dataArr[nextIndex]['index'] = 0;
			}

			// 如果值为1时，不执行下一级选择
			if(_this.layer == 1) return;

			for(var h=0;h<(_this.layer-arrIndex-1);h++){
				var nextIndex = arrIndex + h + 1;
					$ul = $('.city-picker .bd .listpicker').eq(nextIndex).find('.listpicker-inner ul'),
					listHtml = '';
				
				$ul.html('');
				$ul[0].style[(_this.prefix + 'Transform')] = "translateY(0)";
				
				// 如果没有下一级市直接跳出
				if(!_this.dataArr[arrIndex + h]['data'][_this.dataArr[arrIndex+h]['index']]['children']) break;
				
				$.each(_this.dataArr[nextIndex]['data'],function(j,n){
					var data = _this.dataArr[nextIndex]['data'][j];

					listHtml += '<li data-value="' + data['value'] + '">' + data['text'] +'</li>';
				});

				$ul.append(listHtml);
				$ul.children('li').eq(0).addClass('highlight');
			}

		},
		_createPicker:function(){ // 创建页面框架标签
			var _this = this,
				cityPicer = '<div class="city-picker"><div class="hd"><button class="btn-cancel" name="btn-cancel">取消</button><button class="btn-confirm" name="btn-confirm">确定</button></div><div class="bd"></div></div><div class="city-picker-mask" name="city-picker-mask"></div>',
				listPicker = '';
			
			$('body').append(cityPicer);

			for(var i=0;i<_this.layer;i++){
				listPicker += '<div class="listpicker"><div class="listpicker-inner"><ul></ul></div><div class="listpicker-rule"></div></div>'	
			}

			$('.city-picker .bd').append(listPicker);
		},	
		_update:function(){
			var _this = this;
			
			$('[name="city-picker-mask"]').hide();
			$('.city-picker').removeClass('on');

			// 数据清空
			_this._dataArr();
			_this._setDataHtml();
		},
		_setDataHtml:function(){ // 重置页面数据html
			var _this = this;

			for(var i=0;i<_this.layer;i++){
				var listHtml = '';
				$.each(_this.dataArr[i]['data'],function(j,n){
					var data = _this.dataArr[i]['data'][j];

					listHtml += '<li data-value="' + data['value'] + '">' + data['text'] +'</li>';
				});
				var $ul = $('.city-picker .bd .listpicker').eq(i).find('.listpicker-inner ul');
				$ul.html('').append(listHtml);
				$ul[0].style[(_this.prefix + 'Transform')] = "translateY(0)";
				$ul.children('li').eq(0).addClass('highlight');
			}
		},
		_getVendorPrefix:function(){ //设置浏览器前缀
			var body, i, style, transition, vendor;
			body = document.body || document.documentElement;
			style = body.style;
			transition = "transition";
			vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
			transition = transition.charAt(0).toUpperCase() + transition.substr(1);
			i = 0;
			while (i < vendor.length) {
				if (typeof style[vendor[i] + transition] === "string") {
					return vendor[i];
				}
				i++;
			}
			return false;
		}
	}; 

	$.fn.cityPicker =  function(options){
		// 定义默认参数
		var defaults = {
			selector:$(this),
			layer:3,
			data:'',
			okFn:function(){}
		};
		
		opts = $.extend(defaults,options || {});
		return new CityPicker(opts);
	};
})(jQuery);