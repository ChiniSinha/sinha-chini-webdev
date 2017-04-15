(function () {
    angular
        .module('RecruiterWeb')
        .factory('YoutubeService', youtubeService);

    function youtubeService($http) {

        var key = 'AIzaSyBZZBmEfjgJwgQzro2Vpchd67HXwNMRcDQ';
        var urlBase = 'https://www.googleapis.com/youtube/v3/search?key=API_KEY&part=snippet&q=TEXT&type=video';

        var api = {
            'searchVideos': searchVideos
        }

        return api;

        function searchVideos(searchText) {
            var url = urlBase
                .replace('API_KEY', key)
                .replace('TEXT', searchText);
            return $http.get(url);
        }
    }

})();