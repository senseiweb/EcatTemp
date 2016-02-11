import ng = require('angular')
import 'ngTable'
import courseAdminCfgProvider from 'courseAdmin/provider/courseAdminCfgProvider'
import courseAdminConfig from 'courseAdmin/config/cfgCourseAdmin'
import courses from 'courseAdmin/features/courses/courses'
import groups from 'courseAdmin/features/groups/groups'


export default class EcCourseAdminModule {
    static moduleId = 'courseAdmin';
    courseAdminModule: angular.IModule;
    constructor() {
        this.courseAdminModule = ng.module(EcCourseAdminModule.moduleId, ['ngTable'])
            .config(courseAdminConfig)
            .provider(courseAdminCfgProvider.providerId, courseAdminCfgProvider)
            .controller(courses.controllerId, courses)
            .controller(groups.controllerId, groups);
    }
}