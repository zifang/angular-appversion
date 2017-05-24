'use strict';

eartyApp.controller('verAddCtrl',function($scope,$http,$location,baseUrl){
	var _t = "";
	if($location.search().t){
		_t = $location.search().t;
	}
	$scope.t = _t;
	$scope.version = "";
	// 下拉框的数据赋值
	$scope.appids=[
		{id:1,name:'云小二'},
		{id:2,name:'云掌柜'},
		{id:3,name:'快餐版云小二'}

	]
	//更新类型
	$scope.updateTypes = [
		{id:1,name:'强制更新'},
		{id:2,name:'选择性更新'}
	]
	//系统名称
	$scope.systemids = [
		{id:1,name:'IOS'},
		{id:2,name:'Andorid'}
	]
	//判断权限问题
	$http({
		type:'get',
		params:{t:_t},
		url:baseUrl+'/webapi/isLogin'
	}).success(function(res){
		if(res.code==999){//code:999时跳转到登录地址，否则进入页面
			location.href=res.message;
			// window.location.href="http://localhost:8099/#/index?t=acc8d2b6-88eb-4d31-b799-07b2a5d1386a";
		}else{
			//初始化默认版本号
			$scope.validateOs(1,1);
		}
	});
	//select的事件 根据选择的系统名称获取版本号
	$scope.validateOs = function(os,appid){
		$http({
			type:'get',
			params:{os:os,appid:appid,t:_t},
			url:baseUrl+'/webapi/queryAppUpdateByOs'
		}).success(function(res){
			if(res.code==200){
				$scope.version = res.model;
				if($scope.version){
					$scope.updateVersion = Math.floor($scope.version.split(".")[0]);
					$scope.updateVersion1 = Math.floor($scope.version.split(".")[1]);
					$scope.updateVersion2 = Math.floor($scope.version.split(".")[2]);
				}
			}else{
				alert(res.message);
			}
		}).error(function(res){
			console.log("请求失败");
		});
	}
	
	$scope.save = function(){
		//表单数据
		$scope.formData = {
			appid:$scope.appid,
			updateType:$scope.updateType,
			os:$scope.os,
			updateVersion:$scope.updateVersion + "." + $scope.updateVersion1 + "." + $scope.updateVersion2,
			updateContent:$scope.updateContent,
			activity:$scope.activity==undefined?"1":$scope.activity,
			url:$scope.url,
			t:_t
		}
		//json表单数据
		// console.log($scope.formData);
		//验证通过
		if($scope.myForm.$valid){
			$http({
				method:'post',
				params:$scope.formData,
				url:baseUrl+'/webapi/createAppUpdate'
			}).success(function(res){
				if(res.code==200){
					alert("添加成功");
					//清空表单
					window.location.reload();
				}else{
					alert(res.message);
				}
			}).error(function(res){
				alert("请求失败");
			});
		}else{
			alert("请检查输入的字段是否合法");
		}	
	}
});