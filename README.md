# ionic-list-draggable-item
Custom implementation of ionic list to support draggable items without pressing "order" button

## Installation

To install latest version:

```Shell
bower install ionic-list-draggable-item
```

## Usage

It's used as `<ion-list />`.
Just add `<list-draggable-item />` directive and add some `<ion-item />` inside.

Now, your items will be draggable holding them or pressing the "order" button.

## Example

You can see a full example at samples folder.

```html
<list-draggable-item show-delete="data.showDelete" show-reorder="data.showReorder">

  <ion-item ng-repeat="item in items" item="item" href="#/item/{{item.id}}" class="item-remove-animate">
    Item {{ item.id }}
    <ion-delete-button class="ion-minus-circled" ng-click="onItemDelete(item)">
    </ion-delete-button>
    <ion-option-button class="button-assertive" ng-click="edit(item)">
      Edit
    </ion-option-button>
    <ion-option-button class="button-calm" ng-click="share(item)">
      Share
    </ion-option-button>
    <ion-reorder-button class="ion-navicon" on-reorder="moveItem(item, $fromIndex, $toIndex)"></ion-reorder-button>
  </ion-item>

</list-draggable-item>
```

## API

### Directive: list-draggable-item

This list can include content ranging from basic text all the way to buttons, toggles, icons, and thumbnails as you wuld do with any ion-list.

Both the list, which contains items, and the list items themselves can be any HTML element. The containing element requires the list class and each list item requires the item class.

As ion-list, this list also supports swipe to edit, drag to reorder and removing items.

For more information, you can checkout ionList [documentation](http://ionicframework.com/docs/api/directive/ionList/)

#### Supported attributes

| Attr | Type | Details |
| ---- | ---- | ------- |
| show-delete (optional) | `boolean` | Whether the delete buttons for the items in the list are currently shown or hidden. |
| show-reorder (optional) | `boolean` | Whether the reorder buttons for the items in the list are currently shown or hidden. |
| can-swipe (optional) | `boolean` | Whether the items in the list are allowed to be swiped to reveal option buttons. Default: true. |

### Controller: ionicListDraggableItemController

Refer to $ionicListDelegate [documentation](http://ionicframework.com/docs/api/service/$ionicListDelegate/). The directive's controller exposes the same methods as the ion-list's controller.

## Bugs or comments?

Report it at the [issues section](https://github.com/kunder-lab/ionic-list-draggable-item/issues).
