export default class EcFgLine implements angular.IDirective {
    static directiveId = 'fgLine';
    restrict = 'C';
    scope = {};
    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

        element.on('focus', '.form-control',
            () => {
                element
                    .addClass('fg-toggled');
            });

        element.on('blur', '.form-control',
            () => {
                var hasValue = element.find('.form-control').val();

                if (!hasValue) {
                    element
                        .removeClass('fg-toggled');
                }
            });

    }
}