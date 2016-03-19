import * as _mp from 'core/common/mapStrings'

export class FacWorkGroupInitizer {

    constructor(facWorkGrouppEntity:any) {
        //if (facWorkGrouppEntity.assignedSpInstr && facWorkGrouppEntity.groupMembers) {
        //    facWorkGrouppEntity.getFacAssessStatus();
        //}
    }

}

export class FacWorkGroupExt  {
   canPublish: boolean = null;
}

export var facWorkGrpEntityExt: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.workGroup,
    ctorFunc: FacWorkGroupExt,
    initFunc: (facWorkGrpEntity: any) => new FacWorkGroupInitizer(facWorkGrpEntity)
}