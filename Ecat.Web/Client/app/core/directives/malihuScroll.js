System.register([], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var EcMalihuScroll, EcOverFlowMalihuScroll;
    return {
        setters:[],
        execute: function() {
            EcMalihuScroll = (function () {
                function EcMalihuScroll(mCustomScrollService, $state, stateMgr) {
                    var _this = this;
                    this.mCustomScrollService = mCustomScrollService;
                    this.$state = $state;
                    this.stateMgr = stateMgr;
                    this.restrict = 'EC';
                    this.link = function (scope, element, attrs) {
                        if (!element.hasClass('ismobile')) {
                            if (!_this.$state.includes(_this.stateMgr.core.redirect.name)) {
                                _this.mCustomScrollService.malihuScroll(element, 'minimal-dark', 'y');
                            }
                        }
                    };
                }
                return EcMalihuScroll;
            })();
            exports_1("EcMalihuScroll", EcMalihuScroll);
            EcOverFlowMalihuScroll = (function (_super) {
                __extends(EcOverFlowMalihuScroll, _super);
                function EcOverFlowMalihuScroll() {
                    _super.apply(this, arguments);
                }
                EcOverFlowMalihuScroll.directiveId = 'cOverflow';
                return EcOverFlowMalihuScroll;
            })(EcMalihuScroll);
            exports_1("EcOverFlowMalihuScroll", EcOverFlowMalihuScroll);
        }
    }
});
//export class EcTableResponseNiceScroll extends EcMalihuScroll {
//    static directiveId = 'tableResponsive';
//}
//export class EcChosenResultsNiceScroll extends EcMalihuScroll {
//    static directiveId = 'chosenResults';
//}
//export class EcTabNavNiceScroll extends EcMalihuScroll {
//    static directiveId = 'tabNav'
//} 
