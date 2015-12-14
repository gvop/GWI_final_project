angular.module('zine')
  .directive('contentcard', contentCard);

function contentCard(){
  var directive = {};
  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl =  "_contentCard.html";
  return directive;
}

