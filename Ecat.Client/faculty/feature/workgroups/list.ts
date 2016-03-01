import IDataCtx from 'core/service/data/context'
import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgList {
    static controllerId = 'app.faculty.wkgrp.list';
    static $inject = [IDataCtx.serviceId];
    
    private mp = _mp.MpSpStatus;
    private activeCourse: ecat.entity.ICourse;
    private courses: Array<ecat.entity.ICourse> = [];
    
    constructor(private dCtx: IDataCtx) {
        this.activate();
    }
    
    private activate(force?: boolean): void {
        this.dCtx.faculty.initializeCourses()
            .then((courses: Array<ecat.entity.ICourse>) => {
           this.courses = courses;
           this.activeCourse = courses[0];
       });
       
    }
    
    private changeActiveCourse(course: ecat.entity.ICourse): void {
       let activeCourse = this.activeCourse
       activeCourse = course;
       
       this.dCtx.faculty
            .activeCourseId = course.id;
       
       this.dCtx.faculty
            .getActiveCourse()
            .then(getActiveCourseReponse)
       
       function getActiveCourseReponse(course: ecat.entity.ICourse) {
               
       }
       
       function getActiveCourseErro(resonse: ecat.IQueryError) {
           
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
    
    private viewStatus(wg: ecat.entity.IWorkGroup): void {
        
    }
}