
export class EcSidebarDirective implements angular.IDirective {
    static directiveId = 'ecSidebar';
    templateUrl = 'wwwroot/app/core/global/tmpls/sidebar.tmpl.html';
    restrict = 'A';
    controller = 'ecSidebarCntrl';
    controllerAs = 'sb';
    bindToController = true;
}

export class EcSideBarCntrl {
    static controllerId = 'ecSidebarCntrl';
    static $inject = ['$state'];

    constructor(
        public $state: angular.ui.IStateService) {
        
    }
}
