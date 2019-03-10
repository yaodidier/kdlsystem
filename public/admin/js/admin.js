$(function(){
	// 首页轮播上传
	$('.banner-img-file').change(function(e){
		$(this).prev().text('')
		let vals = e.currentTarget.files[0].name;
		$(this).prev().text(vals)
	})
	$('.change-banner').click(function(){
		let _id = $(this).data('id');
		$('#banner-hidden').val(_id)
	})
	$('#add_banner').click(function(){
		$('#banner-hidden').val('new')
	})

	$('#upload-banner-img').click(function () {
		let uploadstatus = $('#banner-hidden').val();
		let filetitle = $('#image-title').val();
		let bannerurl = $('#banner-url').val();
		let files = $('#banner-img-upload')[0].files[0];

		var bannerfiles = new FormData();
		bannerfiles.append('bannerurl',bannerurl);
		bannerfiles.append('imgtitle',filetitle);
        bannerfiles.append('bannerimg', files);
        bannerfiles.append('status',uploadstatus);
		if(filetitle && files){
			$.ajax({
	        	url:'/admin/banner/uploads',
	        	type:'POST',
	        	data:bannerfiles,
	        	contentType: false,
	            processData: false,
	            cache: false,
	        	success:function(data){
	        		if(data.status == 'success'){
	        			alert('上传成功')
	        			window.location.reload()
	        		}else{
	        			alert('上传失败')
	        		}
	        		
	        	},
	        	error:function(err){
	        		alert('上传失败')
	        		console.log(err)
	        	}
	        })
		}else{
			alert('输入框不能为空')
		}
		
	})

	$('.del-banner').click(function(){
		let imgid = $(this).data('id');
		let delectalert = confirm('确认删除么？');
		if(imgid && delectalert == true){
			$.ajax({
				url:'/admin/banner/delete',
				type:'POST',
				data:{
					imgid:imgid
				},
				success:function(data){
					if(data.status == 'success'){
	        			alert('删除成功')
	        			window.location.reload()
	        		}else{
	        			alert('删除失败')
	        		}
				},error:function(err){
					console.log(err)
					alert('删除失败')
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
		if(!reg_msg.username  || !reg_msg.userpwd){
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

	$('#search-user-btn').click(function(){
		let userid = $('#search-user-id').val();
		$.ajax({
			url:'/admin/search/user',
			type:'POST',
			data:{
				userid:userid
			},
			success:function(data){
				if(data.status == 'success'){
					var userList = data.userinfo;
					let str = '';
					for(var i = 0; i < userList.length; i++){
						if(userList[i].status !== -1){
							str += '<div class="email-title"><p>用户信息显示：</p></div><div class="email"><div class="email-header"><span class="divider"></span>';
							str += '<div class="email-author">';
			                str += '<img src="'+userList[i].headimg+'" >';
			                str += '<span class="author-name">'+userList[i].nickname+'</span> <span class="author-name">注册时间：'+crtTimeFtt(userList[i].meta.createAt)+'</span>';
			                str += '<span class="email-date">';
			                str += '<a href="javascript:;" data-toggle="modal" data-target="#tsmodal" class="btn btn-success" id="ts-show-modal" uid="'+userList[i]._id+'">推送消息</a> ';
			                str += '<a href="javascript:;" class="btn btn-primary" id="reset-pwd" uid="'+userList[i]._id+'">重置密码</a> ';
			                str += '<a href="javascript:;" class="btn btn-danger user_fenhao" uid="'+userList[i]._id+'">封号</a>';
			                str += '</span></div></div></div>';
			                
		            	}else{
			            	let str = '';
							str += '<div class="email-title"><p>用户信息显示：</p></div><div class="email"><div class="email-header"><span class="divider"></span>';
							str += '<div class="email-author">';
			                str += '<img src="'+userList[i].headimg+'" >';
			                str += '<span class="author-name">'+userList[i].nickname+'</span> <span class="author-name">注册时间：'+crtTimeFtt(userList[i].meta.createAt)+'</span>';
			                str += '<span class="email-date">';
			                str += '<a href="javascript:;" class="btn btn-danger user_fenhao_jf" uid="'+userList[i]._id+'">解封</a>';
			                str += '</span></div></div></div>';
		            	}
					}
					$('#s-userinfo').html(str)
				}else{
					alert('无此用户')
				}
				
			},
			error:function(){
				alert('查询出错，请联系开发人员')
			}
		})
	})
	$('#search-user-nick').click(function(){
		let nickname = $('#search-user-nickname').val();
		$.ajax({
			url:'/admin/search/nickname',
			type:'POST',
			data:{
				nickname:nickname
			},
			success:function(data){
				if(data.status == 'success'){
					var userList = data.userinfo;
					let str = '';
					for(var i = 0; i < userList.length; i++){
						if(userList[i].status !== -1){
							str += '<div class="email-title"><p>用户信息显示：</p></div><div class="email"><div class="email-header"><span class="divider"></span>';
							str += '<div class="email-author">';
			                str += '<img src="'+userList[i].headimg+'" >';
			                str += '<span class="author-name">'+userList[i].nickname+'</span> <span class="author-name">注册时间：'+crtTimeFtt(userList[i].meta.createAt)+'</span>';
			                str += '<span class="email-date">';
			                str += '<a href="javascript:;" data-toggle="modal" data-target="#tsmodal" class="btn btn-success" id="ts-show-modal" uid="'+userList[i]._id+'">推送消息</a> ';
			                str += '<a href="javascript:;" class="btn btn-primary" id="reset-pwd" uid="'+userList[i]._id+'">重置密码</a> ';
			                str += '<a href="javascript:;" class="btn btn-danger user_fenhao" uid="'+userList[i]._id+'">封号</a>';
			                str += '</span></div></div></div>';
			                
		            	}else{
			            	let str = '';
							str += '<div class="email-title"><p>用户信息显示：</p></div><div class="email"><div class="email-header"><span class="divider"></span>';
							str += '<div class="email-author">';
			                str += '<img src="'+userList[i].headimg+'" >';
			                str += '<span class="author-name">'+userList[i].nickname+'</span> <span class="author-name">注册时间：'+crtTimeFtt(userList[i].meta.createAt)+'</span>';
			                str += '<span class="email-date">';
			                str += '<a href="javascript:;" class="btn btn-danger user_fenhao_jf" uid="'+userList[i]._id+'">解封</a>';
			                str += '</span></div></div></div>';
		            	}
					}
					$('#s-userinfo').html(str)
				}else{
					alert('无此用户')
				}
				
			},
			error:function(){
				alert('查询出错，请联系开发人员')
			}
		})
	})
	$(document).on('click','#ts-show-modal',function(){
		let userid = $(this).attr('uid');
		$('.user_tuisong').attr('uid',userid)
	})
	$(document).on('click','.user_tuisong',function(){
		let userid = $(this).attr('uid');
		let ts_title = $('#ts-title').val();
		let ts_content = $('#ts-content').val();
		if(userid && ts_title && ts_content){
			$.ajax({
				url:'/admin/tuisong/user',
				type:'POST',
				data:{
					userid:userid,
					title:ts_title,
					content:ts_content
				},
				success:function(data){
					if(data.status == 'success'){
						alert('推送成功')
						$('#tsmodal').modal('hide')
					}else{
						alert('推送失败')
					}
				},
				error:function(){
					alert('推送失败')
				}
			})
		}else{
			alert('推送不能为空')
		}
		
	})
	$(document).on('click','.user_fenhao',function(){
		let userid = $(this).attr('uid');
		$.ajax({
			url:'/admin/fenhao/user',
			type:'POST',
			data:{
				userid:userid
			},
			success:function(data){
				if(data.status == 'success'){
					alert('封号成功')
				}else{
					alert('封号失败')
				}
				
			},
			error:function(){
				alert('封号失败')
			}
		})
	})

	$(document).on('click','.user_fenhao_jf',function(){
		let userid = $(this).attr('uid');
		$.ajax({
			url:'/admin/jiefenhao/user',
			type:'POST',
			data:{
				userid:userid
			},
			success:function(data){
				if(data.status == 'success'){
					alert('解封成功')
				}else{
					alert('解封失败')
				}
				
			},
			error:function(){
				alert('解封失败')
			}
		})
	})

	function crtTimeFtt(val, row) {
	    if (val != null) {
            var date = new Date(val);
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	    }
	}


	$('#ts-all').click(function(){
		let title = $('#ts-all-title').val();
		let content =$('#ts-all-content').val();
		if(title && content){
			$.ajax({
				url:'/admin/tuisong/all',
				type:'POST',
				data:{
					title:title,
					content:content
				},
				success:function(data){
					if(data.status == 'success'){
						alert('推送成功')
					}else{
						alert('推送失败')
					}
				},
				error:function(){
					alert('推送失败')
				}
			})
		}else{
			alert('输入框不能为空')
		}
	})

	//上传视频
	$('#admin-lesson-btn').click(function(){
		let id = $('#admin-lesson-id').val();
		let oldcovers = $('#admin-lesson-oldcovers').val();
		let title = $('#admin-lesson-title').val();
		let abstract = $('#admin-lesson-abstract').val();
		let knowsome = $('#admin-lesson-knowsome').val();
		let learnsome = $('#admin-lesson-learnsome').val();
		let src = $('#admin-lesson-src').val();
		let covers = $('#admin-lesson-cover')[0].files[0];
		console.log(covers)

		let videofiles = new FormData();
		if(id){
			videofiles.append('id',id);
		}else{
			videofiles.append('id','new');
		}
		videofiles.append('oldcovers',oldcovers);
		videofiles.append('title',title);
		videofiles.append('abstract',abstract);
        videofiles.append('knowsome', knowsome);
        videofiles.append('learnsome',learnsome);
        videofiles.append('src',src);
        videofiles.append('videocovers',covers);
		if(covers){
			$.ajax({
	        	url:'/admin/lesson/video',
	        	type:'POST',
	        	data:videofiles,
	        	contentType: false,
	            processData: false,
	            cache: false,
	        	success:function(data){
	        		if(data.status == 'success'){
	        			alert('上传成功')
	        			window.location.href = '/admin/lesson'
	        		}else{
	        			alert('上传失败')
	        		}
	        		
	        	},
	        	error:function(err){
	        		alert('上传失败')
	        		console.log(err)
	        	}
	        })
		}else{
			alert('封面不能为空')
		}
	});
	//视频删除
	$('.del-video-btn').click(function(){
		let lid = $(this).data('id');
		let coversname = $(this).attr('covers');
		let delectalert = confirm('确认删除么？');
		if(lid && coversname && delectalert == true){
			$.ajax({
				url:'/admin/lessons/delete',
				type:'POST',
				data:{
					lid:lid,
					coversname:coversname
				},
				success:function(data){
					if(data.status == 'success'){
	        			alert('删除成功')
	        			window.location.reload()
	        		}else{
	        			alert('删除失败')
	        		}
				},error:function(err){
					console.log(err)
					alert('删除失败')
				}
			})
		}
	})
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

	//查询作品
	$('#search-work-btn').click(function(){
		let workid = $('#search-work-id').val();
		if(workid){
			$.ajax({
				url:'/admin/search/work',
				type:'POST',
				data:{
					wid:workid
				},
				success:function(data){
					if(data.status == 'success'){
						let str = '';
						str += '<div class="email-title"><p>作品信息显示：</p></div><div class="email"><div class="email-header"><span class="divider"></span>';
						str += '<div class="email-author">';
		                str += '<span class="author-name">作品名称：'+data.works.title+'</span>';
		                str += '<span class="email-date">';
		                str += '<a href="javascript:;" class="btn btn-danger" id="works-delete-btn" wid="'+data.works._id+'">删除</a>';
		                str += '</span></div></div></div>';
		                $('#s-workinfo').html(str)
					}else{
						alert(data.msg)
					}
				},
				error:function(){
					alert('查询出错，请联系开发人员')
				}
			})
		}else{
			alert('请填写作品ID')
		}
		
	})
	//作品删除
	$(document).on('click','#works-delete-btn',function(){
		let wid = $(this).attr('wid');
		let deletealert = confirm('确认删除么？');
		if(wid && deletealert == true){
			$.ajax({
				url:'/admin/works/delete',
				type:'POST',
				data:{
					wid:wid
				},
				success:function(data){
					if(data.status == 'success'){
	        			alert('删除成功')
	        		}else{
	        			alert('删除失败')
	        		}
				},error:function(err){
					console.log(err)
					alert('删除失败')
				}
			})
		}else{
			alert('删除失败')
		}
	})

	//删除被举报评论
	$(document).on('click','.delete-tip-com',function(){
		let type = $(this).data('qf');
		let diff = $(this).data('diff');
		let cid = $(this).attr('cid');
		let tid = $(this).attr('comid');
		let tipid = $(this).attr('tipid');
		let deletealert = confirm('确认删除么？');
		if(type == 'user' && diff == 'f' && deletealert == true){
			$.ajax({
				url:'/admin/delete/ucomment/f',
				type:'POST',
				data:{
					types:'fucom',
					cid:cid,
					tipid:tipid
				},
				success:function(data){
					if(data.status == 'success'){
						alert('删除成功')
						window.location.reload();
					}else{
						alert('删除失败')
					}
				},
				error:function(){
					alert('删除失败')
				}
			})
		}else if(type == 'user' && diff == 's' && deletealert == true){
			$.ajax({
				url:'/admin/delete/ucomment/s',
				type:'POST',
				data:{
					types:'sucom',
					cid:cid,
					tid:tid,
					tipid:tipid
				},
				success:function(data){
					if(data.status == 'success'){
						alert('删除成功')
						window.location.reload();
					}else{
						alert('删除失败')
					}
				},
				error:function(){
					alert('删除失败')
				}
			})
		}else if(type == 'work' && diff == 'f' && deletealert == true){
			$.ajax({
				url:'/admin/delete/wcomment/f',
				type:'POST',
				data:{
					types:'fwcom',
					cid:cid,
					tipid:tipid
				},
				success:function(data){
					if(data.status == 'success'){
						alert('删除成功')
						window.location.reload();
					}else{
						alert('删除失败')
					}
				},
				error:function(){
					alert('删除失败')
				}
			})
		}else if(type == 'work' && diff == 's' && deletealert == true){
			$.ajax({
				url:'/admin/delete/wcomment/s',
				type:'POST',
				data:{
					types:'swcom',
					cid:cid,
					tid:tid,
					tipid:tipid
				},
				success:function(data){
					if(data.status == 'success'){
						alert('删除成功')
						window.location.reload();
					}else{
						alert('删除失败')
					}
				},
				error:function(){
					alert('删除失败')
				}
			})
		}else if(type == 'lesson' && diff == 'f' && deletealert == true){
			$.ajax({
				url:'/admin/delete/lcomment/f',
				type:'POST',
				data:{
					types:'flcom',
					cid:cid,
					tipid:tipid
				},
				success:function(data){
					if(data.status == 'success'){
						alert('删除成功')
						window.location.reload();
					}else{
						alert('删除失败')
					}
				},
				error:function(){
					alert('删除失败')
				}
			})
		}else if(type == 'lesson' && diff == 's' && deletealert == true){
			$.ajax({
				url:'/admin/delete/lcomment/s',
				type:'POST',
				data:{
					types:'slcom',
					cid:cid,
					tid:tid,
					tipid:tipid
				},
				success:function(data){
					if(data.status == 'success'){
						alert('删除成功')
						window.location.reload();
					}else{
						alert('删除失败')
					}
				},
				error:function(){
					alert('删除失败')
				}
			})
		}
	})

	//作品举报处理完成
	$(document).on('click','.change-tip-status',function(){
		let wid = $(this).data('id');
		let types = $(this).attr('qf');
		let Dalert = confirm('确认处理了么？');
		if(wid && Dalert == true){
			if(types == 'work'){
				$.ajax({
					url:'/admin/tips/work/done',
					type:'POST',
					data:{
						wid:wid
					},
					success:function(data){
						if(data.status == 'success'){
		        			alert('状态修改成功')
		        			window.location.reload()
		        		}else{
		        			alert('状态修改失败')
		        		}
					},error:function(err){
						console.log(err)
						alert('状态修改失败')
					}
				})
			}else{
				$.ajax({
					url:'/admin/tips/user/done',
					type:'POST',
					data:{
						wid:wid
					},
					success:function(data){
						if(data.status == 'success'){
		        			alert('状态修改成功')
		        			window.location.reload()
		        		}else{
		        			alert('状态修改失败')
		        		}
					},error:function(err){
						console.log(err)
						alert('状态修改失败')
					}
				})
			}
			
		}
	});
	$(document).on('click','#reset-pwd',function(){
		let uid = $(this).attr('uid')
		let delectalert = confirm('确认重置么？重置后新密码为：111111');
		if(uid && delectalert == true){
			$.ajax({
				url:'/admin/change/user/pwd',
				type:'POST',
				data:{
					uid:uid
				},
				success:function(data){
					if(data.status == 'success'){
	        			alert('重置成功，新密码为：111111')
	        		}else{
	        			alert('重置失败')
	        		}
				},error:function(err){
					console.log(err)
					alert('重置失败')
				}
			})
		}
	});
	//教师
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
