var ContactsApp = angular.module('Contacts', ['ngRoute']);

ContactsApp.config(function($routeProvider) {
    $routeProvider.when('/', {
            templateUrl : 'Modules/Contacts/Views/list.html',
            controller  : 'listController',
            controllerAs: 'vm'
        }).when('/contact/:id', {
            templateUrl : 'Modules/Contacts/Views/contact.html',
            controller  : 'viewController',
            controllerAs: 'vm'
        });
});

ContactsApp.filter('pagination', function()
{
    return function(input, start)
    {
        start = +start;
        return input.slice(start);
    };
});

ContactsApp.controller('listController', function($scope, $http, contactsService, $location) {
    var vm = this;

    vm.Ordering = 'FullName'
    vm.filters = [{Id : 0, Name  : "Name A-Z", Ordering : "FullName"}, {Id : 2, Name  : "Name Z-A", Ordering : "-FullName"}];
    vm.dataLoaded = false;
    vm.filterExpanded = false;
        
    vm.GetContacts = GetContacts;
    vm.NavigateToContact = NavigateToContact;
    vm.SortBy = SortBy;

    vm.Contacts = [];

    vm.currPage = 0;
    vm.pageSize = 5;
    vm.GetTotalPages = GetTotalPages;

    function SortBy(sort){
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    }

    function GetTotalPages(filtered) 
    {
        return Math.ceil(filtered / vm.pageSize);
    };

    function GetContacts() {
        if(contactsService.Contacts.length)
        {
            vm.Contacts = contactsService.Contacts;
            vm.dataLoaded = true;
        }
        else
        {
            contactsService.GetContacts().then(function(response){
                vm.Contacts = response.data.results;

                angular.forEach(vm.Contacts, function(value, key) {
                    value.FullName = value.name.first + " " + value.name.last;
                });
                contactsService.Contacts = response.data.results;
                vm.dataLoaded = true;
            });
        }
    }

    function NavigateToContact(email){
        $location.path( "/contact/" + email );
    }

    // function GetContactsPaged(page) {
    //     //url: "https://randomuser.me/api/?page=2&results=10&seed=123",
    //     // https://randomuser.me/api/?results=500
    //     $http({
    //         url: "https://randomuser.me/api/",
    //         params: {page : page, results : 10, seed : 123},
    //         dataType: "json",
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then(function (response) {
    //         vm.Contacts = response.data.results;
    //     });
    // }
    vm.GetContacts();
});

ContactsApp.controller('viewController', function($scope, contactsService, $routeParams) {
    var vm = this;

    vm.id = $routeParams['id'];
    vm.GetContact = GetContact;
    vm.Contacts = undefined;
    vm.Contact = undefined;
    vm.dataLoaded = false;

    vm.GetContacts = GetContacts;

    function GetContacts()
    {
        if(contactsService.Contacts.length)
        {
            vm.Contacts = contactsService.Contacts;
            vm.GetContact(vm.Contacts);
        }
        else{
            contactsService.GetContacts().then(function(response){
                vm.Contacts = response.data.results;
                angular.forEach(vm.Contacts, function(value, key) {
                    value.FullName = value.name.first + " " + value.name.last;
                  });
                contactsService.Contacts = response.data.results;
                vm.GetContact(vm.Contacts);
            });
        }
    }

    function GetContact(contacts)
    {
        var found = false;
        angular.forEach(contacts, function(value, key) {    
            if(!found){
                if(value.email == vm.id){
                    vm.Contact = value;
                    found = true;
                    vm.dataLoaded = true;
                }
            }
        });        
    }

    vm.GetContacts();
});