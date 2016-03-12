import * as _mp from "core/common/mapStrings"

export default class EcLocalDataService {
    static serviceId = 'data.static';
    static milPaygradeGraft: ecat.local.IMilPayGrade = {
        civ: {
            designator: _mp.EcMapPaygrade.civ
        },
        fn: {
            designator: _mp.EcMapPaygrade.fn
        },
        e1: {
            designator: _mp.EcMapPaygrade.e1,
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
            designator: _mp.EcMapPaygrade.e2,
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
            designator: _mp.EcMapPaygrade.e3,
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
            designator: _mp.EcMapPaygrade.e4,
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
            designator: _mp.EcMapPaygrade.e5,
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
            designator: _mp.EcMapPaygrade.e6,
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
            designator: _mp.EcMapPaygrade.e7,
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
            designator: _mp.EcMapPaygrade.e8,
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
            designator: _mp.EcMapPaygrade.e9,
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
    static getSalutation(paygrade: string, component: string, affiliation:string): string {
        const paygradeList = EcLocalDataService.milPaygradeGraft;

        if (!paygrade) {
            return "NPG";
        }

        if (paygrade === _mp.EcMapPaygrade.civ) {
            return 'Civ';
        }

        if (paygrade === _mp.EcMapPaygrade.fn) {
            return 'FN';
        }

        if (!component) {
            return paygrade;
        }

        if (!paygradeList.hasOwnProperty(paygrade.toLowerCase())) {
            return 'Udf';
        }

        if (angular.isObject(paygradeList[paygrade]) && paygradeList[paygrade].designator === paygrade) {

            switch (affiliation) {
            case _mp.EcMapAffiliation.usa:
                return paygradeList[paygrade].usa.rankShortName;
            case _mp.EcMapAffiliation.usaf:
                return paygradeList[paygrade].usaf.rankShortName;
            case _mp.EcMapAffiliation.usn:
            case _mp.EcMapAffiliation.uscg:
                return paygradeList[paygrade].usn.rankShortName;
            case _mp.EcMapAffiliation.usmc:
                return paygradeList[paygrade].usmc.rankShortName;
            default:
                return 'Unkown';
            }

        }
    }
    static prettyInstituteRole(role: string): string {
        switch (role) {
            case _mp.EcMapInstituteRole.student:
                return 'Student';
            case _mp.EcMapInstituteRole.faculty:
                return 'Facilatator';
            case _mp.EcMapInstituteRole.external:
                return 'External User';
            default:
                return 'Unmapped Role';
        }
    }
    milPaygradeGraft: ecat.local.IMilPayGrade;
    
    constructor() {
        this.milPaygradeGraft = EcLocalDataService.milPaygradeGraft;
    }
    
    get edLevels(): Array<string> {
        const edlevels = [];
        const lclEdLevel = _mp.EcMapEdLevel;
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
        const affiliations = _mp.EcMapAffiliation;
        for (let prop in affiliations) {
            if (affiliations.hasOwnProperty(prop)) {
                affilArray.push({ prop: prop, value: affiliations[prop] });
            }
        }
        return affilArray;
    }

    get milComponent(): Array<{ prop: string, value: string }> {
        const componentArray = [];
        const components = _mp.EcMapComponent;
        for (let prop in components) {
            if (components.hasOwnProperty(prop)) {
                componentArray.push({ prop: prop, value: components[prop] });
            }
        }
        return componentArray;
    }

    get milPaygradeList(): Array<{ pg: string, displayName: string }> {
        const paygradeArray = [];
        const paygrades = _mp.EcMapPaygrade;
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
            user.mpComponent = user.mpAffiliation === _mp.EcMapAffiliation.none ? _mp.EcMapComponent.none : user.mpComponent;

            user.mpPaygrade = user.mpAffiliation === _mp.EcMapAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpPaygrade;

            const selectedAffiliation = user.mpAffiliation === _mp.EcMapAffiliation.uscg ? _mp.EcMapAffiliation.usn : user.mpAffiliation === _mp.EcMapAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpAffiliation;

            const affilList = _mp.EcMapAffiliation;

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
