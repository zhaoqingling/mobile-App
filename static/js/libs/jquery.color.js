;(function($){
	var flag=false;//游戏允许计时
	var num=0;
	function Color(opts){
		this.play = opts.selector;
		this.longtime = opts.longtime;
		this.isBegin = opts.isBegin;
		this.endFn = opts.endFn;
		this.box = $('.game-box');
		this.home = $('.color-start');
		this.room = $('#room');
		this.lv = $('#room .lv em');
		this.time = $('#room .time');
		this.pause = $('#room .btn-pause');
		this.restart = $('.color-dialog .btn-again');
		this.back = $('.color-dialog .btn-back');
		this.resume = $('.color-dialog .btn-resume');
		this.dialog = $('.color-dialog');
		this.d_content = $('.color-dialog .content');
		this.d_pause = $('.color-dialog .pause');
		this.d_error = $('.color-dialog .perror');
		this.d_gameover = $('.color-dialog .gameover');
		this.lvArr = [2, 3, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9];
		this.num = 0;
		this.init();
	}
	
	
	Color.prototype = {
		// 初始化特效设置
		init:function(){
			this.playGame();
			this.pauseGame();
			this.continueGame();
		},
		initGame:function(){
			this.box.removeAttr('style');
			this.box.addClass('lv1');
			this.lv.text(0);
			this.allTime = this.longtime;
			this.score = -1;
			this.diffValue = 0;
			this.diffColor = 0;
			this.box.html('');		    
			
			//获取时间
			this.timeDec();
			this.home.hide();
			this.room.show();
			this.play.hide();
			this.pause.show();
			this.num = 0;

			//插入span
			this.renderMap();

			// 屏幕改变大小
			this.resizeEvent();
		},
		playGame:function(){
			var self = this;						
			this.play.on('tap',function(){
				self.isBegin(function(d){
					if(d.success){
						self.initGame();
					}else{
						self.room.hide();
						self.dialog.show();
						self.dialog.children('section').hide();
						self.d_error.find('h6').text(d.errMsg);
						self.d_error.show();
					}
				});
				return false;
			});
			this.restart.on('tap',function(){
				self.isBegin(function(d){
					if(d.success){
						self.dialog.hide();
						self.room.show();
						self.home.hide();
						self.initGame();
					}else{
						self.home.show();
						self.room.hide();
						self.dialog.show();
						self.dialog.children('section').hide();
						self.d_error.find('h6').text(d.errMsg);
						self.d_error.show();
					}
				});
				return false;
			});
			this.back.on('tap',function(){
				self.dialog.hide();
				self.lv.text(0);
				self.time.text('');
				self.room.show();
				self.play.show();
				self.d_pause.hide();
				self.d_error.find('h6').text('');
				return false;
			});
			this.box.on('tap', 'span', function() {
				if($(this).index() == self.diffColor){
					self.box.html('');
					self.renderMap();
					self.renderInfo();
				}
				return false;
			});			
		},
		pauseGame:function(){
			var self = this;

			this.pause.on('tap',function(){
				if(self.allTime >= 1){
					if(this.timer){
						clearTimeout(this.timer);
						self.num = 0;
					}
					self.room.hide();
					self.dialog.children('section').hide();
					self.dialog.show();
					self.d_pause.show();
					flag = true;//中断计时
				}
			});
		},
		continueGame:function(){
			var self = this;
			this.resume.on('tap',function(){
				flag=false;
				self.dialog.hide();
				self.room.show();
				self.timeDec();
			});
		},
		renderMap:function(){
			this.score = "undefined" != typeof this.score ? this.score + 1 : 0; 
			this.lvMap = this.lvArr[this.score] || this.lvArr[this.lvArr.length-1];
			var b = this.lvMap * this.lvMap,
				c = "";
			for(var i=0;i<b;i++){
				c += '<span></span>';
			}
			this.box.html(c);
			
			this.gameSize();
			this.render();
		},
		renderInfo:function(){			
			this.lv.text(this.score);
		},
		resizeEvent:function(){
			var self = this;

			$(window).on('resize.color',function(){
				self.gameSize();	
			});
		},
		gameSize:function(){ // 设置每一个颜色模块的大小
			var self = this;

			if(self.room.is(':visible')){
				self.box.css('width','');
				self.box.find('span').css({
					width:'',
					height:''
				});

				var allwidth = self.box.width(),
					width = Math.floor(allwidth/self.lvMap);
				self.box.css('width',allwidth);
				self.box.find('span').css({
					width:width,
					height:width
				});
			}
		},
		timeDec:function() {
  			var self = this;
  			/**
  			 * 递归定时，消除定时堆积
  			 */
  			self.intervalTime(self.num);
		},
		gameOver:function() {
			var self = this;

			self.endFn(self.score);//返回前台得分
			self.lastGameTxt = self.score;
			self.score = 0
			self.allTime = self.longtime;//重置时间
			self.pause.hide();
			self.dialog.children('section').hide();
			self.dialog.show();
			self.d_gameover.show().find('h3').text(this.lastGameTxt + '分');
			self.box.find('span').fadeOut(800, function() {
				self.room.hide();
				self.box.find('span').remove();
			});
		},
		render:function() {
			var g = this.lvArr[this.score] || this.lvArr[this.lvArr.length-1];
			this.diffValue = 15 * Math.max(9 - g, 1),
			this.diffValue = this.score > 20 ? 10 : this.diffValue, 
			this.diffValue = this.score > 40 ? 8 : this.diffValue, 
			this.diffValue = this.score > 50 ? 5 : this.diffValue;
			this.diffColor = Math.floor(Math.random() * this.box.find('span').length);
			var i = this.getColor(255 - this.diffValue),
				j = this.getLvColor(i[0]);
			this.box.find('span').css('background-color', i[1]);
			this.box.find('span').eq(this.diffColor).css('background-color', j[1]);
		},
		getColor:function(a){
			var b = [Math.round(Math.random() * a), Math.round(Math.random() * a), Math.round(Math.random() * a)],
				c = "rgb(" + b.join(",") + ")";
			return [b, c];
		},
		getLvColor:function(a){
			var b = this.diffValue,
				c = $.map(a, function(a) {
					return a + b
				}),
				d = "rgb(" + c.join(",") + ")";
			return [c, d]
		},
		intervalTime:function(num){
			var self = this;
			if(flag){
				return true;
			}
			if(num>0){
				self.allTime--;
			}
			self.time.text(self.allTime);
			if (self.allTime < 6){ 
				self.time.addClass('danger');
			}
			if(self.allTime < 1){
				self.allTime = 0;
				self.gameOver();
				return;
			}
			num++;
			this.timer=setTimeout(function(){
				clearTimeout(self.timer);
				self.intervalTime(num);
			},1000);
		}
	}

	$.fn.Color = function(options){
		// 定义默认参数
		var defaults = {
			selector:this,
			longtime:60,
			isBegin:function(resultFn){
				// 默认状态可以玩游戏
				var status = {
						success:true
					};
				resultFn(status);
			},
			endFn:function(){}
		};
		
		opts = $.extend(defaults,options || {});
		return new Color(opts);
	};

})(jQuery);
