
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

    interface IAcademy extends breeze.Entity, Ecat.Models.EcAcademy {
        
    }

    interface IPerson extends breeze.Entity, Ecat.Models.EcPerson, PersonClientExtensions
    {
        student: IStudent;
        facilitator: IFacilitator;
        external: IExternal;
    }

    interface ILoginToken extends breeze.Entity, Ecat.Models.LoginToken
    {
        person: IPerson;
    }

    interface ICourseMember extends breeze.Entity, Ecat.Models.EcCourseMember{ }

    interface IStudent extends breeze.Entity, Ecat.Models.EcStudent { }

    interface IFacilitator extends breeze.Entity, Ecat.Models.EcFacilitator { }

    interface IExternal extends breeze.Entity, Ecat.Models.EcExternal { }

    interface ISecurity extends breeze.Entity, Ecat.Models.EcSecurity { }

    interface IGroupMember extends breeze.Entity, Ecat.Models.EcGroupMember { }

   
}