import mcs from 'core/service/plugin/malihuScroll'
import IEcatStateProvider from 'core/provider/ecStateProvider'


export abstract class EcMalihuScroll implements angular.IDirective {
    constructor(private mCustomScrollService: mcs, private $state: angular.ui.IStateService, private stateMgr: IEcatStateProvider) {  }
    restrict = 'EC';

    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        if (!element.hasClass('ismobile')) {
            if (!this.$state.includes(this.stateMgr.global.redirect.name)) {
                this.mCustomScrollService.malihuScroll(element, 'minimal-dark', 'y');
            }
        }
    }
}

//export class EcHtmlNiceScroll extends EcMalihuScroll {
//    static directiveId = 'html';
//}

export class EcOverFlowNiceScroll extends EcMalihuScroll {
    static directiveId = 'cOverflow';
}

//export class EcTableResponseNiceScroll extends EcMalihuScroll {
//    static directiveId = 'tableResponsive';
//}

//export class EcChosenResultsNiceScroll extends EcMalihuScroll {
//    static directiveId = 'chosenResults';
//}

//export class EcTabNavNiceScroll extends EcMalihuScroll {
//    static directiveId = 'tabNav'
//}