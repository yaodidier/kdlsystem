$(function(){
	$('.login-item-ul li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		var activeNames = $(this).data('show');
		$('.loginformbar').hide();
		$('#login-'+activeNames).show();
		showErrorMsg(false);
	});
	/* 用户测试 */
	const usernameTest = function(data){
		const reg = /^(\w+){6,18}$/
		return reg.test(data)
	};
	const userpwdTest = function(data){
		const reg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+){6,18}$/
		return reg.test(data)
	};
	const showErrorMsg = function(status, errormsg){
		let show_msg = $('.show-error-msg');
		if(status){
			show_msg
			.text(errormsg)
			.show()
		}else{
			show_msg
			.text('')
			.hide()
		}
	};
	/* 教师登录 */
	$('#tch-login-btn').click(function(){
		var that = $(this);
		var tch_login_msg = {
			username: $('#tch-login-username').val(),
			userpwd:  $('#tch-login-pwd').val()
		};
		var errormsg;
		if(!tch_login_msg.username || !tch_login_msg.userpwd){
			errormsg = '用户名或密码不能为空';
			showErrorMsg(true, errormsg)
		}else if(!usernameTest(tch_login_msg.username)){
			errormsg = '账号不正确';
			showErrorMsg(true, errormsg)
		}else{
			showErrorMsg(false);
			that.attr('disabled','disabled');
			$.ajax({
				url:'/teacher/signin',
				type:'POST',
				data:tch_login_msg,
				success:function(data){
					that.attr('disabled',false);
					if(data.status == 'success'){
						window.location.href = '/'
					}else{
						errormsg = data.msg;
						showErrorMsg(true, errormsg)
					}
				},
				error: function(err){
					that.attr('disabled',false);
					errormsg = '登录失败，请联系管理员';
					showErrorMsg(true, errormsg)
				}
			})
		}
	});
	/* 学生登录 */
	$('#stu-login-btn').click(function(){
		var that = $(this);
		var stu_login_msg = {
			username: $('#stu-login-username').val(),
			userpwd:  $('#stu-login-pwd').val(),
			status: 0
		};
		var errormsg;
		if(!stu_login_msg.username || !stu_login_msg.userpwd){
			errormsg = '用户名或密码不能为空';
			showErrorMsg(true, errormsg)
		}else if(!usernameTest(stu_login_msg.username)){
			errormsg = '账号不正确';
			showErrorMsg(true, errormsg)
		}else{
			showErrorMsg(false);
			that.attr('disabled','disabled');
			$.ajax({
				url:'/student/signin',
				type:'POST',
				data:stu_login_msg,
				success:function(data){
					that.attr('disabled',false);
					if(data.status == 'success'){
						window.location.href = '/stutask/on'
					}else{
						errormsg = data.msg;
						showErrorMsg(true, errormsg)
					}
				},
				error: function(err){
					that.attr('disabled',false);
					errormsg = '登录失败，请联系管理员';
					showErrorMsg(true, errormsg)
				}
			})
		}
	});
})