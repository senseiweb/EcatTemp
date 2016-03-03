import * as _mp from "core/common/mapStrings"
import {CrseStudInGrpExtBase, CrseStudInGrpInit} from "core/entityExtension/crseStudentInGroup"

class FacCrseStudInGrpExt extends CrseStudInGrpExtBase implements ecat.entity.ext.IFacCrseStudInGrpExt {
    numberOfAuthorComments = null;
}

export var facCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacCrseStudInGrpExt,
    initFunc: (crseStudInGrp: any) => new CrseStudInGrpInit(crseStudInGrp)
}

