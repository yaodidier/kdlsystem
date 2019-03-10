// 手机端js文件
$(function(){
	$('.nav-list-trigger').click(function(){
		$('body').css('overflow','hidden')
		$('.nav-off-canvas-bg').show()
	})
	$('.close-nav').click(function(){
		$('body').css('overflow','auto')
		$('.nav-off-canvas-bg').hide()
	})
	$('.arrow-left').click(function(){
		var e = jQuery.Event("keydown");
		e.keyCode = 37;
		$(this).trigger(e);
	})
	$('.arrow-up').click(function(){
		var e = jQuery.Event("keydown");
		e.keyCode = 37;
		$(this).trigger(e);
	})
	$('.arrow-right').click(function(){
		var e = jQuery.Event("keydown");
		e.keyCode = 37;
		$(this).trigger(e);
	})
	$('.arrow-down').click(function(){
		var e = jQuery.Event("keydown");
		e.keyCode = 37;
		$(this).trigger(e);
	})
	$('.space').click(function(){
		var e = jQuery.Event("keydown");
		e.keyCode = 32;
		$(this).trigger(e);
	})
	
})