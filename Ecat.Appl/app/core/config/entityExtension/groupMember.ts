import * as AppVar from "appVars"

interface ISpStatus {
    selfAssessComplete: boolean,
    peersAssessed: number,
    hEGiven: number,
    eGiven: number,
    iEGiven: number,
    nDGiven: number,
}

export class GroupMemberInitializer {
    constructor(groupMember: ecat.entity.IGroupMember) {

    }
}

export class GroupMemberClientExtended implements ecat.entity.GroupMemberClientExtensions
{
    private assessorSpResponses: Ecat.Models.SpAssessResponse[];

    get spStatus(): ISpStatus {
        var spStatus: ISpStatus;
        spStatus.selfAssessComplete = false;
        spStatus.peersAssessed = 0;
        spStatus.hEGiven = 0;
        spStatus.eGiven = 0;
        spStatus.iEGiven = 0;
        spStatus.nDGiven = 0;

        if (this.assessorSpResponses.length < 1) { return spStatus; }
        
        this.assessorSpResponses.forEach(resp => {
            if (resp.assesseeId === resp.assessorId) {
                spStatus.selfAssessComplete = true;
            } else {
                spStatus.peersAssessed += 1;
            }

            if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Heu
                || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Hea) {
                spStatus.hEGiven += 1;
            } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Eu
                || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Ea) {
                spStatus.eGiven += 1;
            } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Iea
                || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Ieu) {
                spStatus.iEGiven += 1;
            } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Nd) {
                spStatus.nDGiven += 1;
            }
        });

        return spStatus;
    }
}

export var groupMemberConfig: ecat.entity.IEntityExtension = {
    entityName: AppVar.EcMapEntityType.grpMember,
    ctorFunc: GroupMemberClientExtended,
    initFunc: (groupMemberEntity: ecat.entity.IGroupMember) => new GroupMemberInitializer(groupMemberEntity)
}