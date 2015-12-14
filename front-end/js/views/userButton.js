angular.module('zine')
  .directive('userbutton', userButton);

function userButton(){
  var directive = {};
  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl =  "_userButton.html";
  return directive;
}

