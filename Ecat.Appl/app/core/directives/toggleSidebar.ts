export interface ISidebarScope extends angular.IScope {
    modelLeft: boolean;
    modelRight: boolean;
}

export default class EcToggleSideBar implements angular.IDirective {
    static directiveId = 'toggleSidebar';
    restrict = 'A';
    scope = {
        modelLeft: '=',
        modelRight: '='
    };

    link = (scope: ISidebarScope,
            element: angular.IAugmentedJQuery,
            attr: angular.IAttributes) => {
        element.on('click', () => {

            if (element.data('target') === 'mainmenu') {
                if (scope.modelLeft === false) {
                    scope.$apply(() => { scope.modelLeft = true; });
                } else {
                    scope.$apply(() => { scope.modelLeft = false; });
                }
            }

            if (element.data('target') === 'chat') {
                if (scope.modelRight === false) {
                    scope.$apply(() => { scope.modelRight = false; });
                }
            } else {
                scope.$apply(() => { scope.modelRight = false; });
            }
        });
    }


}