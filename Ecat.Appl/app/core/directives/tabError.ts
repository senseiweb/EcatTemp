
export default class EcTabNavError implements angular.IDirective {
    static directiveId = 'tabNavError';
    restrict = 'A';

    link = (scope: angular.IScope,
        element: angular.IAugmentedJQuery,
        attr: angular.IAttributes) => {
       
        attr.$observe('tabNavError', (value: boolean) => {
            const tabBar = element.closest('.tab-nav');
           if (value) {
              tabBar.addClass('c-red');
           } else {
               if (tabBar.hasClass('c-red')) {
                   tabBar.removeClass('c-red');
               }
           }
       })

    }


}