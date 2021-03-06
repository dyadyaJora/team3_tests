angular.module('pepo').directive('modalAnswer', function($rootScope, $auth, $location, pepsApi) {
  return {
    restrict: 'E',
    replace: false,
    templateUrl: '../build/templates/modules/modalAnswer.html',
    link: function($scope) {
      $scope.emojiPack = [':bowtie:', ':smile:', ':laughing:', ':blush:', ':smiley:', ':relaxed:', ':smirk:', ':heart_eyes:', ':kissing_heart:', ':kissing_closed_eyes:', ':flushed:', ':relieved:', ':satisfied:', ':grin:', ':wink:', ':stuck_out_tongue_winking_eye:', ':stuck_out_tongue_closed_eyes:', ':grinning:', ':kissing:', ':winky_face:', ':kissing_smiling_eyes:', ':stuck_out_tongue:', ':sleeping:', ':worried:', ':frowning:', ':smiley_cat:', ':smile_cat:', ':heart_eyes_cat:', ':kissing_cat:', ':smirk_cat:', ':scream_cat:', ':crying_cat_face:', ':joy_cat:', ':pouting_cat:'];
      $scope.varAnswer = false;
      $scope.emojiOpen = false;

      function showMap(position) {
        $scope.currentLocation.push(position.coords.latitude);
        $scope.currentLocation.push(position.coords.longitude);
      }
      var body = angular.element(document).find('body');
      $scope.t = '';
      $scope.openModalAnswer = function(id) {
        $scope.varDel = false;
        body.addClass('no-scroll');
        $scope.varEdit1 = [];
        $scope.varAnswer = true;
        $scope.pep = $scope.tweets[id];
        $scope.emojiOpen = false;
        $scope.newPepText = '';
        $scope.t = '';
      };
      $scope.openModalAns = function (tweet){
        $scope.varDel = false;
        body.addClass('no-scroll');
        $scope.varEdit1 = [];
        $scope.varAnswer = true;
        $scope.pep = tweet;
        $scope.emojiOpen = false;
        $scope.newPepText = '';
      };
      $scope.closeModal = function () {
        $scope.varAnswer=false;
        $scope.varDel=false;
        $scope.emojiOpen = false;
        body.removeClass('no-scroll');
      };
      $scope.closeModalAnswer = function($event){
        var click = angular.element($event.target).parent();
        if(click.hasClass('modal-fade-screen')){
          $scope.closeModal();
        }
      };
      $scope.sendPep = function() {
        var hlink = $scope.lengthWithoutLink($scope.newPepText);
        if(hlink > $scope.limit || hlink == 0) return;    
        var newPep = {
          location: $scope.currentLocation,
          parent: $scope.pep._id,
          owner: {
            name: $scope.currentUser.name,
            username: $scope.currentUser.username,
            thumbUrl: $scope.currentUser.thumbUrl
          },
          text: $scope.newPepText
        };
        pepsApi.sendPep(newPep).$promise.then(function(data){
          newPep._id = data._id;
          newPep.createdAt = data.createdAt;
          if($scope.tweets!=undefined && ($location.url().slice(2) ==  $scope.currentUser.username || $location.url()=='/feed')){
            $scope.tweets.unshift(newPep);
          }
          if($scope.currentTweet!=undefined && newPep.parent==$scope.currentTweet._id){
            $scope.currentTweet.children.unshift(newPep);
          }
        })
        .catch(function(err) {
          throw new Error(err);
        });
        $scope.varAnswer = false;
        body.removeClass('no-scroll');
        $scope.newPepText = '';
        if($scope.totalPeps != undefined) $scope.totalPeps++;
        if($location.path()[1] && $scope.currentPageUser.username == $scope.currentUser.username) $scope.currentPageUser.statusesCount++;
      };
      $scope.toggleEmoji = function() {
        $scope.emojiOpen = !$scope.emojiOpen;
      };
      $scope.addEmoji = function(emoji) {
        $scope.newPepText += emoji;
      };
    }
  };
});
