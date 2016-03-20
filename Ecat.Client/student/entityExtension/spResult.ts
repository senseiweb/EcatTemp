import * as _mp from 'core/common/mapStrings'


export class StudSpResultExt {
    facultyResponses = null;
}

export var studResultCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.spResult,
    ctorFunc: StudSpResultExt,
    initFunc: null
}