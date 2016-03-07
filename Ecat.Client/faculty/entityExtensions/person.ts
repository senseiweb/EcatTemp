import _staticDs from 'core/service/data/static';
import * as _mp from 'core/common/mapStrings'
import {PersonExtBase, PersonInitializer } from 'core/entityExtension/person'


class FacPersonExt extends PersonExtBase { }

export var facPersonCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.person,
    ctorFunc: FacPersonExt,
    initFunc: (personEntity: ecat.entity.IPerson) => new PersonInitializer(personEntity)
}