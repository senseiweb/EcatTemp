import * as _mp from "core/common/mapStrings"
import * as _mpe from "core/common/mapEnum"

export default class EcLocalDataService {
    static serviceId = 'data.static';

    static milPaygradeGraft: ecat.local.IMilPayGrade = {
        civ: {
            designator: _mp.MpPaygrade.civ
        },
        fn: {
            designator: _mp.MpPaygrade.fn
        },
        e1: {
            designator: _mp.MpPaygrade.e1,
            usaf: {
                rankShortName: 'AB',
                rankLongName: 'Airman Basic'
            },
            usa: {
                rankShortName: 'PVT',
                rankLongName: 'Private'
            },
            usn: {
                rankShortName: 'SR',
                rankLongName: 'Seaman Recurit'
            },
            usmc: {
                rankShortName: 'PVT',
                rankLongName: 'Private'
            }
        },
        e2: {
            designator: _mp.MpPaygrade.e2,
            usaf: {
                rankShortName: 'Amn',
                rankLongName: 'Airman'
            },
            usa: {
                rankShortName: 'PV2',
                rankLongName: 'Private E-2'
            },
            usn: {
                rankShortName: 'SA',
                rankLongName: 'Seaman Apprentice'
            },
            usmc: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            }
        },
        e3: {
            designator: _mp.MpPaygrade.e3,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e4: {
            designator: _mp.MpPaygrade.e4,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e5: {
            designator: _mp.MpPaygrade.e5,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e6: {
            designator: _mp.MpPaygrade.e6,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e7: {
            designator: _mp.MpPaygrade.e7,
            usaf: {
                rankShortName: 'MSgt',
                rankLongName: 'McD'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e8: {
            designator: _mp.MpPaygrade.e8,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        },
        e9: {
            designator: _mp.MpPaygrade.e9,
            usaf: {
                rankShortName: 'A1C',
                rankLongName: 'Airman First Class'
            },
            usa: {
                rankShortName: 'PFC',
                rankLongName: 'Private First Class'
            },
            usn: {
                rankShortName: 'SN',
                rankLongName: 'Seaman'
            },
            usmc: {
                rankShortName: 'LCpl',
                rankLongName: 'Lance Corporal'
            }
        }
    }

    static getSalutation(paygrade: string, component: string, affiliation: string): string {
        const paygradeList = EcLocalDataService.milPaygradeGraft;
        
        if (!paygrade) {
            return "NPG";
        }

        if (paygrade === _mp.MpPaygrade.civ) {
            return 'Civ';
        }

        if (paygrade === _mp.MpPaygrade.fn) {
            return 'FN';
        }

        if (!component) {
            return paygrade;
        }

        const pg = paygrade.toLowerCase();

        if (!paygradeList.hasOwnProperty(pg)) {
            return 'Udf';
        }

        if (angular.isObject(paygradeList[pg]) && paygradeList[pg].designator === paygrade) {

            switch (affiliation) {
            case _mp.MpAffiliation.usa:
                    return paygradeList[pg].usa.rankShortName;
            case _mp.MpAffiliation.usaf:
                    return paygradeList[pg].usaf.rankShortName;
            case _mp.MpAffiliation.usn:
            case _mp.MpAffiliation.uscg:
                    return paygradeList[pg].usn.rankShortName;
            case _mp.MpAffiliation.usmc:
                    return paygradeList[pg].usmc.rankShortName;
            default:
                return 'Unkown';
            }
        }
        return 'Udf'
    }

    static prettyInstituteRole(role: string): string {
        switch (role) {
            case _mp.MpInstituteRole.student:
                return 'Student';
            case _mp.MpInstituteRole.faculty:
                return 'Facilatator';
            case _mp.MpInstituteRole.external:
                return 'External User';
            default:
                return 'Unmapped Role';
        }
    }

    static avgScore(myResponses: Array<ecat.entity.ISpResponse>): string {
        let sumOfReponses = 0;

        myResponses.forEach(response => {
            sumOfReponses += response.itemModelScore;
        });

        const score = sumOfReponses / myResponses.length;

        if (score <= 0) return _mp.MpSpResult.ie;
        if (score < 1) return _mp.MpSpResult.bae;
        if (score < 2) return _mp.MpSpResult.e;
        if (score < 3) return _mp.MpSpResult.aae;
        if (score < 4) return _mp.MpSpResult.he;
        return 'Out of range';
    }

    static rationaleScore(myResponses: Array<ecat.entity.ISpResponse>): string {
        const totalCount = myResponses.length;
        const breakdown = {
            iea: 0,
            ieu: 0,
            ea: 0,
            eu: 0,
            hea: 0,
            heu: 0,
            nd: 0
        }
        myResponses.forEach(response => {
            switch (response.itemModelScore) {
            case _mpe.CompositeModelScore.iea:
                breakdown.iea += 1;
                break;
            case _mpe.CompositeModelScore.ieu:
                breakdown.ieu += 1;
                break;
            case _mpe.CompositeModelScore.eu:
                breakdown.eu += 1;
                break;
            case _mpe.CompositeModelScore.ea:
                breakdown.ea += 1;
                break;
            case _mpe.CompositeModelScore.heu:
                breakdown.heu += 1;
                break;
            case _mpe.CompositeModelScore.hea:
                breakdown.hea += 1;
                break;
            }
        });
        let precentHighEff = (breakdown.hea + breakdown.heu) / totalCount;
        let precentAboveAvgEff = (breakdown.heu + breakdown.ea) / totalCount;
        let precentIneff = (breakdown.iea + breakdown.ieu + breakdown.nd) / totalCount;
        let precentBelowEff = (breakdown.nd + breakdown.eu) / totalCount;
        precentHighEff = Math.round(precentHighEff);
        precentAboveAvgEff = Math.round(precentAboveAvgEff);
        precentIneff = Math.round(precentIneff);
        precentBelowEff = Math.round(precentBelowEff);

        if (precentHighEff > 90) return _mp.MpSpResult.he;
        if (precentAboveAvgEff > 75) return _mp.MpSpResult.aae;
        if (precentIneff > 80) return _mp.MpSpResult.ie;
        if (precentBelowEff > 70) return _mp.MpSpResult.bae;
        return _mp.MpSpResult.e;
    }

    milPaygradeGraft: ecat.local.IMilPayGrade;
    
    constructor() {
        this.milPaygradeGraft = EcLocalDataService.milPaygradeGraft;
    }
    
    get edLevels(): Array<string> {
        const edlevels = [];
        const lclEdLevel = _mp.MpEdLevel;
        for (let edl in lclEdLevel) {
            if (lclEdLevel.hasOwnProperty(edl)) {
                edlevels.push(lclEdLevel[edl]);
            }
        }
        return edlevels;
    }

    getSalutation(paygrade: string, component: string, affiliation: string): string {
        return EcLocalDataService.getSalutation(paygrade, component, affiliation);
    }

    get milAffil(): Array<{ prop: string, value: string }> {
        const affilArray = [];
        const affiliations = _mp.MpAffiliation;
        for (let prop in affiliations) {
            if (affiliations.hasOwnProperty(prop)) {
                affilArray.push({ prop: prop, value: affiliations[prop] });
            }
        }
        return affilArray;
    }

    get milComponent(): Array<{ prop: string, value: string }> {
        const componentArray = [];
        const components = _mp.MpComponent;
        for (let prop in components) {
            if (components.hasOwnProperty(prop)) {
                componentArray.push({ prop: prop, value: components[prop] });
            }
        }
        return componentArray;
    }

    get milPaygradeList(): Array<{ pg: string, displayName: string }> {
        const paygradeArray = [];
        const paygrades = _mp.MpPaygrade;
        for (let prop in paygrades) {
            if (paygrades.hasOwnProperty(prop)) {
                paygradeArray.push({ pg: prop, displayName: paygrades[prop] });
            }
        }
        return paygradeArray;
    }

    updatePayGradeList = (user: ecat.entity.IPerson): { user: ecat.entity.IPerson, paygradelist: Array<{ pg: string, displayName: string }> } => {

        const payGradeList: Array<{ pg: string, displayName: string }> = [];

        const milPayGrade = this.milPaygradeGraft;

        if (!user || !user.mpAffiliation) {

            for (let grade in milPayGrade) {

                if (milPayGrade.hasOwnProperty(grade)) {
                    if (milPayGrade[grade] === null) return;

                    const designator = milPayGrade[grade]['designator'];
                    payGradeList.push(
                        {
                            pg: designator,
                            displayName: designator
                        });
                }
            }
            return { user: user, paygradelist: payGradeList };
        } else {
            user.mpComponent = user.mpAffiliation === _mp.MpAffiliation.none ? _mp.MpComponent.none : user.mpComponent;

            user.mpPaygrade = user.mpAffiliation === _mp.MpAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpPaygrade;

            const selectedAffiliation = user.mpAffiliation === _mp.MpAffiliation.uscg ? _mp.MpAffiliation.usn : user.mpAffiliation === _mp.MpAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpAffiliation;

            const affilList = _mp.MpAffiliation;

            let affilKey: string;
            for (let affil in affilList) {
                if (affilList.hasOwnProperty(affil)) {
                    if (affilList[affil] === selectedAffiliation) {
                        affilKey = affil;
                    }
                }
            }

            for (let grade in milPayGrade) {
                if (milPayGrade.hasOwnProperty(grade)) {

                    if (milPayGrade[grade] === null) return;

                    const designator = milPayGrade[grade]['designator'];

                    const displayName = (affilKey && milPayGrade[grade][affilKey]) ? `${milPayGrade[grade]['designator']}: ${milPayGrade[grade][affilKey]['rankLongName']}` : milPayGrade[grade]['designator'];
                    payGradeList.push(
                        {
                            pg: designator,
                            displayName: displayName
                        });
                }
            }
        }
        return { user: user, paygradelist: payGradeList };
    }
    


}
