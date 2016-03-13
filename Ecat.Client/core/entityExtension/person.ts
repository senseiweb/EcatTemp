import _staticDs from "core/service/data/static";
import * as _mp from "core/common/mapStrings"

export class PersonInitializer implements ecat.entity.ext.PersonClientExtensions {


    constructor(person: ecat.entity.IPerson) {
        if (person.avatarLocation === null) {
            const imgDirectory = '/Client/content/img/avatars/';
            person.defaultAvatarLocation = `${imgDirectory}default.png`;
            this.salutation = _staticDs.getSalutation(person.mpPaygrade, person.mpComponent, person.mpAffiliation);
            this.prettyInstituteRole = _staticDs.prettyInstituteRole(person.mpInstituteRole);
        }
    }
    defaultAvatarLocation: string;
    verifyPassword: string;
    salutation: string;
    prettyInstituteRole: string;
}

export class PersonExtBase {
  salutation = null;
}

class UserPersonExt extends PersonExtBase { }

class StudPersonExt extends PersonExtBase  { }

export var userPeronCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.person,
    ctorFunc: UserPersonExt,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}

export var studPersonCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.person,
    ctorFunc: StudPersonExt,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}