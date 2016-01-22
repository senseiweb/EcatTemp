
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

    interface IPerson extends breeze.Entity, Ecat.Models.EcPerson, PersonClientExtensions
    {
        student: IStudent;
        facilitator: IFacilitator;
    }

    interface ILoginToken extends breeze.Entity, Ecat.Models.LoginToken
    {
        person: IPerson;
    }

    interface ICourseMember extends breeze.Entity, Ecat.Models.EcCourseMember{ }

    interface IStudent extends breeze.Entity, Ecat.Models.EcStudent { }

    interface IFacilitator extends breeze.Entity, Ecat.Models.EcFacilitator { }

    interface ISecurity extends  breeze.Entity, Ecat.Models.EcSecurity {}
}