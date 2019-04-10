ContactsApp.service('contactsService', function($http) {

    this.GetContacts = function () {
        //url: "https://randomuser.me/api/?page=2&results=10&seed=123",
        // https://randomuser.me/api/?results=500
        return $http({
            url: "https://randomuser.me/api/?results=100&exc=login&seed=123",
            data: {},
            dataType: "json",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    this.Contacts = {};
  });