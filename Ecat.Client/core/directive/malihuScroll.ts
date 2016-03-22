import mcs from 'core/service/plugin/malihuScroll'
import {IStateMgr} from 'core/config/cfgProviders'

export abstract class EcMalihuScroll implements angular.IDirective {
    constructor(private mCustomScrollService: mcs, private $state: angular.ui.IStateService, private stateMgr: IStateMgr) { }
    restrict = 'EC';

    link = (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        if (!element.hasClass('ismobile')) {
            if (!this.$state.includes(this.stateMgr.core.redirect.name)) {
                this.mCustomScrollService.malihuScroll(element, 'minimal-dark', 'y');
            }
        }
    }
}

export class EcOverFlowMalihuScroll extends EcMalihuScroll {
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