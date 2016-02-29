
declare module ecat.entity
{
   //#region Client Extensions
    module ext  {
        interface ISpStatusBreakOut {
            HE: number;
            E: number;
            IE: number;
            ND: number;
        }

        interface ICrseStudInGroupStatus {
            assessComplete: boolean;
            isPeerAllComplete: boolean;
            stratComplete: boolean;
            breakout: ISpStatusBreakOut;
            missingAssessItems: Array<number>;
            compositeScore: number;
            stratedPosition: number;
            hasComment: boolean;
        }

        interface IStatusOfPeer {
            [peerId: number]: ICrseStudInGroupStatus;
        }

        interface ICrseStudInGrpExt {
            getMigStatus(): void;
            statusOfPeer: IStatusOfPeer;
        }

        interface ISpInventoryExtBase {
            responseForAssessee: ISpResponse | IFacSpResponse;
            compositeScore: number;
            behaviorFreq: number;
            behaviorEffect: number;
            behaviorDisplayed: boolean;
        }

        interface IFacSpInventoryExt extends ISpInventoryExtBase { }

        interface IStudSpInventoryExt extends ISpInventoryExtBase {}

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

        interface PersonClientExtensions {
            verifyPassword: string;
            defaultAvatarLocation: string;
            prettyInstituteRole: string;
            saluatation: string;
        }

    }
    //#endregion
    
   //#region Model Owener User
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

    interface IStaff extends breeze.Entity, s.user.ProfileStaff {
        person: IPerson;
    }

    interface IPerson extends breeze.Entity, s.user.Person, ext.PersonClientExtensions {
        student: IStudent;
        faculty: IFaculty;
        external:IExternal;
        hqStaff: IStaff;
        profile: IProfile;
    }

    interface ILoginToken extends breeze.Entity, s.common.LoginToken {
        person: IPerson;
    }
    //#endregion

   //#region Model Owner School
    interface IStudInCrse extends breeze.Entity, s.school.StudentInCourse, ext.ICompositeKey {
        course: ICourse;
        workGroupEnrollments: ICrseStudInGroup[];
    }

    interface IFacInCrse extends breeze.Entity, s.school.FacultyInCourse, ext.ICompositeKey {
        course: ICourse;
        faculty: IFaculty;
    }

    interface IWorkGroup extends breeze.Entity, s.school.WorkGroup {
        groupMembers: ICrseStudInGroup[];
    }

    interface ICourse extends breeze.Entity, s.school.Course {
        workGroups: IWorkGroup[];
    }

    interface ICrseStudInGroup extends breeze.Entity, s.school.CrseStudentInGroup, ext.ICompositeKey, ext.ICrseStudInGrpExt {
        groupPeers: ICrseStudInGroup[];
        workGroup: IWorkGroup;
        studentProfile: IStudent;
        assessorSpResponses: ISpResponse[];
        assesseeSpResponses: ISpResponse[];
        authorOfComments: ISpComment[];
        recipientOfComments: ISpComment[];
        assessorStratResponse: IStratResponse[];
        assesseeStratResponse: IStratResponse[];
        course: ICourse;
        studentInCourse: IStudInCrse;
    }

    interface IAcademy extends breeze.Entity, s.school.Academy { }
    //#endregion

   //#region Model Owner Learner
    interface ISpResult extends breeze.Entity, s.learner.SpResult { }

    interface IStratResult extends breeze.Entity, s.learner.StratResult, ext.ICompositeKey {}

    interface ISpResponse extends breeze.Entity, s.learner.SpResponse, ext.ICompositeKey {
        inventoryItem: IStudSpInventory | IFacSpInventory;
        assessResult: ISpResult;
        assessor: ICrseStudInGroup;
        assessee: ICrseStudInGroup;
    }

    interface ISpComment extends breeze.Entity, s.learner.SpComment, ext.ICompositeKey {
        author: ICrseStudInGroup;
        recipient: ICrseStudInGroup;
        commentFlaggedBy: IFacInCrse;
        workGroup: IWorkGroup;
    }

    interface IStratResponse extends breeze.Entity, s.learner.StratResponse, ext.ICompositeKey {
        assessor: ICrseStudInGroup;
        assessee: ICrseStudInGroup;
        stratResult: IStratResult;
    }
    //#endregion

   //#region Model Owner Faculty
    interface IFacSpComment extends breeze.Entity, s.faculty.FacSpComment, ext.ICompositeKey {
        faculty: IFacInCrse;
        student: ICrseStudInGroup;
    }

    interface IFacSpResponse extends breeze.Entity, s.faculty.FacSpResponse, ext.ICompositeKey {
        assessee: ICrseStudInGroup;
    }

    interface IFacStratResponse extends breeze.Entity, s.faculty.FacStratResponse, ext.ICompositeKey { }
    //#endregion

   //#region Model Owner Designer
    interface ISpInstrument extends breeze.Entity, s.designer.SpInstrument { }

    interface ISpInventory extends breeze.Entity, s.designer.SpInventory, ext.ISpInventoryExtBase { }

    interface IFacSpInventory extends ISpInventory, ext.IFacSpInventoryExt { }

    interface IStudSpInventory extends ISpInventory, ext.IStudSpInventoryExt { }
    //#endregion
  
}