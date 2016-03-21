import * as _mp from 'core/common/mapStrings'
import * as _mpe from 'core/common/mapEnum'
import ICommon from 'core/common/commonService'
import _staticDs from "core/service/data/static"
import {SpInventoryExtBase} from 'core/entityExtension/spInventory'


class FacSpInventoryExt extends SpInventoryExtBase implements ecat.entity.ext.IFacSpInventoryExt {
    private _facSpResultForStudent: ecat.entity.ext.IBehaveResultForStud = null;
    workGroup: ecat.entity.IWorkGroup;

    resetResults(): void {
        this._facSpResultForStudent = null;
    }

    get behaveResultForStudent(): ecat.entity.ext.IBehaveResultForStud {
        if (this._facSpResultForStudent) return this._facSpResultForStudent;
        if (!this.workGroup) return null;

        const groupMembers = this.workGroup.groupMembers.sort(this.sortPeersByLastName);
        const facResponseForThisItem = this.workGroup.facSpResponses.filter(response => response.inventoryItemId === this.id);

        groupMembers.forEach((gm, gmIdx, gmArray) => {
            const current = {} as any;
            const givenBo = {};
            const receivedBo = {};
            const selfBo = {};
            const givenResp = [];
            const rcvdResp = [];

            gm.assesseeSpResponses
                .filter(response => response.inventoryItemId === this.id &&
                    response.assesseePersonId === response.assessorPersonId)
                .forEach(response => {
                    if (selfBo[response.mpItemResponse]) selfBo[response.mpItemResponse] += 1;
                    if (!selfBo[response.mpItemResponse]) selfBo[response.mpItemResponse] = 1;
                });

            gm.assesseeSpResponses
                .filter(response => response.inventoryItemId === this.id &&
                    response.assesseePersonId !== response.assessorPersonId)
                .forEach(response => {
                    rcvdResp.push({ name: response.assessor.studentProfile.person.lastName, itemResp: response.mpItemResponse, score: response.itemModelScore, color: '#000000' });
                    if (receivedBo[response.mpItemResponse]) receivedBo[response.mpItemResponse] += 1;
                    if (!receivedBo[response.mpItemResponse]) receivedBo[response.mpItemResponse] = 1;
                });

            gm.assessorSpResponses
                .filter(response => response.inventoryItemId === this.id &&
                    response.assesseePersonId !== response.assessorPersonId)
                .forEach(response => {
                    givenResp.push({ name: response.assessee.studentProfile.person.lastName, itemResp: response.mpItemResponse, score: response.itemModelScore, color: '#000000' });
                    if (givenBo[response.mpItemResponse]) givenBo[response.mpItemResponse] += 1;
                    if (!givenBo[response.mpItemResponse]) givenBo[response.mpItemResponse] = 1;

                });

            const facResponse = facResponseForThisItem.filter(response => response.assesseePersonId === gm.studentId)[0];
            current.selfOutcome = _staticDs.breakDownCalculation(selfBo);
            current.gvnOutcome = _staticDs.breakDownCalculation(givenBo);
            current.rcvdOutcome = _staticDs.breakDownCalculation(receivedBo);
            current.facOutcome = (facResponse) ? _staticDs.prettifyItemResponse(facResponse.mpItemResponse) : 'Not Assessed';

            givenResp.forEach(resp => {
                switch (resp.itemResp) {
                    case 'IEA': resp.color = '#AA0000'; break;
                    case 'IEU': resp.color = '#FE6161'; break;
                    case 'ND': resp.color = '#AAAAAA'; break;
                    case 'EA': resp.color = '#00AA58'; break;
                    case 'EU': resp.color = '#73FFBB'; break;
                    case 'HEA': resp.color = '#00308F'; break;
                    case 'HEU': resp.color = '#7CA8FF'; break;
                }
            });
            rcvdResp.forEach(resp => {
                switch (resp.itemResp) {
                    case 'IEA': resp.color = '#AA0000'; break;
                    case 'IEU': resp.color = '#FE6161'; break;
                    case 'ND': resp.color = '#AAAAAA'; break;
                    case 'EA': resp.color = '#00AA58'; break;
                    case 'EU': resp.color = '#73FFBB'; break;
                    case 'HEA': resp.color = '#00308F'; break;
                    case 'HEU': resp.color = '#7CA8FF'; break;
                }
            });

            current.respByBehav = {
                gvnResp: givenResp,
                rcvdResp: rcvdResp
            }

            if (this._facSpResultForStudent) {
                this._facSpResultForStudent[gm.studentId] = current;
            } else {
                this._facSpResultForStudent = {} as any;
                this._facSpResultForStudent[gm.studentId] = current;
            }
        });
        return this._facSpResultForStudent;
    };

 
    private sortPeersByLastName(a: ecat.entity.ICrseStudInGroup, b: ecat.entity.ICrseStudInGroup) {
        if (a.nameSorter.last < b.nameSorter.last) return -1;
        if (a.nameSorter.last > b.nameSorter.last) return 1;
        if (a.nameSorter.last === b.nameSorter.last) {
            if (a.nameSorter.first < b.nameSorter.first) return -1;
            if (a.nameSorter.first < b.nameSorter.first) return 1;
        };
        return 0;
    }
}

export var facSpInventoryCfg: ecat.entity.ext.IEntityExtension = {
    entityName: _mp.MpEntityType.spInventory,
    ctorFunc: FacSpInventoryExt,
    initFunc: null
}

