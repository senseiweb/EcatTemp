import _staticDs from 'core/service/data/static';
import * as _mp from 'core/common/mapStrings'
import {SpCommentBase} from 'core/entityExtension/spComment'


class FacSpCommentExt extends SpCommentBase { }

export var facSpCommentCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.spComment,
    ctorFunc: FacSpCommentExt,
    initFunc: null
}