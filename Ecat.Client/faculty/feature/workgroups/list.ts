import IDataCtx from 'core/service/data/context'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgList {
    static controllerId = 'app.faculty.wkgrp.list';
    static $inject = [IDataCtx.serviceId];
    
    private mp = _mp.MpSpStatus;
    private activeCourse: ecat.entity.ICourse;
    private courses: Array<ecat.entity.ICourse> = [];
    private filterGrpStatus: Array<string>;
    private filterStati: Array<{}> = [{ key: 'test1', count: 12 }, { key: 'test2', count: 15 }];
    private groupTypes: Array<string> = [];
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
        const grp = {};
        groups.forEach(g => grp[g.mpCategory] = null);
        this.groupTypes = Object.keys(grp).sort();
    }

    private viewStatus(wg: ecat.entity.IWorkGroup): void {
        
    }
}