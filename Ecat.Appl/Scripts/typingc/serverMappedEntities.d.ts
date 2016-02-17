
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
    }

    interface IWorkGroup extends breeze.Entity, Ecat.Shared.Model.WorkGroup { }

    interface ICourse extends breeze.Entity, Ecat.Shared.Model.Course {}

    interface IGroupMember extends breeze.Entity, Ecat.Shared.Model.MemberInGroup { }

    interface IStudent extends breeze.Entity, Ecat.Shared.Model.Student { }

    interface IFacilitator extends breeze.Entity, Ecat.Shared.Model.Facilitator { }

    interface IExternal extends breeze.Entity, Ecat.Shared.Model.External { }
    
    interface ISecurity extends breeze.Entity, Ecat.Shared.Model.Security { }

    interface IProfile extends  breeze.Entity, Ecat.Shared.Model.Profile {}
}