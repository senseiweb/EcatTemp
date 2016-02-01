import * as AppVars from 'appVars'

export default class EcLocalDataService
{
    static serviceId = 'data.local';

    milPaygradeGraft: ecat.local.IMilPayGrade = {
        civ: {
            designator: AppVars.EcMapPaygrade.civ
        },
        fn: {
            designator: AppVars.EcMapPaygrade.fn
        },
        e1: {
            designator: AppVars.EcMapPaygrade.e1,
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
            designator: AppVars.EcMapPaygrade.e2,
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
            designator: AppVars.EcMapPaygrade.e3,
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
            designator: AppVars.EcMapPaygrade.e4,
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
            designator: AppVars.EcMapPaygrade.e5,
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
            designator: AppVars.EcMapPaygrade.e6,
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
            designator: AppVars.EcMapPaygrade.e7,
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
            designator: AppVars.EcMapPaygrade.e8,
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
            designator: AppVars.EcMapPaygrade.e9,
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

    constructor() {  }

    get edLevels(): Array<string> {
        const edlevels = [];
        const lclEdLevel = AppVars.EcMapEdLevel;
        for (let edl in lclEdLevel) {
            if (lclEdLevel.hasOwnProperty(edl)) {
                edlevels.push(lclEdLevel[edl]);
            }
        }
        return edlevels;
    }

    get milAffil(): Array<{prop: string, value: string}> {
        const affilArray = [];
        const affiliations  = AppVars.EcMapAffiliation;
        for (let prop in affiliations) {
            if (affiliations.hasOwnProperty(prop)) {
                affilArray.push({ prop: prop, value: affiliations[prop] });
            }
        }
        return affilArray;
    }
    
    get milComponent(): Array<{ prop: string, value: string }> {
        const componentArray = [];
        const components = AppVars.EcMapComponent;
        for (let prop in components) {
            if (components.hasOwnProperty(prop)) {
                componentArray.push({ prop: prop, value: components[prop] });
            }
        }
        return componentArray;
    }

    get milPaygradeList(): Array<{ pg: string, displayName: string }> {
        const paygradeArray = [];
        const paygrades = AppVars.EcMapPaygrade;
        for (let prop in paygrades) {
            if (paygrades.hasOwnProperty(prop)) {
                paygradeArray.push({ pg: prop, displayName: paygrades[prop] });
            }
        }
        return paygradeArray;
    }

    updatePayGradeList = (user: ecat.entity.IPerson): {user: ecat.entity.IPerson, paygradelist: Array<{pg: string, displayName: string }>} => {

        const payGradeList: Array < { pg: string, displayName: string } > = [];

        const milPayGrade = this.milPaygradeGraft;

        if (!user || !user.mpMilAffiliation) {

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
            user.mpMilComponent = user.mpMilAffiliation === AppVars.EcMapAffiliation.none  ? AppVars.EcMapComponent.none: user.mpMilComponent;

            user.mpMilPaygrade = user.mpMilAffiliation === AppVars.EcMapAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpMilPaygrade;

            const selectedAffiliation = user.mpMilAffiliation === AppVars.EcMapAffiliation.uscg ? AppVars.EcMapAffiliation.usn : user.mpMilAffiliation === AppVars.EcMapAffiliation.none ? this.milPaygradeGraft.civ.designator : user.mpMilAffiliation;

            const affilList = AppVars.EcMapAffiliation;

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
