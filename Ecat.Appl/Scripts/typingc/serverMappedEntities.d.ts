
declare module ecat.entity
{
    interface PersonClientExtensions {
        verifyPassword: string;
        defaultAvatarLocation: string;
        prettyInstituteRole: string;
        saluatation: string;
    }

    interface GroupMemberClientExtensions {
        spStatus: {
            selfAssessComplete: boolean,
            peersAssessed: number,
            hEGiven: number,
            eGiven: number,
            iEGiven: number,
            nDGiven: number,
        }
    }

    interface GroupClientExtensions {
        groupSpComplete: boolean;
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

    interface IGroupMember extends breeze.Entity, Ecat.Models.EcGroupMember, GroupMemberClientExtensions { }

    interface IStudent extends breeze.Entity, Ecat.Models.EcStudent { }

    interface IFacilitator extends breeze.Entity, Ecat.Models.EcFacilitator { }

    interface IExternal extends breeze.Entity, Ecat.Models.EcExternal { }

    interface ISecurity extends breeze.Entity, Ecat.Models.EcSecurity { }

    interface IGroup extends breeze.Entity, Ecat.Models.EcGroup, GroupClientExtensions { }

    interface ICourseMember extends breeze.Entity, Ecat.Models.EcCourseMember { }
   
}