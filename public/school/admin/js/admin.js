$(function(){
	/* 用户测试 */
	const usernameTest = function(data){
		const reg = /^(\w+){6,18}$/
		return reg.test(data)
	};
	const userpwdTest = function(data){
		const reg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+){6,18}$/
		return reg.test(data)
	};
	const numberTest = function(data){
		const reg = /^[1-9]+\d*$/;
		return reg.test(data)
	};
	//修改密码
	$('#admin-changepwd-btn').click(function(){
		let adminid = $(this).data('user');
		let oldpwd = $('#admin-change-oldpwd').val();
		let newpwd = $('#admin-change-newpwd').val();
		let samepwd = $('#admin-change-samepwd').val();
		if(newpwd !== samepwd){
			alert('两次密码不一致')
		}else if(oldpwd && newpwd && samepwd){
			$.ajax({
				url:'/admin/change/pwd',
				type:'POST',
				data:{
					userid:adminid,
					oldpwd:oldpwd,
					newpwd:newpwd
				},
				success:function(data){
					if(data.status == 'success'){
	        			alert('修改成功')
	        			window.location.href = '/admin/login'
	        		}else{
	        			alert(data.msg)
	        		}
				},error:function(err){
					console.log(err)
					alert('修改失败')
				}
			})
		}
	})
	/* 点击注册 */
	$('#admin-reg-btn').click(function(){
		let that = $(this);
		let reg_msg = {
			username: $('#admin-reg-username').val(),
			userpwd:  $('#admin-reg-password').val(),
			samepwd:  $('#admin-same-password').val()
		}
		let errormsg;
		if(!usernameTest(reg_msg.username)){
			errormsg = '账号格式不正确';
			alert(errormsg)
		}else if(!userpwdTest(reg_msg.username)){
			errormsg = '密码格式不正确';
			alert(errormsg)
		}else if(!reg_msg.username  || !reg_msg.userpwd){
			errormsg = '账号或密码不能为空';
			alert(errormsg)
		}else if(reg_msg.userpwd !== reg_msg.samepwd){
			errormsg = '两次密码不一致';
			alert(errormsg)
		}else{
			that.attr('disabled','disabled');
			$.ajax({
				url:'/admin/register',
				type:'POST',
				data:reg_msg,
				success:function(data){
					that.attr('disabled',false);
					if(data.status == 'success'){
						alert('开设成功')
					}else{
						errormsg = data.msg;
						alert(errormsg)
					}
					
				},
				error: function(err){
					that.attr('disabled',false);
					errormsg = '开设失败';
					alert(errormsg)
				}
			})
		}
	})
	/* 教师注册 */
	$('#teacher-reg-btn').click(function(){
		let that = $(this);
		let reg_msg = {
			username: $('#teacher-reg-username').val(),
			userpwd:  $('#teacher-reg-password').val(),
			samepwd:  $('#teacher-same-password').val(),
			classnum: $('#teacher-reg-classnum').val(),
			stunum: $('#teacher-reg-stunum').val()
		}
		let errormsg;
		if(!usernameTest(reg_msg.username)){
			errormsg = '账号格式不正确';
			alert(errormsg)
		}else if(!userpwdTest(reg_msg.username)){
			errormsg = '密码格式不正确';
			alert(errormsg)
		}else if(!numberTest(reg_msg.classnum)){
			alert('班级数量需要大于0')
		}else if(!numberTest(reg_msg.stunum)){
			alert('学生数量需要大于0')
		}else if(!reg_msg.username  || !reg_msg.userpwd){
			errormsg = '账号或密码不能为空';
			alert(errormsg)
		}else if(reg_msg.userpwd !== reg_msg.samepwd){
			errormsg = '两次密码不一致';
			alert(errormsg)
		}else{
			that.attr('disabled','disabled');
			$.ajax({
				url:'/admin/teacher/register',
				type:'POST',
				data:reg_msg,
				success:function(data){
					that.attr('disabled',false);
					if(data.status == 'success'){
						alert('开设成功')
					}else{
						errormsg = data.msg;
						alert(errormsg)
					}
					
				},
				error: function(err){
					that.attr('disabled',false);
					errormsg = '开设失败';
					alert(errormsg)
				}
			})
		}
	});

	function changePwd(callback){
		$('#changeTchModal').modal('show');
		$('.tch_changepwd').click(function(){
			callback();
		})
	}
	function changeBase(callback){
		$('#changeBaseTchModal').modal('show');
		$('.tch_changebase').click(function(){
			callback();
		})
	}
	$(document).on('click','.changebase-tch',function(){
		var id = $(this).attr('tid');
		var tname = $(this).attr('tname');
		var tclass = $(this).attr('tclass');
		var tstu = $(this).attr('tstu');
		$('#tch-nickname').val(tname);
		$('#tch-classnum').val(tclass);
		$('#tch-stunum').val(tstu);
		changeBase(function(){
			var name = $('#tch-nickname').val();
			var classnum = $('#tch-classnum').val();
			var stunum = $('#tch-stunum').val();
			if(!name && !classnum && !stunum){
				alert('不能为空')
			}else if(!numberTest(classnum)){
				alert('请填写正确的班级数量')
			}else if(!numberTest(stunum)){
				alert('请填写正确的班级学生数量')
			}else{
				$.ajax({
					url:'/admin/change/tch/base',
					type:'POST',
					data:{
						id:id,
						name:name,
						classnum:classnum,
						stunum:stunum
					},
					success:function(data){
						if(data.status == 'success'){
							alert('修改成功');
							window.location.reload();
						}else{
							alert(data.msg)
						}
					},
					error:function(){
						alert('修改失败')
					}
				})
			}
		})
	});
	$(document).on('click','.changepwd-tch',function(){
		var id = $(this).attr('tid');
		changePwd(function(){
			var password = $('#tch-password').val();
			if(name && password){
				$.ajax({
					url:'/admin/change/tch/password',
					type:'POST',
					data:{
						id:id,
						password:password
					},
					success:function(data){
						if(data.status == 'success'){
							alert('修改成功');
						}else{
							alert(data.msg)
						}
					},
					error:function(){
						alert('修改失败')
					}
				})
			}else{
				alert('不能为空')
			}
		})
	});

	$(document).on('click','.delete-tch',function(){
		var id = $(this).attr('tid');
		$.ajax({
			url:'/admin/change/tch/role/fh',
			type:'POST',
			data:{
				id:id
			},
			success:function(data){
				if(data.status == 'success'){
					alert('封号成功');
					window.location.reload();
				}else{
					alert(data.msg)
				}
			},
			error:function(){
				alert('封号失败')
			}
		})
	});
	$(document).on('click','.jf-tch',function(){
		var id = $(this).attr('tid');
		$.ajax({
			url:'/admin/change/tch/role/jf',
			type:'POST',
			data:{
				id:id
			},
			success:function(data){
				if(data.status == 'success'){
					alert('解封成功');
					window.location.reload();
				}else{
					alert(data.msg)
				}
			},
			error:function(){
				alert('解封失败')
			}
		})
	});
})