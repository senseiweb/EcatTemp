import * as AppVar from "appVars"

interface ISpStatus {
    selfAssessComplete: boolean,
    peersAssessed: number,
    hEGiven: number,
    eGiven: number,
    iEGiven: number,
    nDGiven: number,
}

interface IResponsesByMemeber {
    groupMemberId: number,
    responseCount: number
}

export class GroupMemberInitializer {
    constructor(groupMember: ecat.entity.IGroupMember) {

    }
}

export class GroupMemberClientExtended implements ecat.entity.GroupMemberClientExtensions
{
    private assessorSpResponses: Ecat.Models.SpAssessResponse[];
    private groupMembers: Ecat.Models.EcGroupMember[];
    private instrument: Ecat.Models.SpInstrument;
    private selfMember: Ecat.Models.EcGroupMember;

    get spStatus(): ISpStatus {
        var spStatus: ISpStatus;
        spStatus.selfAssessComplete = false;
        spStatus.peersAssessed = 0;
        spStatus.hEGiven = 0;
        spStatus.eGiven = 0;
        spStatus.iEGiven = 0;
        spStatus.nDGiven = 0;

        if (this.assessorSpResponses.length < 1) { return spStatus; }

        var responsesByMember: IResponsesByMemeber[];
        this.groupMembers.forEach(gm => {
            var responsesThisMember: IResponsesByMemeber;
            responsesThisMember.groupMemberId = gm.id;
            responsesThisMember.responseCount = 0;
            responsesByMember.push(responsesThisMember);
        });

        this.assessorSpResponses.forEach(resp => {
            for (var i = 0; i < responsesByMember.length; i++) {
                if (responsesByMember[i].groupMemberId === resp.assesseeId) {
                    responsesByMember[i].responseCount += 1;
                    break;
                }
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

        responsesByMember.forEach(rbm => {
            if (rbm.responseCount === this.instrument.inventories.length) {
                if (rbm.groupMemberId === this.selfMember.id) {
                    spStatus.selfAssessComplete = true;
                } else {
                    spStatus.peersAssessed += 1;
                }
            }
        });

        return spStatus;

        //this.groupMembers.forEach(gm => {
        //    var respsonsesByMember = this.assessorSpResponses.filter(resp => {
        //        if (resp.assesseeId === gm.id) { return true; }
        //        return false;
        //    });

        //    if (respsonsesByMember.length === this.instrument.inventories.length) {
        //        if (gm.id === respsonsesByMember[0].assesseeId) {
        //            spStatus.selfAssessComplete = true;
        //        } else { 
        //            spStatus.peersAssessed += 1;
        //        }
        //    }

        //    respsonsesByMember.forEach(resp => {
        //        if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Heu
        //            || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Hea) {
        //            spStatus.hEGiven += 1;
        //        } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Eu
        //            || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Ea) {
        //            spStatus.eGiven += 1;
        //        } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Iea
        //            || resp.mpSpItemResponse === AppVar.EcSpItemResponse.Ieu) {
        //            spStatus.iEGiven += 1;
        //        } else if (resp.mpSpItemResponse === AppVar.EcSpItemResponse.Nd) {
        //            spStatus.nDGiven += 1;
        //        }
        //    });
        //});

    }
}

export var groupMemberConfig: ecat.entity.IEntityExtension = {
    entityName: AppVar.EcMapEntityType.grpMember,
    ctorFunc: GroupMemberClientExtended,
    initFunc: (groupMemberEntity: ecat.entity.IGroupMember) => new GroupMemberInitializer(groupMemberEntity)
}