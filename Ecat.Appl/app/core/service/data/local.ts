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

    //get mockGroupMemberData() {
    //    const groupMember = {} as Ecat.Models.EcGroupMember;
    //    let group1 = {} as Ecat.Models.EcGroup;
    //    let group2 = {} as Ecat.Models.EcGroup;
    //    let group3 = {} as Ecat.Models.EcGroup;
    //    let group4 = {} as Ecat.Models.EcGroup;
    //    let course1 = {} as Ecat.Models.EcCourse;
    //    let course2 = {} as Ecat.Models.EcCourse;
    //    let course3 = {} as Ecat.Models.EcCourse;
    //    let course4 = {} as Ecat.Models.EcCourse;
    //    let course5 = {} as Ecat.Models.EcCourse;
    //    let student1 = {} as Ecat.Models.EcPerson;
    //    let student2 = {} as Ecat.Models.EcPerson;
    //    let student3 = {} as Ecat.Models.EcPerson;
    //    let student4 = {} as Ecat.Models.EcPerson;
    //    let student5 = {} as Ecat.Models.EcPerson;
    //    let student6 = {} as Ecat.Models.EcPerson;
    //    let student7 = {} as Ecat.Models.EcPerson;
    //    let student8 = {} as Ecat.Models.EcPerson;
    //    let student9 = {} as Ecat.Models.EcPerson;
    //    let student10 = {} as Ecat.Models.EcPerson;
    //    let student11 = {} as Ecat.Models.EcPerson;
    //    let student12 = {} as Ecat.Models.EcPerson;

      
    //    const spInstrument = {} as Ecat.Models.SpInstrument;

    //    course1 = {
    //        id: 1,
    //        academyId: 1,
    //        bbCourseId: '3292_923',
    //        name: 'NCOA ILE',
    //        classNumber: '16-1',
    //        term: 'Fall 16',
    //        startDate: new Date(2015, 08, 14),
    //        gradDate: new Date(2015, 09, 2),
    //        groups: null,
    //        academy: null,
    //        members: null
    //    }

    //    course2 = {
    //        id: 2,
    //        academyId: 1,
    //        bbCourseId: '3292_924',
    //        name: 'NCOA ILE',
    //        classNumber: '16-2',
    //        term: 'Fall 16',
    //        startDate: new Date(2015, 09, 14),
    //        gradDate: new Date(2015, 10, 2),
    //        groups: null,
    //        academy: null,
    //        members: null
    //    }

    //    course3 = {
    //        id: 3,
    //        academyId: 1,
    //        bbCourseId: '3292_925',
    //        name: 'NCOA ILE',
    //        classNumber: '16-3',
    //        term: 'Fall 16',
    //        startDate: new Date(2015, 10, 2),
    //        gradDate: new Date(2015, 09, 2),
    //        groups: null,
    //        academy: null,
    //        members: null
    //    }

    //    course4 = {
    //        id: 4,
    //        academyId: 1,
    //        bbCourseId: '3292_926',
    //        name: 'NCOA ILE',
    //        classNumber: '16-4',
    //        term: 'Fall 16',
    //        startDate: new Date(2015, 08, 14),
    //        gradDate: new Date(2015, 09, 2),
    //        groups: null,
    //        academy: null,
    //        members: null
    //    }

    //    course5 = {
    //        id: 5,
    //        academyId: 1,
    //        bbCourseId: '3292_926',
    //        name: 'NCOA ILE',
    //        classNumber: '16-5',
    //        term: 'Fall 16',
    //        startDate: new Date(2015, 08, 14),
    //        gradDate: new Date(2015, 09, 2),
    //        groups: null,
    //        academy: null,
    //        members: null
    //    }

    //    group1 = {
    //        id: 1,
    //        spInstrumentId: 1,
    //        kcInstrumentId: null,
    //        courseId: 1,
    //        mpCategory: 'BC1',
    //        groupNumber: '1',
    //        customName: 'Fighting Falcons',
    //        bbGroupId: 'XDe3is',
    //        defaultName: 'Flight 01',
    //        maxStrat: 37.5,
    //        mpSpStatus: 'Open',
    //        isHomeGroup: true,
    //        course: null,
    //        members: null,
    //        spInstrument: null,
    //        kcInstrument: null,
    //    }

    //    group2 = {
    //        id: 2,
    //        spInstrumentId: 2,
    //        kcInstrumentId: null,
    //        courseId: 1,
    //        mpCategory: 'BC2',
    //        groupNumber: '2',
    //        customName: 'Slithing Snakes',
    //        bbGroupId: 'XDe3is',
    //        defaultName: 'Flight 02',
    //        maxStrat: 18.75,
    //        mpSpStatus: 'Open',
    //        isHomeGroup: false,
    //        course: null,
    //        members: null,
    //        spInstrument: null,
    //        kcInstrument: null,
    //    }
    //    group3 = {
    //        id: 3,
    //        spInstrumentId: 3,
    //        kcInstrumentId: null,
    //        courseId: 1,
    //        mpCategory: 'BC3',
    //        groupNumber: '3',
    //        customName: 'Pecking Parrots',
    //        bbGroupId: 'XDe3is',
    //        defaultName: 'Flight 03',
    //        maxStrat: 18.75,
    //        mpSpStatus: 'Open',
    //        isHomeGroup: false,
    //        course: null,
    //        members: null,
    //        spInstrument: null,
    //        kcInstrument: null,
    //    }
    //    group4 = {
    //        id: 4,
    //        spInstrumentId: 4,
    //        kcInstrumentId: null,
    //        courseId: 1,
    //        mpCategory: 'BC4',
    //        groupNumber: '4',
    //        customName: 'Oodling Owls',
    //        bbGroupId: 'XDe3is',
    //        defaultName: 'Flight 04',
    //        maxStrat: 1.5,
    //        mpSpStatus: 'Open',
    //        isHomeGroup: true,
    //        course: null,
    //        members: null,
    //        spInstrument: null,
    //        kcInstrument: null,
    //    }
    //}
}
