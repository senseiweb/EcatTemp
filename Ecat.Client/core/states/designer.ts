import _core from 'core/states/core'
import IDataCtx from "core/service/data/context"
import * as _mp from 'core/common/mapStrings'

export default class EcDesignerStates {

    private isDesignerAppLoaded = false;
    parentName = 'designer';

    main: angular.ui.IState;
  
    constructor() {
        this.main = {
            name: `${_core.mainRefState.name}.designer`,
            parent: _core.mainRefState.name,
            url: '/designer',
            abstract: true,
            template: '<div ui-view></div>',
            data: {
                validateToken: true,
                authorized: [_mp.MpInstituteRole.designer]
            },
            resolve: {
                moduleInit: ['$ocLazyLoad', this.loadModule],
                tokenValid: ['tokenValid', (tokenValid) => tokenValid],
                dCtxReady: ['moduleInit', 'tokenValid', IDataCtx.serviceId, (m, t, dCtx: IDataCtx) =>
                    dCtx.designer.activate().then(() =>
                        console.log('Designer Manager Ready'))
                ]
            }
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => System.import('app/faculty/appFac.js')
        .then((facClass: any) => {
            if (!this.isDesignerAppLoaded) {
                const facMod = facClass.default.load();
                $ocLl.inject(facMod.moduleId);
                this.isDesignerAppLoaded = true;
                console.log('Designer Module v0.1 successful loaded');
            } else {
                return true;
            }
        });

}


   

