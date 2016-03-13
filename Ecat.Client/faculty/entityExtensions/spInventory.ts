import * as _mp from 'core/common/mapStrings'
import * as _mpe from 'core/common/mapEnum'
import ICommon from 'core/common/commonService'
import {SpInventoryExtBase} from 'core/entityExtension/spInventory'


class FacSpInventoryExt extends SpInventoryExtBase implements ecat.entity.ext.IFacSpInventoryExt { }

export var facSpInventoryCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.spInventory,
    ctorFunc: FacSpInventoryExt,
    initFunc: null
}

