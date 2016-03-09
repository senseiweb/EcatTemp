import _staticDs from "core/service/data/static";
import * as _mp from "core/common/mapStrings"

export class PersonInitializer {
    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
            const imgDirectory = '/Client/content/img/avatars/';
            person.defaultAvatarLocation = `${imgDirectory}default.png`;
        }
        if (person.mpPaygrade) person.updateSalutation();
    }
}

export class PersonExtBase implements ecat.entity.ext.PersonClientExtensions {
    private mpInstituteRole: string = null;
    private mpPaygrade: string = null;
    private mpComponent: string = null;
    private mpAffiliation: string = null;
    private _salutation: string = null;

    updateSalutation(): string {
        const paygradeList = _staticDs;

        if (!this.mpPaygrade) {
            return null;
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
                return null;
            }

            if (paygrade.designator === this.mpComponent) {
                switch (this.mpAffiliation) {
                    case _mp.EcMapAffiliation.usa:
                        return paygrade.designator.usa.rankShortName;
                    case _mp.EcMapAffiliation.usaf:
                        return paygrade.designator.usaf.rankShortName;
                    case _mp.EcMapAffiliation.usn:
                    case _mp.EcMapAffiliation.uscg:
                        return paygrade.designator.usn.rankShortName;
                    case _mp.EcMapAffiliation.usmc:
                        return paygrade.designator.usmc.rankShortName;
                    default:
                        return null;
                }
            }
        }
        return this.mpPaygrade;
    }

    defaultAvatarLocation: string;
    verifyPassword: string;

    get salutation(): string {
        if (this._salutation) {
            return this._salutation;
        }
        this.updateSalutation();
        return this._salutation;
    }

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