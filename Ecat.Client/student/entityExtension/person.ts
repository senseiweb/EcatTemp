import _staticDs from "core/service/data/static";
import * as _mp from "core/common/mapStrings"
import {PersonExtBase, PersonInitializer } from "core/entityExtension/person"


class StudPersonExt extends PersonExtBase  { }

export var studPersonCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.person,
    ctorFunc: StudPersonExt,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}