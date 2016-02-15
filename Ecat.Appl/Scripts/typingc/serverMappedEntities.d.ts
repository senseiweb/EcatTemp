
declare module ecat.entity
{
    interface PersonClientExtensions {
        verifyPassword: string;
        defaultAvatarLocation: string;
        prettyInstituteRole: string;
        saluatation: string;
    }

    interface IEntityExtension {
        entityName: string;
        ctorFunc: Function;
        initFunc: (entity: breeze.Entity) => void;
    }

    interface IAcademy extends breeze.Entity, Ecat.Shared.Model.Academy {
        
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

    interface ICourseMember extends breeze.Entity, Ecat.Shared.Model.MemberInCourse{ }

    interface IGroupMember extends breeze.Entity, Ecat.Shared.Model.MemberInGroup { }

    interface IStudent extends breeze.Entity, Ecat.Shared.Model.Student { }

    interface IFacilitator extends breeze.Entity, Ecat.Shared.Model.Facilitator { }

    interface IExternal extends breeze.Entity, Ecat.Shared.Model.External { }

    interface ISecurity extends breeze.Entity, Ecat.Shared.Model.Security { }
}