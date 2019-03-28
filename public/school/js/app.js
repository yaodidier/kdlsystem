;(function($) {
	//全局
	var xuLoader = $('.xu-loader');
	var notable = $('.notable');
	var userappId = $('#user-ske-1').val();
	//方法
	function xuLoaderHide(){
		setTimeout(function(){
			xuLoader.hide();
		},150)
	}
	//全选控件
	$(document).on('click','input[name="selectall"]',function(){
		if($(this).is(':checked')){
			$('input[name="stuCheckBox"]').each(function(){
				$(this).prop("checked",true);
			});
		}else{
			$('input[name="stuCheckBox"]').each(function(){
				$(this).removeAttr("checked",false);
			});
		}
	});
	$(document).on('click','input[name="stuCheckBox"]',function(){
		$('input[name="selectall"]').removeAttr("checked",false);
	});
	//输入错误提示
	function errNoticeDiv(isdisplay,dom,msg){
		if(isdisplay){
			dom.after('<div class="invalid-feedback">'+msg+'</div>');
		}else{
			dom.parent().find('.invalid-feedback').remove()
		}
	}
	//弹窗错误提示
	function errNoticeModal(msg){
		$('.notice-cont-err').text(msg);
		$('#errNoticeModal').show();
		setTimeout(function(){
			$('#errNoticeModal').hide();
		},2000)
	}
	//弹窗成功提示
	function sugNoticeModal(msg){
		$('.notice-cont-sug').text(msg);
		$('#sugNoticeModal').show();
		setTimeout(function(){
			$('#sugNoticeModal').hide();
		},2000)
	}
	//table 表格数据序号重新排列
	function reOrderTable(){
		$('.xu-table .order').each(function(index){
			var orderNum = index + 1;
			$(this).text(orderNum)
		})
	}
	//创建班级
	$('#create-klass-btn').click(function(){
		var classLength = $('table tbody tr').length;
		var classDom = $('#new-class-name');
		var className = $('#new-class-name').val();
		if(className && className !== ''){
			xuLoader.show();
			$.ajax({
				url:'/klass/new',
				type:'POST',
				data:{
					klassname:className
				},
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						$('#newClass').modal('hide');
						$('#newClassStudent').modal('show');
						notable.remove();
						var tabledata = data.msg;
						$('#classupId').val(tabledata._id);
						var str = '';
						str += '<tr>';
						str += '<td class="order">1</td>';
						str += '<td>'+ tabledata.classname +'</td>';
						str += '<td>'+ tabledata.invitecode +'</td>';
						str += '<td>'+ tabledata.time +'</td>';
						str += '<td>'+ tabledata.total +'</td>';
						str += '<td class="opt">';
						str += '<span class="editclass" data-id="'+ tabledata._id +'" data-name="'+ tabledata.classname +'">编辑</span>';
						str += '<i class="split">|</i>';
						str += '<a href="/school/student?classid='+tabledata._id+'" class="check">查看</a>';
						str +=	'</tr>';
						$('.xu-table').find('tbody').prepend(str);
						reOrderTable();
					}else{
						classDom.addClass('is-invalid');
						errNoticeDiv(true, classDom, data.msg);
					}
				},
				error:function(data){
					xuLoaderHide();
					errNoticeModal('创建失败');
				}
			})
		}else{
			classDom.addClass('is-invalid');
			errNoticeDiv(true, classDom, '*班级名称不能为空');
		}
	})
	$('.modal-form-control').focus(function(){
		$(this).removeClass('is-invalid');
		errNoticeDiv(false, $(this));
	})
	$('.classmodal').on('hidden.bs.modal', function (e) {
	  $('.modal-form-control').removeClass('is-invalid');
			errNoticeDiv(false, $('.modal-form-control'));
			$('.modal-form-control').val('');
	})
	//修改班级名称
	$(document).on('click', '.editclass', function(){
		var changeDom = $(this).parent().parent()
		changeDom.addClass('isclicked').siblings().removeClass('isclicked');
		var classId = $(this).data('id');
		var classname = $('.isclicked').find('.classname').text();
		$('#change-class-id').val(classId);
		$('#change-class-name').val(classname);
		$('#changeClass').modal('show');
	})
	$('#change-klass-btn').click(function(){
		var _classId = $('#change-class-id').val();
		var _newclassname = $('#change-class-name');
		var _newVal = $('#change-class-name').val();
		if(_classId && _newVal && _newVal !== ''){
			xuLoader.show();
			$.ajax({
				url:'/klass/changename',
				type:'POST',
				data:{
					klassid:_classId,
					klassname:_newVal
				},
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						$('.isclicked').find('.classname').text(data.msg)
						$('#changeClass').modal('hide');
						sugNoticeModal('修改成功');
					}else{
						_newclassname.addClass('is-invalid');
						errNoticeDiv(true, _newclassname, data.msg);
					}
				},
				error:function(){
					xuLoaderHide();
					errNoticeModal('修改失败');
				}
			})
		}else{
			_newclassname.addClass('is-invalid');
			errNoticeDiv(true, _newclassname, '*请填写班级名称');
		}
	});

	//删除班级
	$('#delete-class').click(function(){
		var _classId = $('#change-class-id').val();
		var delectalert = confirm('确认删除么？');
		if(_classId && delectalert == true){
			xuLoader.show();
			$.ajax({
				url:'/klass/delete',
				type:'POST',
				data:{
					klassid:_classId
				},
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						$('.isclicked').remove();
						reOrderTable()
						$('#changeClass').modal('hide');
						sugNoticeModal('删除成功');
					}else{
						errNoticeModal(data.msg);
					}
				},
				error:function(){
					xuLoaderHide();
					errNoticeModal('删除失败');
				}
			})
		}
	})
	//上传学生表
	$('#upload').change(function(){
		var files = $(this)[0].files[0];
		var classid = $('#classupId').val();
		var xlsfiles = new FormData();
		xlsfiles.append('classid',classid);
    xlsfiles.append('xlsfile', files);
		if(classid && files){
			xuLoader.show();
			$.ajax({
	    	url:'/student/add',
	    	type:'POST',
	    	data:xlsfiles,
	    	contentType: false,
        processData: false,
        cache: false,
	    	success:function(data){
	    		xuLoaderHide();
	    		$('#newClassStudent').modal('hide');
	    		if(data.status == 'success'){
	    			window.location.href="/school/student?classid="+classid;
	    		}else{
	    			errNoticeModal(data.msg);
	    		}
	    	},
	    	error:function(err){
	    		xuLoaderHide();
	    		errNoticeModal(data.msg);
	    	}
	    })
		}else{
			errNoticeModal('请添加Excel');
		}
	});
	//给学生备注 & 发消息
	$(document).on('click','.editstu', function(){
		$('#pubstuModal .modal-title').text('添加学生备注');
		$('#pubstuModal').modal('show');
		$('#def-control').val('editstu');
		var uid = $(this).parent().attr('uid');
		$('#getstuId').val(uid)
	});
	$(document).on('click','.noticestu', function(){
		$('#pubstuModal .modal-title').text('给学生推送消息');
		$('#pubstuModal').modal('show');
		$('#def-control').val('noticestu');
		var uid = $(this).parent().attr('uid');
		$('#getstuId').val(uid)
	});
	$('#control-stu-btn').click(function(){
		var stuid = $('#getstuId').val();
		var types = $('#def-control').val();
		var remarks = $('#stutextarea');
		var remarksVal = remarks.val();
		if(stuid && remarksVal){
			xuLoader.show();
			if(types == 'editstu'){
				$.ajax({
		    	url:'/student/edit',
		    	type:'POST',
		    	data:{
		    		uid:stuid,
		    		remarks:remarksVal
		    	},
		    	success:function(data){
		    		xuLoaderHide();
		    		$('#pubstuModal').modal('hide');
		    		if(data.status == 'success'){
		    			window.location.reload()
		    		}else{
		    			errNoticeModal('操作失败');
		    		}
		    	},
		    	error:function(err){
		    		xuLoaderHide();
		    		errNoticeModal('操作失败');
		    	}
		    })
	    }
		}else{
			remarks.addClass('is-invalid');
			errNoticeDiv(true, remarks, '*不能为空');
		}
	})
	//重置密码
	$(document).on('click','.resetstupwd', function(){
		var uid = $(this).parent().attr('uid');
		var conalert = confirm('确认重置么？ 重置之后密码：111222');
		if(conalert == true){
			$.ajax({
	    	url:'/student/reset/pwd',
	    	type:'POST',
	    	data:{
	    		uid:uid
	    	},
	    	success:function(data){
	    		xuLoaderHide();
	    		if(data.status == 'success'){
	    			sugNoticeModal('重置成功');
	    		}else{
	    			errNoticeModal('操作失败');
	    		}
	    	},
	    	error:function(err){
	    		xuLoaderHide();
	    		errNoticeModal('操作失败');
	    	}
	    })
		}
	});
	//移除班级
	$(document).on('click','.removestu', function(){
		var uid = $(this).parent().attr('uid');
		var cid = $('#classupId').val();
		var conalert = confirm('确认移除此学生么？');
		if(conalert == true){
			$.ajax({
	    	url:'/student/removestu',
	    	type:'POST',
	    	data:{
	    		uid:uid,
	    		cid:cid
	    	},
	    	success:function(data){
	    		xuLoaderHide();
	    		if(data.status == 'success'){
	    			sugNoticeModal('移除成功');
	    			window.location.reload();
	    		}else{
	    			errNoticeModal('操作失败');
	    		}
	    	},
	    	error:function(err){
	    		xuLoaderHide();
	    		errNoticeModal('操作失败');
	    	}
	    })
		}
	});
	//删除账号
	$(document).on('click','.deletestu', function(){
		var uid = $(this).parent().attr('uid');
		var cid = $(this).parent().parent().find('.spanclass').attr('cid');
		if(!cid){
			cid = 'noclass'
		};
		var conalert = confirm('确认删除此学生么？ 删除将无法恢复');
		if(conalert == true){
			$.ajax({
		    	url:'/student/delete/stu',
		    	type:'POST',
		    	data:{
		    		uid:uid,
		    		cid:cid
		    	},
		    	success:function(data){
		    		xuLoaderHide();
		    		if(data.status == 'success'){
		    			sugNoticeModal('删除成功');
		    			window.location.reload()
		    		}else{
		    			errNoticeModal('操作失败');
		    		}
		    	},
		    	error:function(err){
		    		xuLoaderHide();
		    		errNoticeModal('操作失败');
		    	}
		    })
		}
	});
	//班级内删除学生账号
	function getURLtype(variable)
	{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
	}
	$(document).on('click','.deletestu-class', function(){
		var uid = $(this).parent().attr('uid');
		var cid = getURLtype('classid');
		if(!cid){
			cid = 'noclass'
		};
		var conalert = confirm('确认删除此学生么？ 删除将无法恢复');
		if(conalert == true){
			$.ajax({
		    	url:'/student/delete/stu',
		    	type:'POST',
		    	data:{
		    		uid:uid,
		    		cid:cid
		    	},
		    	success:function(data){
		    		xuLoaderHide();
		    		if(data.status == 'success'){
		    			sugNoticeModal('删除成功');
		    			window.location.reload()
		    		}else{
		    			errNoticeModal('操作失败');
		    		}
		    	},
		    	error:function(err){
		    		xuLoaderHide();
		    		errNoticeModal('操作失败');
		    	}
		    })
		}
	});
	//搜索学生s
	$(document).on('click','#search-stu-btn', function(){
		var stuname = $('#search-stu-input').val();
		if(stuname){
			window.location.href='/searchstu?wd='+stuname;
		}else{
			errNoticeModal('请输入学生姓名');
		}
	});
	$('.choose-stu-ul li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		var index = $(this).index();
		$('.show-stu-div').eq(index).addClass('active').siblings().removeClass('active');
		$('.show-stu-span').eq(index).addClass('active').siblings().removeClass('active');
	})
	$('#addstuin').click(function(){
		xuLoader.show();
		$('#classUl').html('');
		$.ajax({
	  	url:'/class/all',
	  	type:'GET',
	  	success:function(data){
	  		xuLoaderHide();
	  		let thisclass = $('#classupId').val();
	  		if(data.status == 'success'){
	  			var classList = data.classlist;
	  			for(var i = 0; i < classList.length; i++){
	  				if(classList[i]._id == thisclass){
	  					$('#thisclassname span').text(classList[i].classname)
	  				}else{
	  					$('#classUl').append('<li cid="'+classList[i]._id+'">'+classList[i].classname+'</li>')
	  				}
	  			}
	  		}else{
	  			errNoticeModal(data.msg);
	  		}
	  	},
	  	error:function(err){
	  		xuLoaderHide();
	  		errNoticeModal('操作失败');
	  	}
	  })
	});

	$(document).on('click','.all-class-list li', function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('#noclass-stu').removeClass('active');
		var cid = $(this).attr('cid');
		xuLoader.show();
		$('.stu-list-msg').hide();
		$('#stuUl').html('');
		$.ajax({
	  	url:'/class/students',
	  	type:'POST',
	  	data:{
	  		classid:cid
	  	},
	  	success:function(data){
	  		xuLoaderHide();
	  		if(data.status == 'success'){
	  			var stuList = data.stulist;
	  			if(stuList.length > 0){
	  				$('#stuUl').append('<li><label><input type="checkbox" name="selectall"/>全选</label></li>')
	  				for(var i = 0; i < stuList.length; i++){
		  				$('#stuUl').append('<li><label><input type="checkbox" sid="'+stuList[i]._id+'" name="stuCheckBox"/>'+stuList[i].nickname+'<span>备注：'+stuList[i].remark+'</span></label></li>')
		  			}
	  			}else{
	  				$('.stu-list-msg')
	  				.text('该班级没有学生')
	  				.show()
	  			}
	  		}else{
	  			errNoticeModal(data.msg);
	  		}
	  	},
	  	error:function(err){
	  		xuLoaderHide();
	  		errNoticeModal('操作失败');
	  	}
	  })
	});

	//添加现有学生
	$('#addoldstu').click(function(){
		var addstuList = [];
		var classid = $('#classupId').val();
		$('#stuUl li input[name="stuCheckBox"]:checked').each(function(){
			addstuList.push($(this).attr('sid'))
		});
		if(classid && addstuList.length > 0){
			let _addstuList = addstuList.join('-');
			xuLoader.show();
			$.ajax({
		  	url:'/add/oldstu',
		  	type:'POST',
		  	data:{
		  		classid:classid,
		  		stulist:_addstuList
		  	},
		  	success:function(data){
		  		xuLoaderHide();
		  		if(data.status == 'success'){
		  			window.location.href = '/school/student?classid='+classid;
		  		}else{
		  			errNoticeModal(data.msg);
		  		}
		  	},
		  	error:function(err){
		  		xuLoaderHide();
		  		errNoticeModal('操作失败');
		  	}
		  })
		}else{
			errNoticeModal('请选择学生');
		}
	});
	//导出学生信息
	$('#output-stumsg').click(function(){
		var classid = $('#classupId').val();
		if(classid){
			xuLoader.show();
			$.ajax({
		  	url:'/download/stumsg',
		  	type:'POST',
		  	data:{
		  		classid:classid
		  	},
		  	success:function(data){
		  		xuLoaderHide();
		  		if(data.status == 'success'){
		  			window.location.href = data.msg;
		  		}else{
		  			errNoticeModal(data.msg);
		  		}
		  	},
		  	error:function(err){
		  		xuLoaderHide();
		  		errNoticeModal('操作失败');
		  	}
		  })
		}else{
			errNoticeModal('操作失败');
		}
	});
	$('#noclass-stu').click(function(){
		$(this).addClass('active');
		$('.all-class-list li').removeClass('active');
		xuLoader.show();
		$('.stu-list-msg').hide();
		$('#stuUl').html('');
		$.ajax({
	  	url:'/noclass/students',
	  	type:'GET',
	  	success:function(data){
	  		xuLoaderHide();
	  		if(data.status == 'success'){
	  			var stuList = data.stulist;
	  			if(stuList.length > 0){
	  				$('#stuUl').append('<li><label><input type="checkbox" name="selectall"/>全选</label></li>')
	  				for(var i = 0; i < stuList.length; i++){
		  				$('#stuUl').append('<li><label><input type="checkbox" sid="'+stuList[i]._id+'" name="stuCheckBox"/>'+stuList[i].nickname+'<span>备注：'+stuList[i].remark+'</span></label></li>')
		  			}
	  			}else{
	  				$('.stu-list-msg')
	  				.text('#没有学生')
	  				.show()
	  			}
	  		}else{
	  			errNoticeModal(data.msg);
	  		}
	  	},
	  	error:function(err){
	  		xuLoaderHide();
	  		errNoticeModal('操作失败');
	  	}
	  })
	});
	function testTaksForm(btntype,taskid){
		var reg=/^[1-9]+\d*$/;
		var taskenddataVal = $('#enddata');
		var taskendtimeVal = $('#endtime');
		var endtime = taskenddataVal.val() +' '+taskendtimeVal.val();
		var widlist = [], classlist = [];
		$('.xu-table input[name="stuCheckBox"]:checked').each(function(index){
			var ciditem = {
				classid:$(this).attr('cid')
			};
			classlist.push(ciditem);
		});
		$('.form-template-list .template-item').each(function(index){
			var widitem = {
				workid: $(this).attr('wid')
			};
			widlist.push(widitem);
		});
		var tasktitle = $('#task-title');
		var taskcontent = $('#task-content');
		var taskvideo = $('#task-video');
		var taskworkNum = $('#task-workNum');

		var newTask = {
			btntype:btntype,
			types: $('.radio-inline input[name="worktypeOptions"]:checked').val(),
			title:tasktitle.val(),
			content: taskcontent.val(),
			workNum: taskworkNum.val(),
			video: taskvideo.val(),
			endtime:endtime,
			widlist:widlist,
			classlist:classlist
		}
		var _newTask = JSON.stringify(newTask);
		if(!newTask.types){
			errNoticeModal('请选择作业类型');
			return false;
		}else if(!newTask.title){
			tasktitle.addClass('is-invalid');
			errNoticeDiv(true, tasktitle, '*请填写作业名称');
			errNoticeModal('请填写作业名称');
			return;
		}else if(!newTask.content){
			taskcontent.addClass('is-invalid');
			errNoticeDiv(true, taskcontent, '*请填写作业要求');
			errNoticeModal('请填写作业要求');
			return;
		}else if(!newTask.video){
            taskvideo.addClass('is-invalid');
            errNoticeDiv(true, taskvideo, '*请填写教学视频');
            errNoticeModal('请填写教学视频');
            return;
        }else if(!reg.test(newTask.workNum)){
			taskworkNum.addClass('is-invalid');
			errNoticeDiv(true, taskworkNum, '*填写的作品数量有误');
			errNoticeModal('填写的作品数量有误');
			return;
		}else if(!taskenddataVal.val()){
			taskenddataVal.addClass('is-invalid');
			errNoticeDiv(true, taskendtimeVal, '*请填写截止时间');
			errNoticeModal('请填写截止时间');
			return;
		}else if(!taskendtimeVal.val()){
			taskendtimeVal.addClass('is-invalid');
			errNoticeDiv(true, taskendtimeVal, '*请填写截止时间');
			errNoticeModal('请填写截止时间');
			return;
		}else if(!newTask.classlist || newTask.classlist.length == 0){
			errNoticeModal('请选择班级');
			return;
		}else{
			xuLoader.show();
			if(taskid){
				$.ajax({
			  	url:'/task/released/change',
			  	type:'POST',
			  	data:{
			  		tid:taskid,
			  		task:_newTask
			  	},
			  	success:function(data){
			  		xuLoaderHide();
			  		if(data.status == 'success'){
			  			sugNoticeModal('发布成功');
			  			window.location.href = '/school/task'
			  		}else{
			  			errNoticeModal(data.msg);
			  		}
			  	},
			  	error:function(err){
			  		xuLoaderHide();
			  		errNoticeModal('操作失败');
			  	}
			  })
			}else{
				$.ajax({
			  	url:'/task/released',
			  	type:'POST',
			  	data:{
			  		task:_newTask
			  	},
			  	success:function(data){
			  		xuLoaderHide();
			  		if(data.status == 'success'){
			  			sugNoticeModal('发布成功');
			  			window.location.href = '/school/task'
			  		}else{
			  			errNoticeModal(data.msg);
			  		}
			  	},
			  	error:function(err){
			  		xuLoaderHide();
			  		errNoticeModal('操作失败');
			  	}
			  })
			}
		}
	};
	$('#release-task').click(function(){
		$('.modal-form-control').removeClass('is-invalid');
		errNoticeDiv(false, $('.modal-form-control'));
		testTaksForm(0)
	});
	$('#release-task-edit').click(function(){
		let tid = $(this).attr('tid');
		$('.modal-form-control').removeClass('is-invalid');
		errNoticeDiv(false, $('.modal-form-control'));
		testTaksForm(0,tid)
	});

	//选择模板
	$('#add-works-modal').click(function(){
		var temList = [];
		xuLoader.show();
		$('.form-template-list .form-template').each(function(){
			temList.push($(this).attr('wid'))
		})
		$.ajax({
			url:'/school/scratch/tchwork/get',
			type:'GET',
			success:function(data){
				xuLoaderHide();
				if(data.status == 'success'){
					var str = '';
					var worksdata = data.msg;
					if(worksdata.length > 0){
						for(var i = 0; i < worksdata.length; i++){
							let _isin = temList.indexOf(worksdata[i]._id);
							if(_isin == -1){
								str += '<div class="wrok-card-modal canchecked" wid="'+worksdata[i]._id+'">';
					      str += '<img src="/unreleased/covers/'+ worksdata[i].covers +'">';
					      str += '<p>'+ worksdata[i].title +'</p>';
					      str += '<i class="icon iconfont icon-yuanxingxuanzhongfill"></i>';
					    	str += '</div>';
							}else{
								str += '<div class="wrok-card-modal disabled" wid="'+worksdata[i]._id+'">';
					      str += '<img src="/unreleased/covers/'+ worksdata[i].covers +'">';
					      str += '<p>'+ worksdata[i].title +'</p>';
					      str += '<i class="icon iconfont icon-yuanxingxuanzhongfill"></i>';
					    	str += '</div>';
							}
						}
					}else{
						str += '<div class="notable"><i class="icon iconfont icon-Null-data"></i> 您还没有模板，<a href="/scratch" target="_blank" style="color: #2aa0fd">去创建</a></div>'
					}
					$('#work-modal-list').html(str);
					$('#chooseWorkModal').modal('show')
				}else{
					errNoticeModal('获取失败')
				}
			},
			error:function(){
				errNoticeModal('获取失败')
			}
		})

	})
	$(document).on('click','#work-modal-list .wrok-card-modal.canchecked', function(){
		$(this).toggleClass('checked')
	})

	$('#choose-workmodal-btn').click(function(){
		var str = '';
		$('.wrok-card-modal.checked').each(function(){
			str += '<div class="form-template template-item" wid="'+ $(this).attr('wid') +'">';
			str += '<img src="'+ $(this).find('img').attr('src') +'">';
	    str += '<p>'+ $(this).find('p').text() +'</p><i class="icon iconfont icon-shanchu"></i>';
			str += '</div>';
		})
		$('.form-template-list').append(str);
		$('#chooseWorkModal').modal('hide');
	});

	$(document).on('click','.form-template-list .form-template', function(){
		$(this).remove()
	});

	//student
	//加入其他班级
	$('#jion-class-btn').click(function(){
		let bjm = $('#banjm').val();
		if(bjm){
			$.ajax({
				url:'/join/otherclass',
				type:'POST',
				data:{
					bjm:bjm
				},
				success:function(data){
					if(data.status == 'success'){
						sugNoticeModal('加入成功');
						$('#joinClass').modal('hide');
						window.location.reload()
					}else{
						errNoticeModal(data.msg)
					}
				},
				error:function(){
					errNoticeModal('操作失败')
				}
			})
		}
	});
	//学生选择作业提交
	$('#post-works-modal').click(function(){
		var temList = [];
		xuLoader.show();
		$.ajax({
			url:'/school/scratch/stuwork/get',
			type:'GET',
			success:function(data){
				xuLoaderHide();
				if(data.status == 'success'){
					var str = '';
					var worksdata = data.msg;
					if(worksdata.length > 0){
						for(var i = 0; i < worksdata.length; i++){
							str += '<div class="wrok-card-modal canchecked" covers="'+worksdata[i].covers+'" locals="'+worksdata[i].localsname+'">';
				      str += '<img src="/unreleased/covers/'+ worksdata[i].covers +'">';
				      str += '<p>'+ worksdata[i].title +'</p>';
				      str += '<i class="icon iconfont icon-yuanxingxuanzhongfill"></i>';
				    	str += '</div>';
						}
					}else{
						str += '<div class="notable"><i class="icon iconfont icon-Null-data"></i> 您还没有作品，<a href="/scratch" target="_blank" style="color: #2aa0fd">去创建</a></div>'
					}
					$('#stu-projects-list').html(str);
					$('#chooseWorkPost').modal('show')
				}else{
					errNoticeModal('获取失败')
				}
			},
			error:function(){
				xuLoaderHide();
				errNoticeModal('获取失败')
			}
		})
	});
	$('#post-project-btn').click(function(){
		xuLoader.show();
		var that = $('#stu-projects-list .checked');
		var covers = that.attr('covers');
		var localname = that.attr('locals');
		var title = that.find('p').text();
		var classlist = $('#classListVal').val();
		var taskid = $('#taskIdVal').val();
		var jobdata = {
			title:title,
			localname:localname,
			covers:covers,
			classlist:classlist,
			taskid:taskid
		}
		if(that && covers && localname && title && classlist && taskid){
			$.ajax({
				url:'/school/scratch/stuwork/post/new',
				type:'POST',
				data:jobdata,
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						sugNoticeModal('提交成功');
						window.location.reload()
					}else{
						errNoticeModal(data.msg)
					}
				},
				error:function(){
					xuLoaderHide();
					errNoticeModal('操作失败')
				}
			})
		}

	});
	$(document).on('click','#stu-projects-list .wrok-card-modal.canchecked', function(){
		$(this).addClass('checked').siblings().removeClass('checked');
	});
	// 点评
	$('.dianp-btn').click(function(){
		xuLoader.show();
		var wid = $(this).attr('wid');
		$('#pf-wrokid').val(wid);
		if(wid){
			$.ajax({
				url:'/find/workinfo',
				type:'POST',
				data:{
					wid:wid
				},
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						$('#defeninput').val(data.msg.markpoint);
						$('#xs-dropdown-bar input[name="djradio"]').removeAttr("checked",false);
						$('#xs-dropdown-bar .radio-inline').eq(data.msg.showstatus).find('input').prop("checked",true);
						$('#plnr-text').val(data.msg.py)
					}else{
						errNoticeModal(data.msg)
					}
				},
				error:function(){
					xuLoaderHide();
					errNoticeModal('获取失败')
				}
			})
		}
		$('#pfmodal-student').text($(this).attr('username'));
		$('#pfmodal-wtitle').text($(this).attr('workname'));
		$('#pingFenModal').modal('show');
	})
	$('#defeninput').blur(function(){
		var fs = $(this).val();
		var reg = /^([0-9][0-9]{0,1}|100)$/;
		if(!reg.test(fs)){
			$(this).val(90)
		}
	})
	$(document).on('click','.pyspan',function(){
		var textVal = $(this).text();
		document.getElementById('plnr-text').value += textVal;
	})
	$('#pf-workmodal-btn').click(function(){
		var reg2 = /^[0-1]*$/;
		var xstatus = parseInt($('#xs-dropdown-bar input[name="djradio"]:checked').val());
		var wid = $('#pf-wrokid').val();
		var dfnum = $('#defeninput').val();
		var dfcontent = $('#plnr-text').val();
		if(!reg2.test(xstatus)){
			errNoticeModal('请选择成绩显示方式')
		}else if(!wid){
			errNoticeModal('请选择作品')
		}else if(!dfnum){
			errNoticeModal('请填写分数')
		}else if(!dfcontent){
			errNoticeModal('请填写评语')
		}else{
			xuLoader.show();
			$.ajax({
				url:'/works/pf/post',
				type:'POST',
				data:{
					wid:wid,
					xstatus:xstatus,
					dfnum:dfnum,
					dfcont:dfcontent
				},
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						sugNoticeModal('评分成功');
						$('#pingFenModal').modal('hide');
					}else{
						errNoticeModal(data.msg);
						$('#pingFenModal').modal('hide');
					}
				},
				error:function(){
					xuLoaderHide();
					errNoticeModal('评分失败');
					$('#pingFenModal').modal('hide');
				}
			})
		}
	})
	$(document).on('click','.showpy',function(){
		xuLoader.show();
		var wid = $(this).attr('wid');
		if(wid){
			$.ajax({
				url:'/find/workinfo',
				type:'POST',
				data:{
					wid:wid
				},
				success:function(data){
					xuLoaderHide();
					if(data.status == 'success'){
						var point = data.msg.markpoint;
						var pstatus = data.msg.showstatus;
						if(pstatus == 0){
							$('#myworkscore').text(point);
						}else{
							if(0 < point < 60){
								$('#myworkscore').text('加油');
							}else if(59 < point < 70){
								$('#myworkscore').text('及格')
							}else if(69 < point < 90){
								$('#myworkscore').text('良好')
							}else if(89 < point){
								$('#myworkscore').text('优秀')
							}
						}

						$('#myworkpy').text(data.msg.py)
						$('#myworkpyMoadl').modal('show');
					}else{
						errNoticeModal(data.msg)
					}
				},
				error:function(){
					xuLoaderHide();
					errNoticeModal('获取失败')
				}
			})
		}
	});
	//个人中心
	function Zoom(obj, maxWidth, maxHeight){
		var image = new Image();
		image.src = obj;
		var Width,Height;
		if (image.width < maxWidth && image.height < maxHeight) {
            Width = maxWidth;
            Height = maxHeight;
        }
        else
        {
            if (maxWidth / maxHeight  <= image.width / image.height)
            {
                Width = maxWidth;
                Height = maxWidth * (image.height / image.width);
            }
            else {
                Width = maxHeight * (image.width / image.height);
                Height = maxHeight;
            }
        }

		image.onload = function(){
			var canvas = document.createElement("canvas");
			canvas.width = 100;
    		canvas.height = 100;
			var ctx=canvas.getContext("2d");
            ctx.drawImage(image,0,0,Width,Height);
            var newImg=new Image();
			newImg.src = canvas.toDataURL("image/png");
			newImg.id = 'headimg-div';
			var image_holder = $("#image-holder");
        	$(newImg).appendTo(image_holder);
        }
	};
	$("#fileUpload").on('change', function () {
	    if (typeof (FileReader) != "undefined") {
	        var image_holder = $("#image-holder");
	        image_holder.empty();
	        var reader = new FileReader();
	        reader.onload = function (e) {
	        	Zoom(e.target.result,100,100)
	        }
	        image_holder.show();
	        reader.readAsDataURL($(this)[0].files[0]);
	    } else {
	        errNoticeModal("你当前浏览器不支持头像上传，请升级或更换。");
	    }
	});
	$('#user-msg-btn').click(function () {
		let setting_msg = {
			headimg: $('#image-holder img').attr('src'),
			nickname: $('#set_nickname').val(),
			realname: $('#set_realname').val()
		}
		if(!setting_msg.headimg || !setting_msg.nickname){
			showNoteModal('昵称不能为空')
			return false;
		}else{
			$.ajax({
				url: '/userinfo/change',
				type:"POST",
				data:setting_msg,
				success:function (data){
					if(data.status == 'success'){
						sugNoticeModal(data.msg)
					}else{
						errNoticeModal('修改失败')
					}
				},
				err:function(){
					errNoticeModal('修改失败')
				}
			})
		}
	});
	//修改密码
	$('#change-pwd-btn').click(function(){
		var oldpwd = $('#oldpwd').val();
		var newpwd = $('#newpwd').val();
		var samnewpwd = $('#samnewpwd').val();
		if(!oldpwd || !newpwd || !samnewpwd){
			errNoticeModal('输入框不能为空');
		}else if(newpwd !== samnewpwd){
			errNoticeModal('两次密码不一致');
		}else{
			$.ajax({
				url: '/change/password',
				type:"POST",
				data:{
					oldpwd:oldpwd,
					newpwd:newpwd
				},
				success:function (data){
					if(data.status == 'success'){
						sugNoticeModal(data.msg);
						$('#changepwdModal').modal('hide')
					}else{
						errNoticeModal(data.msg)
					}
				},
				err:function(){
					errNoticeModal('修改失败')
				}
			})
		}


	})
})(jQuery);
