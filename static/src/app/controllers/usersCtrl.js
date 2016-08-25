pepo.controller('usersCtrl', function($location, $scope, usersApi, userApi, MOCKUSERS) {
  $scope.searchValue = '';
  $scope.subscribed = [];

  $scope.$on('currentUserLoaded', function() {
     getUsers();
  });

  function getUsers() {
    usersApi.getUsers().$promise.then(function(data) {
      $scope.users = data;
    }).catch(function(eror){
      console.log(eror);
    });
  }

  $scope.isSubscribe = function(userId) {
    console.log('init');
    $scope.currentUser.following.some(function(followingUser) {
      if(followingUser === userId) {
        $scope.subscribed[userId] = true;
      }
    });
  }

  $scope.subscribe = function(username, userId) {
    usersApi.followUser({username: username}).$promise.then(function(){
       $scope.subscribed[userId] = true;
    })
  }

  $scope.unsubscribe = function(username, userId) {
    usersApi.unfollowUser({username: username}).$promise.then(function(){
       $scope.subscribed[userId] = false;
    })
  }

  $scope.goToUser = function(username) {
    $location.path('/@' + username);
  }
});
