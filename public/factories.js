
/* ######################### CONTACT ######################### */
function Contact($http, $window) {
  var Contact = {};

  Contact.create = function (newContact, onSuccess, onFail) {
    $http({ url: '/createContact', headers: { 'x-access-token': $window.localStorage.auth_token }, method: 'POST', data: newContact })
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        log.error('Contact.create: Fail');
        onFail();
      }
    );
  };

  Contact.getAll = function(onSuccess, onFail) {
    $http({ url: '/getAllContacts', headers: { 'x-access-token': $window.localStorage.auth_token }, method: 'GET', params: {} })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        log.error('Contact.getAll: Fail');
        onFail(response);
      }
    );
  };

  Contact.getOne = function(contactID, onSuccess, onFail) {
    log.info('TEST: ' + contactID);
    $http({ url: '/getOneContact', method: 'GET', headers: { 'x-access-token': $window.localStorage.auth_token }, params: { contact_id: contactID } })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        log.error('Contact.getOne: Fail');
        onFail();
      }
    );
  };

  Contact.update = function (updatedContact, onSuccess, onFail) {
    $http({ url: '/updateContact', headers: { 'x-access-token': $window.localStorage.auth_token }, method: 'POST', data: updatedContact })
      .then(function success(response) {
        onSuccess(response);
      },
      function fail(response) {
        log.error('Contact.update: Fail');
        onFail();
      }
    );
  };


  Contact.delete = function (contactID, onSuccess, onFail) {
    $http({ url: '/deleteContact', headers: { 'x-access-token': $window.localStorage.auth_token }, method: 'POST', data: { contact_id: contactID } })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        log.error('Contact.delete: Fail');
        onFail();
      }
    );
  };

  return Contact;
}


/* ######################### USER ######################### */
function User($http, $window) {
  var User = {};
  
  User.register = function (newUser, onSuccess, onFail) {
    $http({ url: '/register', method: 'POST', data: newUser })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        log.error('User.register: Fail');
        onFail();
      }
    );
  };

  User.login = function (credentials, onSuccess, onFail) {
    $http({ url: '/login', method: 'POST', data: credentials })
      .then(function success(response) {
        onSuccess(response.data);
      },
      function fail(response) {
        log.error('User.login: Fail');
        onFail();
      }
    );
  };

  User.getUser = function(onSuccess, onFail) {
    $http({ url: '/getUser', headers: { 'x-access-token': $window.localStorage.auth_token }, method: 'GET', params: {} })
      .then(function success(response) {
        onSuccess(response.data.user);
      },
      function fail(response) {
        log.error('User.getUserProfile: Fail');
        onFail();
      }
    );
  };

  return User;
}