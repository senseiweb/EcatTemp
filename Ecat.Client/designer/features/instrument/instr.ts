import * as _mp from "core/common/mapStrings"
import IDataCtx from "core/service/data/context"
import ICommon from "core/common/commonService"

export default class EcDesignInstrCntrl {
    static controllerId = 'app.designer.wgInstr';
    static $inject = [ICommon.serviceId, IDataCtx.serviceId];

    protected activeView = DesignInstrView.Sp;

    protected spInstruments = [
    {name: 'Test Instrument' }];
    protected    view = {
        sp: DesignInstrView.Sp,
        kc: DesignInstrView.Kc,
        cog: DesignInstrView.Cog
    }

    constructor(private c: ICommon, private dCtx: IDataCtx) {
        if (c.$stateParams.type === 'selfpeer') this.activeView = DesignInstrView.Sp;
    }

    activate(): void {
        const that = this;
    }
}

const enum DesignInstrView {
    Sp,
    Kc,
    Cog
}
