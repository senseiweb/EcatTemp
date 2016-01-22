export default class EcBtnWaves implements angular.IDirective {
    static directiveId = 'btn';
    restrict = 'C';

    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        if (element.hasClass('btn-icon') || element.hasClass('btn-float')) {
            Waves.attach(element, ['waves-circle']);
        }

        else if (element.hasClass('btn-light')) {
            Waves.attach(element, ['waves-light']);
        }

        else {
            Waves.attach(element);
        }

        Waves.init();
    }
}