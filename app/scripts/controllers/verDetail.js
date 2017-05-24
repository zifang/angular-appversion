'use strict';
/*
	版本详情 滚动加载数据
 */

eartyApp.controller('verDetailCtrl',function($scope,$http,$filter,$stateParams,baseUrl){
	$scope.lists=[];
	$scope.data=$scope.lists;
	$scope.count = 50;
	$scope.size = 50;
	$scope.page = 0;
	$scope.loading_page = false;
	$scope.stop_loading = false;
	//获取参数里面的t参数
	var _t = "";
	if($stateParams.t){
		_t = $stateParams.t;
	}
	$scope.t = _t;

	//判断权限问题
	$http({
		type:'get',
		params:{t:_t},
		url:baseUrl+'/webapi/isLogin'
	}).success(function(res){
		if(res.code==999){//code:999时跳转到登录地址，否则进入页面
			window.location.href=res.message;
			// window.location.href="http://localhost:8099/#/index?t=acc8d2b6-88eb-4d31-b799-07b2a5d1386a";
		}
	});

	//滚动加载数据
	window.onscroll = function(){
	　　if(getScrollTop() + getWindowHeight() == getScrollHeight()){
			$scope.loadMoreData();
			console.log("at the bottom");
	　　}
	};
	//根据输入框关键字，快速检索数据
	$scope.queryData = function(querydata){
		$scope.lists = $filter('filter')($scope.data,querydata);
	}
	//监听input输入框，直接搜索版本信息
	$scope.$watch('query',function(n,o){
		$scope.lists = $filter('filter')($scope.data,n);
	});

	//滚动加载更多数据
	$scope.loadMoreData = function(){
	 	if($scope.loading_page || $scope.stop_loading) return;
	    $scope.loading_page = true;
	    $scope.page++;
	    if($scope.count==0){
			//第一页
	    }
	    $scope.form = $scope.page*$scope.size - $scope.count;
	    //请求数据根据分页
	    $http({
	    	method:'get',
	    	params:{from:$scope.form,size:$scope.size,t:_t},
	    	url:baseUrl+'/webapi/queryAppUpdate',
	    }).success(function(res){
	    	if(res.code==200){
	    		$scope.loadLists = res.model;
	    		if($scope.loadLists.length>0){
	    			if($scope.loadLists.length==$scope.size){
	    				$scope.loading_page = false;
	    			}else{
	    				$scope.loading_page = true;
	    			}

	    			angular.forEach($scope.loadLists, function(obj,index,array){
	    				$scope.data.push(obj);
	    			});
	    			$scope.lists = $scope.data;
	    			// $scope.$digest();
	    		}
	    	}else{
	    		alert(res.message);
	    	}
	    }).error(function(res){
	      console.log("fail...");
	    });
	};
	//初始化加载数据，加载前50条
	$scope.loadMoreData();

	//滚动条在Y轴上的滚动距离  
	 function getScrollTop(){
	　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
	　　if(document.body){
	　　　　bodyScrollTop = document.body.scrollTop;
	　　}
	　　if(document.documentElement){
	　　　　documentScrollTop = document.documentElement.scrollTop;
	　　}
	　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
	　　return scrollTop;
	} 
	 //文档的总高度 
	 function getScrollHeight(){
	　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
	　　if(document.body){
	　　　　bodyScrollHeight = document.body.scrollHeight;
	　　}
	　　if(document.documentElement){
	　　　　documentScrollHeight = document.documentElement.scrollHeight;
	　　}
	　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
	　　return scrollHeight;
	} 
	 //浏览器视口的高度 
	 function getWindowHeight(){
	　　var windowHeight = 0;
	　　if(document.compatMode == "CSS1Compat"){
	　　　　windowHeight = document.documentElement.clientHeight;
	　　}else{
	　　　　windowHeight = document.body.clientHeight;
	　　}
	　　return windowHeight;
	} 
	
})
//过滤,状态转换
eartyApp.filter('switchAppid',function(){
	return function(status){
		switch(status){
			case 1:
				return "云小二";
			case 2:
				return "云掌柜";
			case 3:
				return "快餐版云小二";
		}
	}
})
//过滤器，androd，ios状态转换
eartyApp.filter('switchOs',function(){
	return function(status){
		switch(status){
			case 1:
				return "IOS";
			case 2:
				return "Android";
		}
	}
})

eartyApp.filter('switchType',function() {
	return function(status){
		switch(status){
			case 1:
				return "强制更新";
			case 2:
				return "选择性更新";
		}
	}
});

eartyApp.filter('switchActivity',function(){
	return function(status){
		switch(status){
			case 1:
				return "激活";
			case 0:
				return "未激活";
		}
	}
})