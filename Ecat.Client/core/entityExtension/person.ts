import _staticDs from "core/service/data/static";
import * as _mp from "core/common/mapStrings"

export class PersonInitializer implements ecat.entity.ext.PersonClientExtensions {

    private mpInstituteRole: string = null;
    private mpPaygrade: string = null;
    private mpComponent: string = null;
    private mpAffiliation: string = null;

    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
            const imgDirectory = '/Client/content/img/avatars/';
            person.defaultAvatarLocation = `${imgDirectory}default.png`;

            this.mpInstituteRole = person.mpInstituteRole;
            this.mpPaygrade = person.mpPaygrade;
            this.mpComponent = person.mpComponent;
            this.mpAffiliation = person.mpAffiliation;
            this.salutation = this.updateSalutation();
        }
    }


    updateSalutation(): string {
        const paygradeList = _staticDs.milPaygradeGraft;

        if (!this.mpPaygrade) {
            return "NPG";
        }

        if (this.mpPaygrade === _mp.EcMapPaygrade.civ) {
            return 'Civ';
        }

        if (this.mpPaygrade === _mp.EcMapPaygrade.fn) {
            return 'FN';
        }

        if (!this.mpComponent) {
            return this.mpPaygrade;
        }

        for (let paygrade in paygradeList) {
            if (!paygradeList.hasOwnProperty(paygrade)) {
                return 'Udf';
            }

            if (angular.isObject(paygradeList[paygrade]) && paygradeList[paygrade].designator === this.mpPaygrade) {
                
                switch (this.mpAffiliation) {
                    case _mp.EcMapAffiliation.usa:
                        return paygradeList[paygrade].usa.rankShortName;
                    case _mp.EcMapAffiliation.usaf:
                      return paygradeList[paygrade].usaf.rankShortName;
                    case _mp.EcMapAffiliation.usn:
                    case _mp.EcMapAffiliation.uscg:
                        return paygradeList[paygrade].usn.rankShortName;
                    case _mp.EcMapAffiliation.usmc:
                        return paygradeList[paygrade].usmc.rankShortName;
                    default:
                        return 'Unkown';
                }
            }
        }
    }

    defaultAvatarLocation: string;
    verifyPassword: string;
    salutation: string;
   
    get prettyInstituteRole(): string {
        switch (this.mpInstituteRole) {
            case _mp.EcMapInstituteRole.student:
                return 'Student';
            case _mp.EcMapInstituteRole.faculty:
                return 'Facilatator';
            case _mp.EcMapInstituteRole.external:
                return 'External User';
            default:
                return null;
        }
    }
}

export class PersonExtBase {
  salutation = null;
}

class UserPersonExt extends PersonExtBase { }

class StudPersonExt extends PersonExtBase  { }

export var userPeronCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.person,
    ctorFunc: UserPersonExt,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}

export var studPersonCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.person,
    ctorFunc: StudPersonExt,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}