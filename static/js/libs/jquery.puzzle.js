;(function($){
	var num=0;
	function Puzzle(options){
		this.imgBox = $(options.selector)
		this.imgArea = this.imgBox.children();     //图片显示区域 
		this.imgCells = this.imgArea.children();   //碎片 
		this.readyPage = $(options.readyPage);	//引导页页面
		this.gamePage = $(options.gamePage);		//游戏页面
		this.btnReady = $(options.btnReady);  //进入游戏按钮
		this.btnStart = $(options.btnStart);  //开始游戏按钮
		this.time = $(options.time);		  //存储时间
		this.timeBar = $(options.timeBar);		  //时间轴
		this.levelArr = options.levelArr;    //存储难度等级的数组
		this.readytime = options.readytime;		//准备时间
		this.playtime = options.playtime;		//游戏时间
		this.imgOrigArr = [];                 //图片拆分后，存储正确排序的数组
		this.imgRandArr = [];                 //图片打乱顺序后，存储当前排序的数组
		this.hasStart = 0;                    //记录有是否开始的变量，默认fasle，未开始
		this.num = 0;

		this.gameNum = options.gameNum;
		this.startFn = options.startFn;
		this.endFn = options.endFn;

		this.img = '';         //待操作的图片
	
		//图片整体的宽高
		this.imgWidth = 0;
		this.imgHeight = 0;
		//拆分为碎片后，每一块碎片的宽高
		this.cellWidth = 0;
		this.cellHeight = 0;

		this.dragParams = {initDiffX:'',initDiffY:'',moveX:'',moveY:''};
		// 调用初始化函数，拆分图片,绑定按钮功能
		this.init();
	}

	Puzzle.prototype = {
		// 初始化特效设置
		init:function(){
			var _this = this;
			_this.prefix = _this._getVendorPrefix();
			_this.getBoxSize();
			_this.gameReady();
			_this.resizeEvent();
			_this.num = 0;

			
		},

		_touchEvent:function(){
			var _this = this;
			
			_this.imgCells.off('touchstart');
			_this.imgCells.on('touchstart',function(e){
				if(_this.hasStart == 0) return;
				return _this._touchstart(e,this);
			});
			_this.imgCells.off('touchmove');
			_this.imgCells.on("touchmove",function(e){	
				if(_this.hasStart == 0) return;
				return _this._touchmove(e,this);
			});
			_this.imgCells.off('touchend');
			_this.imgCells.on("touchend",function(e){
				if(_this.hasStart == 0) return;
				return _this._touchend(e,this);
			});
		},

		resizeEvent:function(){ //随着页面宽度设置高度
			var _this = this;

			$(window).on('resize.puzzle',function(){
				_this.getBoxSize();
				_this.gameSize();	
			});
		},
		
		getBoxSize:function(){
			var _this = this,
				width = _this.imgBox.width();

			_this.imgWidth = parseInt(width);
			_this.imgHeight = parseInt(width);

			//拆分为碎片后，每一块碎片的宽高
			_this.cellWidth = Math.floor(_this.imgWidth/_this.levelArr[1]) - 1;
			_this.cellHeight = Math.floor(_this.imgHeight/_this.levelArr[0]) - 1;

			this.imgArea.css({
				width:(_this.cellWidth*3 + 2) + 'px',
				height:(_this.cellWidth*3 + 2) + 'px'
			});
		},
		gameSize:function(){ // 设置高度
			var _this = this,
				positionArr = '';
			
			for(var i=0;i<this.levelArr[0];i++){
				for(var j=0;j<this.levelArr[1];j++){
					_this.imgCells.eq(i*this.levelArr[1]+j).css({
						width:(this.cellWidth - 2) + 'px',
						height:(this.cellHeight - 2) + 'px',
						backgroundSize:_this.imgWidth + 'px' + ' ' + _this.imgWidth + 'px',
						backgroundPosition:(-j)*this.cellWidth + 'px ' + (-i)*this.cellHeight + 'px'
					});
				}
			}

			if(_this.hasStart != 0){
				positionArr = _this.imgRandArr;				
			}else{
				positionArr = _this.imgOrigArr;
			}
			
			for(var i=0,len=positionArr.length;i<len;i++){
				var left = positionArr[i]%this.levelArr[1]*this.cellWidth + 1,
					top = Math.floor(positionArr[i]/this.levelArr[0])*this.cellHeight + 1;
				_this.imgCells.eq(i)[0].style[_this.prefix + 'Transform'] = "translateX(" + left + "px) translateY(" + top + "px)";
				_this.imgCells.eq(i)[0].style[_this.prefix + 'TransitionDuration'] = '0ms';
			}
		},

		gameReady:function(){
			var _this = this;
			_this.btnReady.on('tap',function(){
				
				_this.startFn(function(o){
					if(o.success){
						_this.img = o.imgSrc;
						
						_this.readyPage.hide();
						_this.gamePage.show();
						_this.getBoxSize();
						_this.imgSplit();

						// 触摸相关事件
						_this._touchEvent();
						_this.resizeEvent();
						_this.allTime = _this.readytime;
						_this.timeDec();
						
					}else{ // 请求超时
						_this.failDialog({
							content:'出错了，请检查您的网络！'
						});
					}
				});
				return false;
			});

			_this.btnStart.on('tap',function(){
				var self = this;
				if(_this.hasStart == 0){	
					//开始游戏后部分值、样式设置
					$(self).text('提交');
					_this.hasStart = 1;
					clearTimeout(_this.timer);
					_this.allTime = _this.playtime;
					_this.timeDec();

					//打乱图片
					_this.randomArr();
					_this.cellOrder(_this.imgRandArr);

				}else if(_this.hasStart == 1){
					// 执行结束回调
					_this.endFunction();
					return false;					
				}
			});

			// 插入弹出窗口框架代码
			var dlogHtml = '<section class="puzzle-dialog" name="puzzle-dialog"><section class="bd"></section></section><section class="puzzle-mask" name="puzzle-dialog-mask"></section>';
			$('body').append(dlogHtml);

			_this.showBox = $('[name="puzzle-dialog"]');    //弹窗对象
			_this.showMask = $('[name="puzzle-dialog-mask"]');  //遮罩层对象

			//关闭弹框
			$(document).on('tap','[name="btn-close"]',function(){
				//var _this = this;

				$('[name="puzzle-dialog"]').fadeOut();
				$('[name="puzzle-dialog-mask"]').fadeOut();
				_this.readyPage.show();
				_this.gamePage.hide();

				_this.showBox.find('.bd').html('');
				return false;
			});
		},

		/**
		 * [imgSplit 将图片拆分为碎片]
		 * @param  obj    [图片,路径+名称]
		 * @param  cellW  [碎片宽度]
		 * @param  cellH  [碎片高度]
		 * @return        [记录正确排序的数组]
		 */
		imgSplit:function(){
			var _this = this;

			this.imgOrigArr = [];//清空正确排序的数组

			//必须清空图片区域的碎片代码，否则每一次拆分图片是与之前拆分的累积
			this.imgArea.html("");

			var cell = '';//记录单个图片碎片的变量
			for(var i=0;i<this.levelArr[0];i++){
				for(var j=0;j<this.levelArr[1];j++){
					//将碎片所属div的下标存入数组，用于最终校验是否排序完成
					this.imgOrigArr.push(i*this.levelArr[1]+j);

					cell = document.createElement("div");
					cell.className = "imgCell";
					$(cell).css({
						width:(_this.cellWidth - 2) + 'px',
						height:(_this.cellHeight - 2) + 'px',
						background:'url(' + _this.img + ')',
						backgroundSize:_this.imgWidth + 'px' + ' ' + _this.imgWidth + 'px',
						backgroundPosition:(-j)*this.cellWidth + 'px ' + (-i)*this.cellHeight + 'px'
					});
					$(cell)[0].style[this.prefix + 'Transform'] = "translateX(" + (j * this.cellWidth + 1) + "px) translateY(" + (i * this.cellHeight + 1) + "px)";

					this.imgArea.append(cell);
				}
			}

			this.imgCells = this.imgArea.find('.imgCell');//碎片节点
		},
		_touchstart:function(e,dom){
			
			e.preventDefault();
			
			var _this = this,
				$_this = $(dom);

			$_this.addClass('hover');
			_this.imgCells.each(function(){
				$(this)[0].style[_this.prefix + 'TransitionDuration'] = '';
			});
			//所选图片碎片的下标以及鼠标相对该碎片的位置
			this.dragParams.initDiffX = e.originalEvent.targetTouches[0].pageX - $_this.position().left,
			this.dragParams.initDiffY = e.originalEvent.targetTouches[0].pageY - $_this.position().top;

		},

		_touchend:function(e,dom){
			var _this = this,
				$_this = $(dom),
				cellIndexFrom = $_this.index(),
				left = _this.dragParams.moveX + _this.dragParams.initDiffX - _this.imgArea.offset().left,
				top = _this.dragParams.moveY + _this.dragParams.initDiffY - _this.imgArea.offset().top;

			if(Math.abs(_this.dragParams.moveX) > 0 || Math.abs(_this.dragParams.moveY) > 0){

				//被交换的碎片下标
				cellIndexTo = _this.cellChangeIndex(left,top,cellIndexFrom);
				
				//碎片交换
				if(cellIndexFrom == cellIndexTo){
					_this.cellReturn(cellIndexFrom);
				}else{
					_this.cellExchange(cellIndexFrom,cellIndexTo);
				}
			}
			$_this.removeClass('hover');
		},

		_touchmove:function(e,dom){
			var _this = this,
				$_this = $(dom);

			_this.dragParams.moveX = e.originalEvent.targetTouches[0].pageX - _this.dragParams.initDiffX,
			_this.dragParams.moveY = e.originalEvent.targetTouches[0].pageY - _this.dragParams.initDiffY;
			$_this.removeClass('hover');
			$_this[0].style['z-index']='100';
			$_this[0].style[_this.prefix + 'Transform'] = "translateX(" + _this.dragParams.moveX + "px) translateY(" + _this.dragParams.moveY + "px)";
			$_this[0].style[_this.prefix + 'TransitionDuration'] = '0ms';
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

		// 生成不重复的随机数组的函数
		randomArr:function(){
			//清空数组
			this.imgRandArr = [];
		
			var order;
			for(var i=0,len=this.imgOrigArr.length;i<len;i++){			
				order = Math.floor(Math.random()*len);
				if(this.imgRandArr.length > 0){
					while(jQuery.inArray(order,this.imgRandArr) > -1){
						order = Math.floor(Math.random()*len);
					}
				}
				this.imgRandArr.push(order);
			}
		},

		// 根据数组给图片排序的函数 用于排序的数组，可以是正序或乱序
		cellOrder:function(arr){
			var _this = this;
			for(var i=0,len=arr.length;i<len;i++){
				var left = arr[i]%this.levelArr[1]*this.cellWidth + 1,
				    top = Math.floor(arr[i]/this.levelArr[0])*this.cellHeight + 1;
				this.imgCells.eq(i)[0].style[_this.prefix + 'Transform'] = "translateX(" + left + "px) translateY(" + top + "px)";
				this.imgCells.eq(i)[0].style[_this.prefix + 'TransitionDuration'] = '400ms';
			}
		},

		/**
		 * [cellChangeIndex 通过坐标，计算被交换的碎片下标]
		 * @param  x    [鼠标x坐标]
		 * @param  y    [鼠标y坐标]
		 * @param  orig [被拖动的碎片下标，防止不符合碎片交换条件时，原碎片返回]
		 * @return      [被交换节点在节点列表中的下标]
		 */
		cellChangeIndex:function(x,y,toIndex){
			// 鼠标拖动碎片移至大图片外
			if(x<0 || x>this.imgWidth || y<0 || y>this.imgHeight){
				return toIndex;
			}
			
			//鼠标拖动碎片在大图范围内移动
			var row = Math.floor(y/this.cellHeight),
				col = Math.floor(x/this.cellWidth),
				local = row*this.levelArr[1] + col;
			
			var i = 0,
				len = this.imgRandArr.length;
			while((i < len) && (this.imgRandArr[i] != local)){
				i++;
			}
			return i;
		},

		/**
		 * [cellExchange 两块图片碎片进行交换]
		 * @param  from [被拖动的碎片]
		 * @param  to   [被交换的碎片]
		 * @return      [交换结果，成功为true,失败为false]
		 */
		cellExchange:function(from,to){
			var _this = this,
				//被拖动图片、被交换图片所在行、列
				rowFrom = Math.floor(this.imgRandArr[from]/this.levelArr[1]),
				colFrom = this.imgRandArr[from]%this.levelArr[1],
				rowTo = Math.floor(this.imgRandArr[to]/this.levelArr[1]),
				colTo = this.imgRandArr[to]%this.levelArr[1],
				temp = this.imgRandArr[from];//被拖动图片下标，临时存储

			//被拖动图片变换位置
			var leftFrom = colTo*this.cellWidth,
				topFrom = rowTo*this.cellHeight;
			_this.imgCells.eq(from)[0].style[_this.prefix + 'Transform'] = "translateX(" + leftFrom + "px) translateY(" + topFrom + "px)";
			_this.imgCells.eq(from)[0].style[_this.prefix + 'TransitionDuration'] = '400ms';
			_this.imgCells.eq(from)[0].style['z-index']='10';
			
			//被交换图片变换位置
			var leftTo = colFrom*this.cellWidth,
				topTo = rowFrom*this.cellHeight;
			_this.imgCells.eq(to)[0].style[_this.prefix + 'Transform'] = "translateX(" + leftTo + "px) translateY(" + topTo + "px)";
			_this.imgCells.eq(to)[0].style[_this.prefix + 'TransitionDuration'] = '400ms';
			_this.imgCells.eq(to)[0].style['z-index']='100';
			
			_this.imgCells.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',function(){
				_this.imgCells.css('z-index',10);
			});

			//两块图片交换存储数据
			_this.imgRandArr[from] = _this.imgRandArr[to];
			_this.imgRandArr[to] = temp;
		},

		/**
		 * [cellReturn 被拖动图片返回原位置的函数]
		 * @param  index [被拖动图片的下标]
		 * @return       [无]
		 */
		cellReturn:function(index){
			var _this = this,
				row = Math.floor(this.imgRandArr[index]/this.levelArr[1]),
				col = this.imgRandArr[index]%this.levelArr[1],
				top = row*this.cellHeight,
				left = col*this.cellWidth;

			this.imgCells.eq(index)[0].style[_this.prefix + 'Transform'] = "translateX(" + left + "px) translateY(" + top + "px)";
			this.imgCells.eq(index)[0].style[_this.prefix + 'TransitionDuration'] = '400ms';
			this.imgCells.eq(index)[0].style['z-index']='10';
		},

		/**
		 * [checkPass 判断游戏是否成功的函数]
		 * @param  rightArr  [正确排序的数组]
		 * @param  puzzleArr [拼图移动的数组]
		 * @return           [是否完成游戏的标记，是返回true，否返回false]
		 */
		checkPass:function(rightArr,puzzleArr){
			if(rightArr.toString() == puzzleArr.toString()){
				return true;
			}
			return false;
		},

		timeDec:function() {
  			var _this = this;
  			/**
  			 * 递归定时，消除定时堆积
  			 */
			_this.timeBar.css('width','100%');

			if(_this.hasStart == 1){
				_this.playTime(_this.num);
			}else{
				_this.viewTime(_this.num);
			}
		},

		// 成功完成游戏后的处理函数
		successDialog:function(opt){
			var _this = this,
				html = '<section class="prize-info status-success"><p class="txt">' + opt.content + '</p><button class="btn-close" name="btn-close" type="button">手气不错 再试一次</button></section>'
			_this.showBox.find('.bd').append(html);
			_this.showMask.css({
				display:'block',
				top:0,
				left:0,
				right:0,
				bottom:0
			});//遮罩层显示
			_this.showBox.fadeIn();//弹窗显示
		},

		// 失败弹窗事件
		failDialog:function(opt){
			var _this = this,
				html = '<section class="prize-info status-fail"><p class="txt">' + opt.content + '</p><button class="btn-close" name="btn-close" type="button">我知道了</button></section>'
			_this.showBox.find('.bd').append(html);
			_this.showMask.css({
				display:'block',
				top:0,
				left:0,
				right:0,
				bottom:0
			});//遮罩层显示
			_this.showBox.fadeIn();//弹窗显示
		},

		viewTime:function(num){
			var _this = this;

			if(num>0){
				_this.allTime--;

				_this.timeBar[0].style['width'] =( _this.allTime/_this.readytime).toFixed(2) * 100 + '%';
			
				if(_this.allTime < 1){
					_this.allTime = 0;

					//开始游戏后部分值、样式设置
					_this.btnStart.text('提交');
					_this.hasStart = 1;
					clearTimeout(_this.timer);
					_this.allTime = _this.playtime;
					_this.timeDec();

					//打乱图片
					_this.randomArr();
					_this.cellOrder(_this.imgRandArr);
				}
			}

			_this.time.text('00：' + _this.allTime);

			if (_this.allTime < 10){ 
				_this.time.text('00：0' + _this.allTime);
			}

			num++;
			_this.timer=setTimeout(function(){
				clearTimeout(_this.timer);
				_this.viewTime(num);
			},1000);
		},

		playTime:function(num){
			var _this = this;

			if(num>0){
				_this.allTime--;

				_this.timeBar[0].style['width'] =( _this.allTime/_this.playtime).toFixed(2) * 100 + '%';
			}

			if(_this.allTime < 1){
				_this.allTime = 0;

				// 执行结束回调
				_this.endFunction();
				return false;					
			}

			_this.time.text('00：' + _this.allTime);

			if (_this.allTime < 10){ 
				_this.time.text('00：0' + _this.allTime);
			}

			num++;
			_this.timer=setTimeout(function(){
				clearTimeout(_this.timer);
				_this.playTime(num);
			},1000);
		},
		endFunction:function(){
			var _this = this;
	
			_this.btnStart.text('开始');
			_this.hasStart = 0;
			clearTimeout(_this.timer);
			_this.allTime = _this.readytime;
			
			_this.gameNum--;
			var html = '<div style="background:rgba(0,0,0,0.6);position:fixed;top:0;left:0;bottom:0;right:0;z-index:100000;"><div class="loading" style="width:5rem;position:fixed;top:50%;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);z-index:1000001;">加载中</div></div>'
			$load = $(html).appendTo('body');

			//判断是否完成全部移动，可以结束游戏
			var chkBln = _this.checkPass(_this.imgOrigArr,_this.imgRandArr);

			_this.endFn({
				bln:chkBln,
				callback:function(o){
					$load.remove();

					if(o.success){
						if(chkBln){
							_this.successDialog({
								content:'恭喜您获得2个米粒！'
							});
						}else{
							_this.failDialog({
								content:'差一点就成功了，再接再厉吧！'
							});
						}
					}else{ // 请求超时
						_this.failDialog({
							content:'出错了，请检查您的网络！'
						});
					}
				}
			});
		}
	 }

	$.fn.puzzle = function(options){
		var defaults = {
				selector:$(this),
				levelArr:[3,3],
				readytime:6,
				playtime:30,
				gameNum:10,
				startFn:function(callback){
					var status = { // 判断用户米粒是否满足大于10
						success:true
					};
					callback(status);
				},
				endFn:function(opt){
					var bln = opt.bln;
					
					var status = { // ajax返回值
							success:false
						};
					opt.callback(status);
				}
			};
		
		opts = $.extend(defaults,options || {});
		return new Puzzle(opts);
	};
})(jQuery);