/*
* Author:zhaoql
* date:2017/4/24
* description:我的积分页
*/
$(function(){

	//加载动画
	var prefix = getVendorPrefix(),
		screenWid = $('[name="level-box"]').width();
	var creditsValue = parseInt($('[total-money] strong').text());
		dLevel = divideLevel(creditsValue),
		lineWid = (dLevel['allLevel'] * 1 + screenWid/2).toFixed(2),
		speed = lineWid * 5,
		moveWid = ((dLevel['nowLevel'] - 1) *100).toFixed(2);
	//初始化数值,样式
	$('[name="node-wrap"]')[0].style['paddingLeft'] =(screenWid/2 - 20) + 'px';
	$('[name="node-wrap"]')[0].style['width'] =(screenWid + 500) + 'px';
	$('[name="node-wrap"] ul li:lt(' + dLevel['nowLevel'] + ')').addClass('active');
	$('[name="node-wrap"] ul li').eq(dLevel['nowLevel'] - 1).removeClass('active').addClass('current');

	//显示总额
	$('[name="node-wrap"] ul li').eq(dLevel['nowLevel'] - 1).append('<p class="total">总额：<span>' + creditsValue + '</span></p>');
	$('[name="node-wrap"] ul li').eq(dLevel['nowLevel'] - 1).find('.txt').remove();

	//进度条加载动画
	$('[name="level-progress"]').children()[0].style['width'] = lineWid  + 'px';
	$('[name="level-progress"]').children()[0].style[prefix + "TransitionDuration"] = speed + 'ms';
	
	//等级移动动画
	var timer = '';
	timer = setTimeout(function(){

		$('[name="node-wrap"]')[0].style[prefix + 'Transform'] = 'translateX(' + -moveWid + 'px)';
		$('[name="node-wrap"]')[0].style[prefix + "TransitionDuration"] = (speed - screenWid/2 * 5) + 'ms';

	},screenWid/2 * 5);

	//加载完成,拖动动画
	$('[name="level-box"]').carrousel();
	function divideLevel(val){ //判断等级
		var nowCoins = val,
			decLevel = 0,
			decCoins = 0;

		if(nowCoins <= 9000){
			decLevel = nowCoins/3000 - Math.floor(nowCoins/3000) == 0 ? 1 : 0;
			nowLevel = Math.ceil(nowCoins/3000) + decLevel;
			allLevel = nowCoins/30;
			return {
				nowLevel:nowLevel,
				allLevel:allLevel
			};
		}
		if(9000 < nowCoins && nowCoins <= 15000){
			decCoins = nowCoins - 9000;
			nowLevel = (decCoins == 6000 ? 1 : 0) + 4;
			allLevel = (decCoins/60 == 0 ? 100 : decCoins/60) + 300;
			return {
				nowLevel:nowLevel,
				allLevel:allLevel
			};
		}
		if(15000 < nowCoins && nowCoins <= 20000){
			decCoins = nowCoins - 15000;
			nowLevel = (decCoins == 5000 ? 1 : 0) + 5;
			allLevel = (decCoins/50 == 0 ? 100 : decCoins/50) + 400;
			return {
				nowLevel:nowLevel,
				allLevel:allLevel
			};
		}
		if(20000 < nowCoins){
			decCoins = nowCoins - 20000;
			nowLevel = 6;
			allLevel = (decCoins/1000 == 0 ? 100 : decCoins/1000) + 500;
			return {
				nowLevel:nowLevel,
				allLevel:allLevel
			};
		}
	}
	function getVendorPrefix(){ //设置浏览器前缀
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
});