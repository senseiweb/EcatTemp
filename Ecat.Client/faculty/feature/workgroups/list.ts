import * as _mp from 'core/common/mapStrings'

export default class EcFacultyWgList {
    static controllerId = 'app.faculty.wkgrp.list';
    static $inject = [];
    
    private mp = _mp.MpSpStatus;
    private course: ecat.entity.ICourse;
    
    constructor() {
        
    }
    
    private goToAssess(wg: ecat.entity.IWorkGroup): void {
        
    }
    
    private goToPublish(wg: ecat.entity.IWorkGroup): void {
        //TODO: Check if all work is done, if not error;
    }
    
    private goToResults(wg: ecat.entity.IWorkGroup): void {
        
    }
    
    private viewStatus(wg: ecat.entity.IWorkGroup): void {
        
    }
}