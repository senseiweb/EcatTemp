export default class EcFormControl implements angular.IDirective {
    static directiveId = 'formControl';
    restrict = 'C';

    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        if (angular.element('html').hasClass('ie9')) {
            jQuery('input, textarea').placeholder({
                customClass: 'ie9-placeholder'
            });
        }
    }
}