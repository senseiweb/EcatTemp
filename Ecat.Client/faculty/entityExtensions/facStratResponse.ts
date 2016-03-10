import * as _mp from 'core/common/mapStrings'

export class FacSpStratResponseExt implements ecat.entity.ext.IStratEvaluator {
    isValid = false;
    validationErrors: Array<{ cat: string, text: string }>;
    proposedPosition: number = null;

}

export var facStratCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.facStratResponse,
    ctorFunc: FacSpStratResponseExt,
    initFunc: null
}