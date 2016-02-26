
declare module ecat.entity
{
    module ext  {
        interface ISpStatusBreakOut {
            highEff: number;
            eff: number;
            ineff: number;
            nd: number;
        }

        interface ICrseStudInGroupStatus {
            assessComplete: boolean;
            isPeerAllComplete: boolean;
            stratComplete: boolean;
            breakout: ISpStatusBreakOut;
            missingAssessItems: Array<number>;
            compositeScore: number;
            hasComment: boolean;
        }

        interface IStatusOfPeer {
            [peerId: number]: ICrseStudInGroupStatus;
        }

        interface ICrseStudInGrpExt {
            getMigStatus(): void;
            statusOfPeer: IStatusOfPeer;
        }

        interface IFacSpInventoryExt {
            responseForAssessee: IFacSpResponse;
            compositeScore: number;
            behaviorFreq: number;
            behaviorEffect: number;
            behaviorDisplayed: boolean;
        }

        interface ISpInventoryExt {
            responseForAssessee: ISpRespnse;
            compositeScore: number;
            behaviorFreq: number;
            behaviorEffect: number;
            behaviorDisplayed: boolean;
        }
    }

    interface ICompositeKey {
        entityId: string;
    }

    interface GroupClientExtensions {
        groupSpComplete: boolean;
    }

    interface IEntityExtension {
        entityName: string;
        ctorFunc: Function;
        initFunc: (entity: breeze.Entity) => void;
    }

    //#region Model Owner: User
    interface PersonClientExtensions {
        verifyPassword: string;
        defaultAvatarLocation: string;
        prettyInstituteRole: string;
        saluatation: string;
    }

    interface IStudent extends breeze.Entity, s.user.ProfileStudent {
        person: IPerson;
    }

    interface IFaculty extends breeze.Entity, s.user.ProfileFaculty {
        person: IPerson
    }

    interface IExternal extends breeze.Entity, s.user.ProfileExternal {
        person: IPerson
    }

    interface IProfile extends breeze.Entity, s.user.ProfileBase {
        person: IPerson;
    }

    interface IPerson extends breeze.Entity, s.user.Person, PersonClientExtensions {
        student: IStudent;
        faculty: IFaculty;
        external: IExternal;
    }
    //#endregion

    //#region Model Owner: Staff
    //#endregion

    //#region Model Owner: School

    interface IStudInCrse extends breeze.Entity, s.school.StudentInCourse, ICompositeKey {
        course: ICourse;
        workGroupEnrollments: ICrseStudInGroup[];
    }

    interface IFacInCrse extends breeze.Entity, s.school.FacultyInCourse, ICompositeKey {
        course: ICourse;
        faculty: IFaculty;
    }

    interface IWorkGroup extends breeze.Entity, s.school.WorkGroup {
        groupMembers: ICrseStudInGroup[];
    }

    interface ICourse extends breeze.Entity, s.school.Course { }

    interface ICrseStudInGroup extends breeze.Entity, s.school.CrseStudentInGroup, ICompositeKey, ext.ICrseStudInGrpExt {
        groupPeers: ICrseStudInGroup[];
        group: IWorkGroup;
        student: IStudent;
        assessorSpResponses: ISpRespnse[];
        assesseeSpResponses: ISpRespnse[];
        authorOfComments: ISpComment[];
        recipientOfComments: ISpComment[];
        assessorStratResponse: IStratResponse[];
        assesseeStratResponse: IStratResponse[];

    }

    interface IAcademy extends breeze.Entity, s.school.Academy { }

    //#endregion

    //#region Model Owner: Learner
    interface ISpResult extends breeze.Entity, s.learner.SpResult { }

    interface IStratResult extends breeze.Entity, s.learner.StratResult, ICompositeKey {}

    interface ISpRespnse extends breeze.Entity, s.learner.SpResponse, ICompositeKey {
        inventoryItem: IStudSpInventory | IFacSpInventory;
        assessResult: ISpResult;
        assessor: ICrseStudInGroup;
        assessee: ICrseStudInGroup;
    }

    interface ISpComment extends breeze.Entity, s.learner.SpComment, ICompositeKey {
        author: ICrseStudInGroup;
        recipient: ICrseStudInGroup;
        commentFlaggedBy: IFacInCrse;
        workGroup: IWorkGroup;
    }

    interface IStratResponse extends breeze.Entity, s.learner.StratResponse, ICompositeKey {
        assessor: ICrseStudInGroup;
        assessee: ICrseStudInGroup;
        stratResult: IStratResult;
    }

    //#endregion

    //#region Model Owner: Faculty

    interface IFacSpComment extends breeze.Entity, s.faculty.FacSpComment, ICompositeKey {
        faculty: IFacInCrse;
        student: ICrseStudInGroup;
    }

    interface IFacSpResponse extends breeze.Entity, s.faculty.FacSpResponse, ICompositeKey { }

    interface IFacStratResponse extends breeze.Entity, s.faculty.FacStratResponse, ICompositeKey { }
    //#endregion

    //#region Model Owner: Designer
    interface ISpInstrument extends breeze.Entity, s.designer.SpInstrument { }

    interface IFacSpInventory extends breeze.Entity, s.designer.SpInventory, ext.IFacSpInventoryExt { }

    interface IStudSpInventory extends breeze.Entity, s.designer.SpInventory, ext.ISpInventoryExt { }

    //#endregion

    //#region Model Owner: Common
    interface ILoginToken extends breeze.Entity, s.common.LoginToken {
        person: IPerson;
    }

    //#endregion

    //#region Model Owner: Cognitive
    //#endregion
}