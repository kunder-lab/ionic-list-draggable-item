/*!
 * Copyright 2016 kunder
 * http://kunder.cl/
 *
 * Ionic List Draggable Item , v1.0.0
 * Custom implementation of ionic list to support draggable items without pressing "order" button
 * https://github.com/kunder-lab/ionic-list-draggable-item
 *
 * By @arturokunder
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

angular.module('dragItemListModule', [])
.controller('dragItemListController', [
  '$scope',
  '$attrs',
  '$ionicListDelegate',
  '$ionicHistory',
function($scope, $attrs, $ionicListDelegate, $ionicHistory) {
  var self = this;
  var isSwipeable = true;
  var isReorderShown = false;
  var isDeleteShown = false;

  var deregisterInstance = $ionicListDelegate._registerInstance(
    self, $attrs.delegateHandle, function() {
      return $ionicHistory.isActiveScope($scope);
    }
  );
  $scope.$on('$destroy', deregisterInstance);

  self.showReorder = function(show) {
    if (arguments.length) {
      isReorderShown = !!show;
    }
    return isReorderShown;
  };

  self.showDelete = function(show) {
    if (arguments.length) {
      isDeleteShown = !!show;
    }
    return isDeleteShown;
  };

  self.canSwipeItems = function(can) {
    if (arguments.length) {
      isSwipeable = !!can;
    }
    return isSwipeable;
  };

  self.closeOptionButtons = function() {
    self.listView && self.listView.clearDragEffects();
  };
}])
.directive('dragItemList', [
  '$timeout',
function($timeout) {

  function isDefined(value) {return typeof value !== 'undefined';}

  return {
    restrict: 'E',
    require: ['dragItemList', '^?$ionicScroll'],
    controller: 'dragItemListController',
    compile: function($element, $attr) {
      var jqLite = angular.element;

      var listEl = jqLite('<div class="list">')
        .append($element.contents())
        .addClass($attr.type);

      $element.append(listEl);

      return function($scope, $element, $attrs, ctrls) {
        var listCtrl = ctrls[0];
        var scrollCtrl = ctrls[1];

        // Wait for child elements to render...
        $timeout(init);

        function init() {
          var listView = listCtrl.listView = new ionic.views.DragItemListView({
            el: $element[0],
            listEl: $element.children()[0],
            scrollEl: scrollCtrl && scrollCtrl.element,
            scrollView: scrollCtrl && scrollCtrl.scrollView,
            onReorder: function(el, oldIndex, newIndex) {
              var itemScope = jqLite(el).scope();
              if (itemScope && itemScope.$onReorder) {
                // Make sure onReorder is called in apply cycle,
                // but also make sure it has no conflicts by doing
                // $evalAsync
                $timeout(function() {
                  itemScope.$onReorder(oldIndex, newIndex);
                });
              }
            },
            canSwipe: function() {
              return listCtrl.canSwipeItems();
            }
          });

          $scope.$on('$destroy', function() {
            if (listView) {
              listView.deregister && listView.deregister();
              listView = null;
            }
          });

          if (isDefined($attr.canSwipe)) {
            $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
              listCtrl.canSwipeItems(value);
            });
          }
          if (isDefined($attr.showDelete)) {
            $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
              listCtrl.showDelete(value);
            });
          }
          if (isDefined($attr.showReorder)) {
            $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
              listCtrl.showReorder(value);
            });
          }

          $scope.$watch(function() {
            return listCtrl.showDelete();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-left-editing', isShown);
            $element.toggleClass('disable-pointer-events', isShown);

            var deleteButton = jqLite($element[0].getElementsByClassName('item-delete'));
            setButtonShown(deleteButton, listCtrl.showDelete);
          });

          $scope.$watch(function() {
            return listCtrl.showReorder();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-right-editing', isShown);

            var reorderButton = jqLite($element[0].getElementsByClassName('item-reorder'));
            setButtonShown(reorderButton, listCtrl.showReorder);
          });

          function setButtonShown(el, shown) {
            shown() && el.addClass('visible') || el.removeClass('active');
            ionic.requestAnimationFrame(function() {
              shown() && el.addClass('active') || el.removeClass('visible');
            });
          }
        }

      };
    }
  };
}]);