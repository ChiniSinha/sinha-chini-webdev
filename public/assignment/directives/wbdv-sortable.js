(function() {
    angular
        .module('WebAppMaker')
        .directive('wbdvSortable', wbdvSortable);

    function wbdvSortable() {
        function linkfunc(scope, element) {
            function linkFunction(scope, element) {
                element.sortable();
            }
            return {
                link: linkFunction
            }
        }
        return {
            link: linkfunc,
        }
    }
})();