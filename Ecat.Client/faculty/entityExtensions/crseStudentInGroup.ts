import * as _mp from "core/common/mapStrings"
import {CrseStudInGrpExtBase, CrseStudInGrpInit} from "core/entityExtension/crseStudentInGroup"

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase { }

export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: ecat.entity.ICrseStudInGroup) => new CrseStudInGrpInit(crseStudInGrp)
}

