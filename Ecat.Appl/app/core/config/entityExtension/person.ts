import * as AppVar from "appVars"
import locatlDs from "core/service/data/local";

export class PersonInitializer
{
    initProperties = ['mpMilAffiliation', 'mpGender', 'mpMilPaygrade', 'mpMilComponent'];

    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
              const imgDirectory = '/wwwroot/content/img/avatars/';
              person.defaultAvatarLocation = `${imgDirectory}default.png`;
        }

        //this.initProperties.forEach((property) => {
        //    if (person[property] === 'Unknown') {
        //        person[property] = null;
        //    }
        //});
        
    }
}

export class PersonClientExtended implements ecat.entity.PersonClientExtensions
{
    private mpInstituteRole: string;
    private mpMilPaygrade: string;
    private mpMilComponent: string;
    private mpMilAffiliation: string;

    defaultAvatarLocation: string;
    verifyPassword: string;

    get saluatation(): string {
        const paygradeList = locatlDs;

        if (!this.mpMilPaygrade) {
            return null;
        } 

        if (this.mpMilPaygrade === AppVar.EcMapPaygrade.civ) {
            return 'Civ';
        }

        if (this.mpMilPaygrade === AppVar.EcMapPaygrade.fn) {
            return 'FN';
        }

        if (!this.mpMilPaygrade || !this.mpInstituteRole || !this.mpMilComponent) {
            return null;
        } 

        for (let paygrade in paygradeList) {
            if (!paygradeList.hasOwnProperty(paygrade)) {
                return null;
            }

            if (paygrade.designator === this.mpMilComponent) {
                switch (this.mpMilAffiliation) {
                case AppVar.EcMapAffiliation.usa:
                        return paygrade.designator.usa.rankShortName;
                case AppVar.EcMapAffiliation.usaf:
                    return paygrade.designator.usaf.rankShortName;
                case AppVar.EcMapAffiliation.usn:
                case AppVar.EcMapAffiliation.uscg:
                    return paygrade.designator.usn.rankShortName;
                case AppVar.EcMapAffiliation.usmc:
                    return paygrade.designator.usmc.rankShortName;
                default:
                    return null;
                }
            }
        }
        return null;
    }

    get prettyInstituteRole(): string {
        switch (this.mpInstituteRole) {
            case AppVar.EcMapInstituteRole.student:
                return 'Student';
            case AppVar.EcMapInstituteRole.facilitator:
                return 'Facilatator';
            case AppVar.EcMapInstituteRole.external:
                return 'External User';
            default:
                return null;
        }
    }
}

export var personConfig: ecat.entity.IEntityExtension = {
    entityName: AppVar.EcMapEntityType.person,
    ctorFunc: this.PersonClientExtended,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}