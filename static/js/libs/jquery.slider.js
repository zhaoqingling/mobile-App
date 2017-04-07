/**
 @document
 @author:Yujianping
 @tel:13716506521
 @date:2015/12/28
 @param(string) fx 图片切换方法 暂时只有scrollLeft(从右向左)
 @param(int) speed 图片特效时长 默认值为400
 @param(int) timeout 图片切换间隔时长 默认为4000
 @param(bool) auto 是否自动播放 默认为false
 @param(string) pager 动态生成数字的ID 默认值为null
 @example 使用示例
 @        $("#slide").slider({
 @			  fx:"fade",
 @			  speed:400,
 @			  timeout:4000,
 @			  auto:false,
 @			  pager:"#slideNum"
 @		 });
 **/
;(function($){
	function Slider(opts){
		// 取滑动id,fx,speed等参数,并初始化变量
		this.selector = $(opts.selector);
		this.swipe = this.selector.find('ol');
		this.speed = opts.speed;
		this.timeout = opts.timeout;
		this.auto = opts.auto;	
		this.pager = $(opts.pager);

		this.index = 0;
		this.len = this.swipe.children('li').length;
		this.width = 0;
		this.height = 0;
		this.slideTimer = '';
		this.direction = '';
		this.prefix = '';
		this.dragging = false;
		// initDiffX : 初始时，鼠标与被移动元素原点的距离
		// moveX : 移动时，被移动元素定位位置 (新鼠标位置与initDiffX的差值)
		this.dragParams = {initDiffX:'',moveX:''};
		
		// 如果只有一个图
		if(this.len == 1){
			this.swipe.find('li').css('position','relative');
			return false;
		}

		// 初始化事件
		this.init();
	}
	
	Slider.prototype = {
		init:function(opt){
			var _this = this;
			
			_this.prefix = _this._getVendorPrefix();
			_this._update();
			
			// 滚动状态
			if(_this.pager.length > 0){
				_this._pager();
			}
			
			// 循环滚动
			if(_this.auto){
				_this._play();
			}
			
			// 页面放大缩小
			$(window).on('resize',function(){
				_this._update();
			});

			// 触摸相关事件
			_this._touchEvent();
		},
		_touchEvent:function(){
			var _this = this;

			_this.swipe.on('touchstart',function(e){
				return _this._touchstart(e);
			});
			_this.swipe.on("touchmove",function(e){	
				return _this._touchmove(e);
			});
			_this.swipe.on("touchend",function(e){
				return _this._touchend(e);
			});
		},
		_touchstart:function(e){
			clearInterval(this.slideTimer);
			this.dragging = true;
			this.dragParams.initDiffX = e.originalEvent.targetTouches[0].pageX - this.selector.position().left;
		},
		_touchend:function(e){
			var _this = this;

			// 停止移动
			_this.dragging = false;
			
			if(Math.abs(_this.dragParams.moveX) > (_this.width / 2)){ // 运动
				
				// 大于0
				if(_this.dragParams.moveX > 0){
					_this.swipe[0].style[_this.prefix + 'Transform'] = 'translateX(' + _this.width + 'px)';
					_this.swipe[0].style[_this.prefix + 'TransitionDuration']  = '200ms';
					_this.direction = 'prev';
					_this._slide();
				}

				// 小于0
				if(_this.dragParams.moveX < 0){
					_this.swipe[0].style[_this.prefix + 'Transform'] = 'translateX(-' + _this.width + 'px)';
					_this.swipe[0].style[_this.prefix + 'TransitionDuration']  = '200ms';
					_this.direction = 'next';
					_this._slide();
				}
			}else{
				_this.swipe[0].style[_this.prefix + 'Transform'] = 'translateX(0px)';
				_this.swipe[0].style[_this.prefix + 'TransitionDuration']  = '200ms';
			}
			
			
			_this.swipe.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
				var transform = _this.prefix + "Transform",
					duration = _this.prefix + "TransitionDuration",
					timing = _this.prefix + "TransitionTimingFunction";
				
				_this.swipe[0].style[transform] = '';
				_this.swipe[0].style[duration] = '';
				_this.swipe[0].style[timing] = '';
				
				// 是否执行自动播放
				if(_this.auto){
					_this._play();
				}
			});
		},
		_touchmove:function(e){
			e.preventDefault();
			var _this = this;

			if(_this.dragging){
				_this.dragParams.moveX = e.originalEvent.targetTouches[0].pageX - _this.dragParams.initDiffX;
				_this.swipe[0].style[(_this.prefix + 'Transform')] = "translateX(" + _this.dragParams.moveX + "px)";
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
		},
		_update:function(){ // 设置宽高以及显示项
			var _this = this,
				width = 0,
				height = 0,
				tHei = '';
			
			_this.swipe.children(":eq(" + _this.index + ")").css({
				display:'block',
				left: 0
			});
			
			_this.swipe.children(":not(:eq(" + _this.index + "))").css({
				display: "none",
				left:0
			});

			tHei = setTimeout(function(){
				_this.width = _this.swipe.children(':eq(' + _this.index + ')').find('img').width();
				_this.height = _this.swipe.children(':eq(' + _this.index + ')').find('img').outerHeight();
				_this.swipe.css('height',_this.height);
				if(_this.index == 0){
					_this.swipe.children(':eq(' + (_this.len - 1) + ')').css({
						display:'block',
						left:-_this.width
					});
					_this.swipe.children(':eq(' + (_this.index + 1) + ')').css({
						display:'block',
						left:_this.width
					});
				}else if(_this.index == (_this.len - 1)){
					_this.swipe.children(':eq(' + (_this.index - 1) + ')').css({
						display:'block',
						left:-_this.width
					});
					_this.swipe.children(':eq(0)').css({
						display:'block',
						left:_this.width
					});
				}else{
					_this.swipe.children(':eq(' + (_this.index - 1) + ')').css({
						display:'block',
						left:-_this.width
					});
					_this.swipe.children(':eq(' + (_this.index + 1) + ')').css({
						display:'block',
						left:_this.width
					});
				}
				clearTimeout(tHei);
			},0);
		},
		_play:function(){ // 开始循环运行
			var _this = this;
			
			clearInterval(_this.slideTimer);
			_this.slideTimer = setInterval(function(){
				_this.direction = 'next';
				
				// 执行滚动
				_this._slide();
			},_this.timeout);
		},
		_pager:function(){ // 设置当前状态		
			var _this = this,
				pagerHtml = '';

			for(var i = 1;i <= _this.len;i++){
				pagerHtml += "<li>" + i + "</li>";
			}
			_this.pager.html(pagerHtml);
			_this.pager.find("li").removeClass("activeSlide").eq(_this.index).addClass("activeSlide");
		},
		_slide:function(number){ // 向左运行
			var current, direction, duration, next, prefix, timing, transform, value,
				_this = this;
			
			current = _this.index;
			value = _this.direction === "next" ? 1 : -1;
			direction = _this.direction === "next" ? -_this.width : _this.width;
			next = current + value;

			if (next === -1) {
				next = _this.len - 1;
			}

			if (next === _this.len) {
				next = 0;
			}

			_this.swipe.children(":eq(" + next + ")").css({
				display: "block",
				left: value * _this.width
			});
			
			if(_this.prefix){
				prefix = _this.prefix;
				transform = prefix + "Transform";
				duration = prefix + "TransitionDuration";
				timing = prefix + "TransitionTimingFunction";
				_this.swipe[0].style[transform] = "translateX(" + direction + "px)";
				_this.swipe[0].style[duration] = _this.speed + "ms";
				
				return _this.swipe.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
					_this.swipe[0].style[transform] = "";
					_this.swipe[0].style[duration] = "";

					_this.index = next;

					// 设置prev和next显示
					_this._update();

					// pager不为空才执行数字切换
					if(_this.pager !== null){
						$(_this.pager).find("li").removeClass("activeSlide").eq(_this.index).addClass("activeSlide");
					}

					_this.swipe.unbind("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd");
				});
			}
		}
	}; 

	$.fn.slider =  function(options){
		// 定义默认参数
		var defaults = {
			selector:$(this).selector,
			speed:400,
			timeout:4000,
			auto:false,	
			pager:null
		};
		
		opts = $.extend(defaults,options || {});
		return new Slider(opts);
	};
})(jQuery);