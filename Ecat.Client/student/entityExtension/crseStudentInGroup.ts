import {CrseStudInGrpExtBase, CrseStudInGrpInit} from "core/entityExtension/crseStudentInGroup"
import * as _mp from "core/common/mapStrings"

class StudCrseStudInGrpExt extends CrseStudInGrpExtBase {}

export var studCrseStudInGrpCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.crseStudInGrp,
    ctorFunc: StudCrseStudInGrpExt,
    initFunc: (crseStudInGrp: ecat.entity.ICrseStudInGroup) => new CrseStudInGrpInit(crseStudInGrp)
}