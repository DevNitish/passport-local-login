const bcmApp = angular.module('bcmApp', []);

bcmApp.controller('mainCtrl', ["$scope", "$http", function ($scope, $http) {
    $scope.user = {};
    $scope.user1 = {};
    $scope.user.email = "@gmail.com"
    $scope.user1.email = "@gmail.com"
    $scope.userfromdb = null;
    $scope.newuser = null;

    $scope.signup = function (user) {
        console.log("user", user)
        $http.post("/api/users", user)
            .then(function (response) {
                console.log("signup data ", response.data);
                $scope.newuser = response.data;
                var token = response.data.user.token
                console.log("token ", token);
                localStorage.setItem('token', token);
                var getToken = localStorage.getItem('token');
                console.log("get token ", token);
            }, function (err) {
                console.log("signup err ", err);
            });
    }
    //nitish9@gmail.com/api/users/login
    $scope.login = function (user) { //not working
        var url = '/api/users/login';
        console.log("login user : ",user);
        $http.post(url, user)
            .then(function (response) {
                console.log("data ", response.data);
                //set header
                $scope.userfromdb = response.data;


                $scope.newuser = response.data;
                var token = response.data.user.token
                console.log("token ", token);
                localStorage.setItem('token', token);
                var getToken = localStorage.getItem('token');
                console.log("get token ", token);
            }, function (err) {
                console.log("login err ", err);
            });
    }
    
    $scope.getuser = function () {//working
        var url = '/api/users/current';
        var mytoken="Token "+localStorage.getItem('token');
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': mytoken
                // or  'Content-Type':'application/json'
            }
        };

        $http.get(url, config)
            .then(function (response) {
                console.log("data getuser=>", response.data);
                $scope.userfromdb = response.data;
            }, function (err) {
                console.log("login err ", err);
            });
    }



}])