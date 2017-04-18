(function() {
    angular
        .module('RecruiterWeb')
        .directive('csButton', csButton);


    function csButton() {
        function linkfunc(scope, element, attributes, sortingController) {
            element.sortable({
                start: function(event, ui){
                    ui.item.startPos = ui.item.index();
                },
                update: function(event, ui){
                    var startIndex = ui.item.startPos;
                    var endIndex = ui.item.index();
                    sortingController.widgetsSort(startIndex, endIndex);
                },
                axis: 'y'
            });
        }
        return {
            link: linkfunc,
            controller: sortWidgetsController
        }
    }

    function sortWidgetsController(PageService, $routeParams) {
        var vm = this;
        vm.widgetsSort = widgetsSort;

        function widgetsSort(start, end) {
            var pageId = $routeParams.pid;
            console.log(pageId);
            PageService
                .reorderWidget(pageId, start, end)
                .success(function () {
                })
                .error(function () {
                });
        }
    }
})();