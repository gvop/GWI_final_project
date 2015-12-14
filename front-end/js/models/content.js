angular
  .module('zine')
  .factory('Content', Content)

Content.$inject = ['$resource', 'API']
function Content($resource, API){

  return $resource(
    API+'/content/:id', {id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: false},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
    }
  );
}
