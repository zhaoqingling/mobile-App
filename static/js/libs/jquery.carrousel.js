/**
 @document
 @author:Yujianping
 @tel:13716506521
 @date:2016/1/5
 @example 使用示例
 @        $("#carrousel").carrousel();
 **/
;(function($){
	function Carrousel(opts){
		//并初始化变量
		this.selector = $(opts.selector);
		this.touchendFn = opts.touchendFn;
		this.swipe = this.selector.children();
		this.prefix = '';
		this.dragging = false;
		// initDiffX : 初始时，鼠标与被移动元素原点的距离
		// moveX : 移动时，被移动元素定位位置 (新鼠标位置与initDiffX的差值)
		this.dragParams = {initDiffX:'',moveX:''};

		// 初始化事件
		this.init();
	}
	
	Carrousel.prototype = {
		init:function(opt){
			var _this = this;
			_this.prefix = _this._getVendorPrefix();
			
			if(_this.swipe.width() > _this.selector.width()){
				
				// 触摸相关事件
				_this._touchEvent();
			}
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
			e.preventDefault();
			this.dragging = true;
			this.swipe[0].style[this.prefix + 'TransitionDuration']  = '0ms';
			this.swipe[0].style[this.prefix + 'TransitionTimingFunction']  = 'cubic-bezier(0.1, 0.57, 0.1, 1)';
			this.dragParams.initDiffX = e.originalEvent.targetTouches[0].pageX - this.swipe.position().left;
		},
		_touchend:function(e){
			var _this = this;

			// 停止移动
			_this.dragging = false;
			
			if(_this.dragParams.moveX == 0){
				_this.touchendFn();
			}

			// 左边对齐
			if(_this.swipe.position().left >= 0){
				_this.swipe[0].style[_this.prefix + 'Transform'] = 'translateX(0)';
				_this.swipe[0].style[_this.prefix + 'TransitionDuration']  = '600ms';
			}
			// 右边对齐
			var maxWid = _this.swipe.outerWidth()-_this.selector.outerWidth();
			if(Math.abs(_this.swipe.position().left) >= maxWid){
				_this.swipe[0].style[_this.prefix + 'Transform'] = 'translateX(' + -maxWid + 'px)';
				_this.swipe[0].style[_this.prefix + 'TransitionDuration']  = '600ms';
			}
			
			// 恢复初始值
			_this.dragParams = {initDiffX:'',moveX:''};

			_this.swipe.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
				var duration = _this.prefix + "TransitionDuration";
				
				_this.swipe[0].style[duration + 'TransitionDuration']  = '0ms';

			});
		},
		_touchmove:function(e){
			var _this = this;

			if(_this.dragging){
				_this.dragParams.moveX = e.originalEvent.targetTouches[0].pageX - _this.dragParams.initDiffX;
				_this.swipe[0].style[_this.prefix + 'Transform'] = "translateX(" + _this.dragParams.moveX + "px)";
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

	$.fn.carrousel =  function(options){
		// 定义默认参数
		var defaults = {
			selector:$(this),
			touchendFn:function(){}
		};
		
		opts = $.extend(defaults,options || {});
		return new Carrousel(opts);
	};
})(jQuery);