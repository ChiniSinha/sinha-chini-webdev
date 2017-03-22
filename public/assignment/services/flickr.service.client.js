(function () {
    angular
        .module('WebAppMaker')
        .factory('FlickrService', flickrService);

    function flickrService($http) {

        var key = "482979d068b57517a82cbfb3e2c6b300";
        var secret = "3efae2b94cd0aa9a";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        var api = {
            'searchPhotos': searchPhotos
        }

        return api;

        function searchPhotos(searchText) {
            var url = urlBase
                .replace('API_KEY', key)
                .replace('TEXT', searchText);
            return $http.get(url);
        }
    }

})();