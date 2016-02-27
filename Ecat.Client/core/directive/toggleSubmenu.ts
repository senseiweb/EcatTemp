export default class EcSubMenu implements angular.IDirective {
    static directiveId = 'toggleSubmenu';
    restrict = 'A';

    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        element.click(() => {
            element.parent().toggleClass('toggled');
            element.parent().find('ul').stop(true, false).slideToggle(200);
        });
    }
}