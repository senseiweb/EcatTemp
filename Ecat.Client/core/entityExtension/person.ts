import _staticDs from "core/service/data/static";
import * as _mp from "core/common/mapStrings"

export class PersonInitializer {
    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
            const imgDirectory = '/Client/content/img/avatars/';
            person.defaultAvatarLocation = `${imgDirectory}default.png`;
        }
    }
}

export class PersonClientExtended implements ecat.entity.PersonClientExtensions {
    private mpInstituteRole: string;
    private mpPaygrade: string;
    private mpComponent: string;
    private mpAffiliation: string;

    defaultAvatarLocation: string;
    verifyPassword: string;

    get saluatation(): string {
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

        if (!this.mpPaygrade || !this.mpInstituteRole || !this.mpComponent) {
            return null;
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
        return null;
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


export class StudentPersonInitializer {
    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
            const imgDirectory = '/Client/content/img/avatars/';
            person.defaultAvatarLocation = `${imgDirectory}default.png`;
        }
    }
}

export class StudentPersonExtended {
    private mpInstituteRole: string;
    private mpPaygrade: string;
    private mpComponent: string;
    private mpAffiliation: string;

    defaultAvatarLocation: string;
    verifyPassword: string;

    get saluatation(): string {
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

        if (!this.mpPaygrade || !this.mpInstituteRole || !this.mpComponent) {
            return null;
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
        return null;
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

export var personConfig: ecat.entity.IEntityExtension = {
    entityName: _mp.EcMapEntityType.person,
    ctorFunc: PersonClientExtended,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}

export var studentPersonConfig: ecat.entity.IEntityExtension = {
    entityName: _mp.EcMapEntityType.person,
    ctorFunc: StudentPersonExtended,
    initFunc: (studentPersonEntity: ecat.entity.IPerson) => new StudentPersonInitializer(studentPersonEntity)
}