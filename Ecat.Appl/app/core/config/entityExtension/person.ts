import * as AppVar from "appVars"
import locatlDs from "core/service/data/local";

export class PersonInitializer
{
    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
              const imgDirectory = '/wwwroot/content/img/avatars/';
              person.defaultAvatarLocation = `${imgDirectory}default.png`;
        }
    }
}

export class PersonClientExtended implements ecat.entity.PersonClientExtensions
{
    private mpInstituteRole: string;
    private mpPaygrade: string;
    private mpComponent: string;
    private mpAffiliation: string;

    defaultAvatarLocation: string;
    verifyPassword: string;

    get saluatation(): string {
        const paygradeList = locatlDs;

        if (!this.mpPaygrade) {
            return null;
        } 

        if (this.mpPaygrade === AppVar.EcMapPaygrade.civ) {
            return 'Civ';
        }

        if (this.mpPaygrade === AppVar.EcMapPaygrade.fn) {
            return 'FN';
        }

        if (!this.mpPaygrade || !this.mpInstituteRole || !this.mpComponent) {
            return null;
        } 

        for (let paygrade in paygradeList) {
            if (!paygradeList.hasOwnProperty(paygrade)) {
                return null;
            }

            if (paygrade.designator === this.mpComponent) {
                switch (this.mpAffiliation) {
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
    ctorFunc: PersonClientExtended,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}