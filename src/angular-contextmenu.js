/**
 @file angular-contextmenu.js
 @description A contextmenu directive for angular
 @author YangJiyuan yjy972080142@gmail.com
 @date 2016-3-15
 */

angular.module('angular-contextmenu',[])
.controller('contextMenuCtrl', ['$scope','$element','$compile', '$templateRequest',
    function ($scope,$element,$compile,$templateRequest) {

    this.init = function () {
        $scope.options = $scope.contextMenus || {};
        var body = document.querySelector('body');
        $scope.showMenu = false;
        $templateRequest('src/angular-contextmenu.html').then(function(tplContent) {
            $compile(tplContent.trim())($scope, function(dropdownElement) {
                var newEl = dropdownElement;
                if(newEl && newEl[0]){
                    body.appendChild(newEl[0]);
                    angular.element(newEl[0]).on('contextmenu', hideMenu);
                    angular.element(newEl[0]).on('click', hideMenu);
                    if($scope.options.menuItems && $scope.options.menuItems.length){
                        $element.on('contextmenu', function (evt) {
                            evt.preventDefault();
                            $scope.showMenu = true;
                            $scope.$digest();
                            adjustPosition(evt,newEl[0]);
                        });
                    }
                }
            });
        });
    };
    $scope.clickMenuItemHandler = function (item) {
        if(!item.disabled && !item.divider && item.callback && angular.isFunction(item.callback)){
            item.callback();
        }
    };
    function hideMenu(evt){
        evt.preventDefault();
        $scope.showMenu = false;
        $scope.$digest();
    }
    function adjustPosition(evt,el){
        var clientHeight = window.innerHeight,
            clientWidth = window.innerWidth;
        var menuList = el.querySelector('.ng-contextmenu-list');
        var menuHeight = getStyle(menuList,'height'),
            menuWidth = getStyle(menuList,'width');
        var x = evt.clientX,
            y = evt.clientY;
        var pageX = evt.pageX,
            pageY = evt.pageY;
        if(clientHeight - y > menuHeight){
            menuList.style.top = pageY +'px';
        }else{
            menuList.style.top = pageY-menuHeight +'px';
        }
        if(clientWidth - x > menuWidth){
            menuList.style.left = pageX  +'px';
        }else{
            menuList.style.left = pageX-menuWidth +'px';
        }
    }
    function getStyle(el,attr){
        return parseInt(getComputedStyle(el)[attr],10);
    }
}])
.directive('contextMenus', function () {
    return {
        restrict: 'A',
        scope: {
            contextMenus:'='
        },
        controller: 'contextMenuCtrl',
        link: function (scope, el, attrs, ctrl) {
            ctrl.init();
        }
    };
})
.directive('ngContextmenu', function () {
    return {
        restrict: 'A',
        scope: {
            ngContextmenu:'&ngClick'
        },
        link: function (scope, el) {
            var fn = scope.ngContextmenu;
            if(fn && typeof fn === 'function'){
                el.on('contextmenu', fn);
            }
        }
    };
});