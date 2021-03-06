angular
  .module('zine')
  .factory('User', User)

User.$inject = ['$resource', 'API']
function User($resource, API){

  return $resource(
    API+'/users/:id', 
{id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: false},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'register': {
        url: API +'/register',
        method: "POST"
      },
      'login':      {
        url: API + '/login',
        method: "POST"
      },
      'addContent': {
        url: API + '/users/addcontent',
        method: "POST" 
      },
      'deleteContent': {
        url: API + '/users/addcontent',
        method: "PUT" 
      },
      'addFriend': {
        url: API + '/users/friends',
        method: "POST" 
      },
      'deleteFriend': {
        url: API + '/users/friends',
        method: "PUT" 
      }
    }
  );
}