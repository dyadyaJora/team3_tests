pepo.controller('feedCtrl', function($rootScope, $q, $location, $auth, $scope, userApi, feedApi, pepsApi,$document) {
  $scope.newPepText = '';
  currentLocation = [];
  navigator.geolocation.getCurrentPosition(show_map);

  // Get coordinates.
  function show_map(position) {
    currentLocation.push(position.coords.latitude);
    currentLocation.push(position.coords.longitude);
  }

  feedApi.getFeed().$promise.then(function(data){
    $scope.tweets = data;
  });

  $scope.goToUser = function(username) {
    $location.path('/@' + username);
  }

  $scope.goToPep = function(pepId) {
    $location.path('/pep' + pepId);
  }

  $scope.editPepStart = function(index, id, text){
    $scope.editId = id;
    console.log(id);
    $scope.editPepText = text;
    $scope.editIndex = index;
    $scope.varEdit1 = [];
    $scope.varEdit1[index] = true;
  }

  $scope.editAnim = [];
  $scope.editPep = function(){
    $scope.emojiOpen = false;
    if ($scope.tweets[$scope.editIndex].text == $scope.editPepText) {
      $scope.varEdit1 = [];
      return;
    }
    $scope.editAnim[$scope.editIndex] = true;
    pepEdit = {text: $scope.editPepText };
    pepsApi.editPep({id: $scope.editId}, pepEdit).$promise.then(function(data){
      $scope.tweets.find(function(pep) {
        if (pep._id === data._id) {
          currentPep = pep;
        }
      });
      currentPep.text = data.text;
      $scope.varEdit1 = [];
  }).catch(function(eror){
    $scope.varEdit1 = [];
  });
  setTimeout(function(){ $scope.editAnim = [];}, 2000);
    //document.getElementsByTagName('body')[0].scrollTop = document.getElementsByClassName('tweets_item')[$scope.editIndex].offsetTop - $scope.varHeightheader ;
     $document.scrollTop(document.getElementsByClassName('tweets_item')[$scope.editIndex].offsetTop - $scope.varHeightheader, 300);
  }

  // Server latency mock.
  function sleep (milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }

  var localPepsOffset = 0;
  $scope.loadMorePeps = function() {
    $scope.pepsLoading = true;
    localPepsOffset += 5;
    var res = feedApi.getFeed({offset:localPepsOffset, count:5}).$promise.then(function(data){
      $scope.tweets = $scope.tweets.concat(data);
      sleep(1000); // server latency mock.
      $scope.pepsLoading = false;
    });
  }
  $scope.addEmojiEdit = function(emoji) {
     $scope.editPepText += emoji;
  }
});
