import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"
import ICommon from "core/common/commonService"
import {SpInventoryExtBase} from "core/entityExtension/spInventory"


class FacSpInventoryExt extends SpInventoryExtBase implements ecat.entity.ext.IFacSpInventoryExt {
    responseForAssessee: ecat.entity.IFacSpResponse;
    constructor() {
        super(this.responseForAssessee);
    }
}

class StudSpInventoryExt extends SpInventoryExtBase implements ecat.entity.ext.IStudSpInventoryExt {
    responseForAssessee: ecat.entity.ISpRespnse;
}

export var facSpInventoryCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.spInventory,
    ctorFunc: FacSpInventoryExt,
    initFunc: null
}

export var studSpInventoryCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.spInventory,
    ctorFunc: StudSpInventoryExt,
    initFunc: null
}