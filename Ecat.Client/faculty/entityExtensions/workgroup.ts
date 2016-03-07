import * as _mp from 'core/common/mapStrings'

export class FacWorkGroupInitizer {

    constructor(facWorkGrouppEntity:any) {
        if (facWorkGrouppEntity.assignedSpInstr && facWorkGrouppEntity.groupMembers) {
            facWorkGrouppEntity.getFacAssessStatus();
        }
    }

}

export class FacWorkGroupExt  {
   canPublish: boolean;
}

export var facWorkGrpEntityExt: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.crseStudInGrp,
    ctorFunc: FacWorkGroupExt,
    initFunc: (facWorkGrpEntity: any) => new FacWorkGroupInitizer(facWorkGrpEntity)
}