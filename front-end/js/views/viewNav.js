angular.module('zine')
  .directive('navview', viewNav);

function viewNav(){
  var directive = {};
  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl =  "_viewNav.html";
  return directive;
}

