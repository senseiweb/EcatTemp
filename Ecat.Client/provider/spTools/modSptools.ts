﻿import angular = require('angular');
import IDataCtx from 'core/service/data/context'
import _commenter from 'provider/spTools/commenter'
import _assesser from "provider/spTools/assesser"
import _sptools from 'provider/spTools/sptool'

export default class EcProviderSpTools {
    static load = new EcProviderSpTools();
    moduleId = 'app.provider.sptool';
    
    constructor() {
        angular
            .module(this.moduleId, ['ui.bootstrap'])
            .controller(_commenter.controllerId, _commenter)
            .controller(_assesser.controllerId, _assesser)
            .service(_sptools.serviceId, _sptools);
    }
}

