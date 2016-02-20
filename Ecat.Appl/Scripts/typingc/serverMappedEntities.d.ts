
declare module ecat.entity
{
    interface PersonClientExtensions {
        verifyPassword: string;
        defaultAvatarLocation: string;
        prettyInstituteRole: string;
        saluatation: string;
    }

    //interface GroupMemberClientExtensions {
    //    spStatus: {
    //        selfAssessComplete: boolean,
    //        peersAssessed: number,
    //        hEGiven: number,
    //        eGiven: number,
    //        iEGiven: number,
    //        nDGiven: number,
    //    }
    //}

    interface GroupClientExtensions {
        groupSpComplete: boolean;
    }

    interface IEntityExtension {
        entityName: string;
        ctorFunc: Function;
        initFunc: (entity: breeze.Entity) => void;
    }

    interface IAcademy extends breeze.Entity, Ecat.Shared.Model.AcademyCategory {
        
    }

    interface IPerson extends breeze.Entity, Ecat.Shared.Model.Person, PersonClientExtensions
    {
        student: IStudent;
        facilitator: IFacilitator;
        external: IExternal;

    }

    interface ILoginToken extends breeze.Entity, Ecat.Shared.Model.LoginToken
    {
        person: IPerson;
    }

    interface ISpInstrument extends breeze.Entity, Ecat.Shared.Model.SpInstrument { }

    interface ISpInventory extends breeze.Entity, Ecat.Shared.Model.SpInventory { }

    interface ICourseMember extends breeze.Entity, Ecat.Shared.Model.MemberInCourse {
        course: ICourse;
        studGroupEnrollments: IMemberInGroup[];
    }

    interface IWorkGroup extends breeze.Entity, Ecat.Shared.Model.WorkGroup {
        groupMembers: IMemberInGroup[];
   
    }

    interface ICourse extends breeze.Entity, Ecat.Shared.Model.Course {}

    interface IMemberInGroup extends breeze.Entity, Ecat.Shared.Model.MemberInGroup, ext.IMemberInGrpExt {
        groupPeers: IMemberInGroup[];
        group: IWorkGroup;
        student: IStudent;
    }

    interface IStudent extends breeze.Entity, Ecat.Shared.Model.Student {
        person: IPerson;
    }

    interface IFacilitator extends breeze.Entity, Ecat.Shared.Model.Facilitator { }

    interface IExternal extends breeze.Entity, Ecat.Shared.Model.External { }
    
    interface ISecurity extends breeze.Entity, Ecat.Shared.Model.Security { }

    interface IProfile extends breeze.Entity, Ecat.Shared.Model.Profile { }

    interface IFacSpAssess extends breeze.Entity, Ecat.Shared.Model.FacSpAssessResponse { }

    interface ISpAssess extends breeze.Entity, Ecat.Shared.Model.SpAssessResponse { }

    interface ISpAssessResponse extends breeze.Entity, Ecat.Shared.Model.SpAssessResponse {}

    interface ISpComment extends breeze.Entity, Ecat.Shared.Model.SpComment {
        author: IMemberInGroup;
        recipient: IMemberInGroup;
    }
}