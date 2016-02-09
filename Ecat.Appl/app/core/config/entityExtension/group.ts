//import * as AppVar from "appVars"

//export class GroupInitializer {
//    constructor(group: ecat.entity.IGroup) {

//    }
//}

//export class GroupClientExtended implements ecat.entity.GroupClientExtensions {
//    private members: Ecat.Models.EcGroupMember[];

//    get groupSpComplete(): boolean {
//        var membersComplete = 0;
//        this.members.forEach(m => {
//            if (m.assessorSpResponses.length != this.members.length) { return false; }
//            if (m.assessorStratResponse.length != this.members.length) { return false; }
//            membersComplete += 1;
//        });

//        if (membersComplete != this.members.length) { return false; }

//        return true;
//    }
//}

//export var groupConfig: ecat.entity.IEntityExtension = {
//    entityName: AppVar.EcMapEntityType.group,
//    ctorFunc: GroupClientExtended,
//    initFunc: (groupEntity: ecat.entity.IGroup) => new GroupInitializer(groupEntity);
//}