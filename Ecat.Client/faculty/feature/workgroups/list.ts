import IDataCtx from 'core/service/data/context'
import * as _mp from 'core/common/mapStrings'

interface IWgFilter {
    filterWith?: Array<string>;
    optionList?: Array<{key: string, count: number}>;
}

interface IWgCatFilter {
    cat: IWgFilter;
    status: IWgFilter;
    name: IWgFilter;
}

export default class EcFacultyWgList {
    static controllerId = 'app.faculty.wkgrp.list';
    static $inject = [IDataCtx.serviceId];
    
    private mp = _mp.MpSpStatus;
    private activeCourse: ecat.entity.ICourse;
    private canPublish = false;
    private courses: Array<ecat.entity.ICourse> = [];
    private filters: IWgCatFilter = {
        cat: { optionList: [], filterWith: [] },
        status: { optionList: [], filterWith: [] },
        name: { optionList: [], filterWith: [] }
    }

    constructor(private dCtx: IDataCtx) {
        this.activate();
    }
    
    private activate(force?: boolean): void {
        const _ = this;
        this.dCtx.faculty.initializeCourses()
            .then(initResponse)
            .catch(initError);

       function initResponse(courses: Array<ecat.entity.ICourse>){
           _.courses = courses;
           const activeCourse = courses[0];
           if (activeCourse.workGroups) {
               _._unwrapGrpTypes(activeCourse.workGroups);
           }
           _.activeCourse = activeCourse;
       }
        //TODO: Need to take of error
        function initError(reason: string) {
            
        }
    }
    
    private changeActiveCourse(course: ecat.entity.ICourse): void {
        let activeCourse = this.activeCourse;
       activeCourse = course;
       
       this.dCtx.faculty
            .activeCourseId = course.id;

        this.dCtx.faculty
            .getActiveCourse()
            .then(getActiveCourseReponse)
            .catch(getActiveCourseError);
       
       function getActiveCourseReponse(crse: ecat.entity.ICourse) {
           activeCourse = crse;
       }
       
       function getActiveCourseError(response: ecat.IQueryError) {
           
       }
            
    }
    
    private filteredGrpCat = (item: ecat.entity.IWorkGroup) => {
    
        return this.filters.cat.filterWith.length === 0 || this.filters.cat.filterWith.some(e => item.mpCategory === e);
    }
    
    private filteredGrpFlight = (item: ecat.entity.IWorkGroup) => {

        return this.filters.name.filterWith.length === 0 || this.filters.name.filterWith.some(e => item.defaultName === e);
    }

    private filteredGrpStatus = (item: ecat.entity.IWorkGroup) => {

        return this.filters.status.filterWith.length === 0 || this.filters.status.filterWith.some(e => item.mpSpStatus === e);
    }

    private goToAssess(wg: ecat.entity.IWorkGroup): void {
        
    }
    
    private goToPublish(wg: ecat.entity.IWorkGroup): void {
        //TODO: Check if all work is done, if not error;
    }

    private goToResults(wg: ecat.entity.IWorkGroup): void {

    }

    private refreshInit(): void {
        this.activate(true);
    }
    
    private _unwrapGrpTypes(groups: Array<ecat.entity.IWorkGroup>): void {
        const grpCat = {};
        const grpName = {};
        const grpStatus = {};

        groups.forEach((g, i, array) => {
            grpCat[g.mpCategory] = null;
            grpName[g.defaultName] = null;
            grpStatus[g.mpSpStatus] = null;
        });

        const uniqueCatKeys = Object.keys(grpCat).sort();
        const uniqueNameKeys = Object.keys(grpName).sort();
        const uniqueStatusKeys = Object.keys(grpStatus).sort();

        this.filters.cat.optionList = uniqueCatKeys.map(key => {
            const count = groups.filter(g => g.mpCategory === key).length;
            return {
                key: key,
                count: count
            }
        });

        this.filters.name.optionList = uniqueNameKeys.map(key => {
            const count = groups.filter(g => g.mpCategory === key).length;
            return {
                key: key,
                count: count
            }
        });

        this.filters.status.optionList = uniqueStatusKeys.map(key => {
            const count = groups.filter(g => g.mpCategory === key).length;
            return {
                key: key,
                count: count
            }
        });
    }

    private viewStatus(wg: ecat.entity.IWorkGroup): void {
        
    }
}