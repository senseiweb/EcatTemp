import * as _mp from 'core/common/mapStrings'


export class StudSpStratResponseExt implements ecat.entity.ext.IStratEvaluator {
    isValid = false;
    validationErrors: Array<{ cat: string, text: string }> = null;
    proposedPosition: number = null;

}

export var studStratCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.spStrat,
    ctorFunc: StudSpStratResponseExt,
    initFunc: null
}