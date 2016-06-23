
declare module ecat.entity
{
   //#region Client Extensions
    module ext  {

        interface ISpGaveStatusBreakOut {
            gaveHE: number;
            gaveE: number;
            gaveIE: number;
            gaveND: number;
        }

        interface ISpStatusBreakOut {
            HE: number;
            E: number;
            IE: number;
            ND: number;
        }

        interface ICrseStudInGrpStatus {
            assessComplete: boolean;
            isPeerAllComplete: boolean;
            stratComplete: boolean;
            breakout: ISpStatusBreakOut;
            breakOutChartData: Array<any>;
            missingAssessItems: Array<number>;
            compositeScore: number;
            stratedPosition: number;
            hasComment: boolean;
        }

        interface ICrseStudInGrpResult {
            self: string;
            peer: string;
            faculty: string;
            strat: number;
        }

        interface ISpInventoryStudResult {
            aggregSelf: string;
            aggregPeer: string;
            aggregFac: string;
        }

        interface IStratEvaluator {
            stratIsValid: boolean;
            stratValidationErrors: Array<{ cat: string, text: string }>;
            proposedStratPosition: number;
        }

        interface IFacCrseStudInGrpStatus {
            assessComplete: boolean;
            stratComplete: boolean;
            missingAssessItems: Array<number>;
            breakout: ISpStatusBreakOut;
            gaveBreakOut: ISpGaveStatusBreakOut;
            breakOutChartData: Array<any>;
            gaveBreakOutChartData: Array<any>;
            compositeScore: number;
            gaveCompositeScore: number;
            stratedPosition: number;
            hasComment: boolean;
        }

        interface IStatusOfPeer {
            [peerId: number]: ICrseStudInGrpStatus;
        }
        
        interface IStatusOfStudent {
            [studentId: number]: IFacCrseStudInGrpStatus;
        }

        interface ICrseStudInGrpExt extends IStratEvaluator {
            statusOfPeer: IStatusOfPeer;
            updateStatusOfPeer(): IStatusOfPeer;
            nameSorter: {last:string; first: string}
            rankName: string;
        }

        interface IStudentDetailResult {
            outcome: string;
            finalStrat: number;
            compositeScore: number;
            breakOutReceived: Array<{ label: string; data: number; color: string }>;
        }

        interface IFacCrseStudInGrpExt extends ICrseStudInGrpExt {
            updateStatusOfStudent(): IFacCrseStudInGrpStatus;
            numberOfAuthorComments: number;
            resultForStudent: IStudentDetailResult;
            statusOfStudent: IFacCrseStudInGrpStatus;
        }

        interface ISpInventoryExtBase {
            responseForAssessee: ISpResponse | IFacSpResponse;
            spResult: ISpResult;
            compositeScore: number;
            resetAssess(): void;
            resetResult(): void;
            rejectChanges(): void;
            behaviorFreq: number;
            behaviorEffect: number;
            behaviorDisplayed: boolean;
            resultBreakOut: {
                selfResult: string;
                peersResult: string;
                facultyResult: string;
                peerBoChart: Array<any>;
            }
        }

        interface IFacSpInventoryExt extends ISpInventoryExtBase {
            workGroup: IWorkGroup;
            resetResults(): void;
            behaveResultForStudent: IBehaveResultForStud;
        }

        interface IBehaveResultForStud {
            gvnOutcome: string;
            rcvdOutcome: string;
            facOutcome: string;
            chart: {
                gvnTicks: Array<Array<any>>;
                rcvdTicks: Array<Array<any>>;
                gvnDataset: Array<Array<number>>;
                rcxdDataset: Array<Array<number>>;
            }
        }

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
            salutation: string;
        }

    }
    //#endregion
    
   //#region Model Owener User
    interface IStudentProfile extends breeze.Entity, s.user.ProfileStudent {
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
        student: IStudentProfile;
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
        student: IStudentProfile;
    }

    interface IFacInCrse extends breeze.Entity, s.school.FacultyInCourse, ext.ICompositeKey {
        course: ICourse;
        facultyProfile: IFaculty;
    }

    interface IWorkGroup extends breeze.Entity, s.school.WorkGroup {
        groupMembers: ICrseStudInGroup[];
        spComments: IStudSpComment[];
        facSpComments: IFacSpComment[];
        facStratResponses: IFacStratResponse[];
        spStratResponses: IStratResponse[];
        assignedSpInstr: ISpInstrument;
    }

    interface ICourse extends breeze.Entity, s.school.Course {
        workGroups: IWorkGroup[];
        students: IStudInCrse[];
        faculty: IFacInCrse[];
    }

    interface ICrseStudInGroup extends breeze.Entity, s.school.CrseStudentInGroup, ext.ICompositeKey, ext.ICrseStudInGrpExt, ext.IFacCrseStudInGrpExt {
        groupPeers: ICrseStudInGroup[];
        workGroup: IWorkGroup;
        studentProfile: IStudentProfile;
        assessorSpResponses: ISpResponse[];
        assesseeSpResponses: ISpResponse[];
        authorOfComments: IStudSpComment[];
        recipientOfComments: IStudSpComment[];
        assessorStratResponse: IStratResponse[];
        assesseeStratResponse: IStratResponse[];
        course: ICourse;
        studentInCourse: IStudInCrse;
        facultyStrat: IFacStratResponse;
        studentStrat: IStratResponse;
    }

    interface IAcademy extends breeze.Entity, s.school.Academy { }
    //#endregion

   //#region Model Owner Learner
    interface ISantiziedResponse extends breeze.Entity, s.learner.SanitizedSpResponse { }

    interface ISantiziedComment extends breeze.Entity, s.learner.SanitizedSpComment {}

    interface ISpResult extends breeze.Entity, s.learner.SpResult {
        assignedInstrument: ISpInstrument;
        sanitizedComments: ISantiziedComment[];
        resultFor: ICrseStudInGroup;
    }

    interface IStratResult extends breeze.Entity, s.learner.StratResult, ext.ICompositeKey {}

    interface IStudSpCommentFlag extends breeze.Entity, s.learner.StudSpCommentFlag {
        comment: IStudSpComment;
        flaggedByFaculty: IFacInCrse;
    }

    interface ISpResponse extends breeze.Entity, s.learner.SpResponse, ext.ICompositeKey {
        inventoryItem: IStudSpInventory | IFacSpInventory;
        assessResult: ISpResult;
        assessor: ICrseStudInGroup;
        assessee: ICrseStudInGroup;
    }

    interface IStudSpComment extends breeze.Entity, s.learner.StudSpComment, ext.ICompositeKey {
        author: ICrseStudInGroup;
        recipient: ICrseStudInGroup;
        workGroup: IWorkGroup;
        flag: IStudSpCommentFlag;
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
        recipient: ICrseStudInGroup;
        flag: IFacSpCommentFlag;
    }

    interface IFacSpCommentFlag extends breeze.Entity, s.faculty.FacSpCommentFlag {
        comment: IFacSpComment;
    }

    interface IFacSpResponse extends breeze.Entity, s.faculty.FacSpResponse, ext.ICompositeKey {
        assessee: ICrseStudInGroup;
    }

    interface IFacStratResponse extends breeze.Entity, s.faculty.FacStratResponse, ext.ICompositeKey {
        studentAssessee: ICrseStudInGroup;
    }
    //#endregion

   //#region Model Owner Designer
    interface ISpInstrument extends breeze.Entity, s.designer.SpInstrument {
        inventoryCollection: ISpInventory[];
    }

    interface ISpInventory extends breeze.Entity, s.designer.SpInventory, ext.ISpInventoryExtBase { }

    interface IFacSpInventory extends ISpInventory, ext.IFacSpInventoryExt { }

    interface IStudSpInventory extends ISpInventory, ext.IStudSpInventoryExt { }
    //#endregion

    //#region Model Owner LmsAdmin
    interface ICourseRecon extends breeze.Entity, s.lmsAdmin.CourseReconResult {
    courses: ICourse[];
    }

    interface IMemRecon extends breeze.Entity, s.lmsAdmin.MemReconResult {
        courseMembers: IPerson[];
    }

    interface IGrpMemRecon extends breeze.Entity, s.lmsAdmin.GroupMemReconResult {
        groupMembers: ICrseStudInGroup[];
    }

    interface IGrpRecon extends breeze.Entity, s.lmsAdmin.GroupReconResult {
        groups: IWorkGroup[];
    }

    interface ISaveGradesResp extends breeze.Entity, s.lmsAdmin.SaveGradesResult {
        
    }

    interface ISpInventory extends breeze.Entity, s.designer.SpInventory, ext.ISpInventoryExtBase { }

    interface IFacSpInventory extends ISpInventory, ext.IFacSpInventoryExt { }

    interface IStudSpInventory extends ISpInventory, ext.IStudSpInventoryExt { }
    //#endregion
  
}