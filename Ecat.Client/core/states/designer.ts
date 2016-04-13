import _core from 'core/states/core'
import IDataCtx from "core/service/data/context"
import * as _mp from 'core/common/mapStrings'

export default class EcDesignerStates {

    private isDesignerAppLoaded = false;
    parentName = 'designer';

    main: angular.ui.IState;
    instrument: angular.ui.IState;
    inventory: angular.ui.IState;
    models: angular.ui.IState;

    constructor() {
        this.main = {
            name: `${_core.mainRefState.name}.designer`,
            parent: _core.mainRefState.name,
            url: '/designer',
            abstract: true,
            templateUrl: '@[appDesigner]/features/main.html',
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

        this.instrument = {
            name: `${this.main.name}.instr`,
            parent: this.main.name,
            url: '/instruments/{type}',
            templateUrl: '@[appDesigner]/features/instrument/instr.html',
            controller: 'app.designer.wgInstr as dwgi'
        }
    }

    private loadModule = ($ocLl: oc.ILazyLoad): void => System.import('app/designer/appDesign.js')
        .then((designClass: any) => {
            if (!this.isDesignerAppLoaded) {
                const designMod = designClass.default.load();
                $ocLl.inject(designMod.moduleId);
                this.isDesignerAppLoaded = true;
                console.log('Designer Module v0.1 successful loaded');
            } else {
                return true;
            }
        });

}


   

