import * as _mp from 'core/common/mapStrings'

export class FacSpStratResponseExt implements ecat.entity.ext.IStratEvaluator {
    isValid: boolean;
    validationErrors: Array<{ cat: string, text: string }>;
    proposedPosition: number;

}

export var facStratCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.EcMapEntityType.facStratResponse,
    ctorFunc: FacSpStratResponseExt,
    initFunc: null
}