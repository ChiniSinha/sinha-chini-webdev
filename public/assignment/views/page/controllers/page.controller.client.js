(function () {
    angular
        .module('WebAppMaker')
        .controller('PageListController', PageListController)
        .controller('PageNewController', NewPageController)
        .controller('PageEditController', EditPageController)

        function PageListController() {
            var vm = this;
        }

        function NewPageController() {
            var vm = this;
        }

        function EditPageController() {
            var vm = this;
        }

})();