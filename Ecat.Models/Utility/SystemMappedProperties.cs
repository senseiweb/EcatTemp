﻿using System.Collections.Generic;

namespace Ecat.Models
{
    public static class EcMapGroupType
    {
        public const string Wg1 = "BC1",
              Wg2 = "BC2",
              Wg3 = "BC3",
              Wg4 = "BC4",
              None = "None";
    }

    public static class EcMapInstituteRole
    {
        public const string HqAdmin = "BCEE_01_HQ",
            Designer = "BCEE_02_Designer",
            CourseAdmin = "BCEE_03_CourseAdmin",
            Facilitator = "BCEE_04_Facilitator",
            Student = "BCEE_05_Student",
            External = "BCEE_06_External";
    }

    public static class EcMapAffiliation
    {
        public const string Usaf = "Air Force",
            Usa = "Army",
            Uscg = "Coast Guard",
            Usn = "Navy",
            Usmc = "Marines",
            Fn = "Foreign National",
            None = "Unaffiliated",
            Unk = "Unknown";
    }

    public static class EcMapGender
    {
        public const string Unk = "Unknown",
            Male = "Male",
            Female = "Female";
    }

    public static class EcMapComponent
    {
        public const string Active = "Active Duty",
               Reserve = "Reserves",
               Guard = "National Guard",
               None = "Unaffiliated",
               Unk = "Unknown";
    }

    public static class EcMapPaygrade
    {
        public const string E1 = "E1",
             E2 = "E2",
             E3 = "E3",
             E4 = "E4",
             E5 = "E5",
             E6 = "E6",
             E7 = "E7",
             E8 = "E8",
             E9 = "E9",
             Civ = "Civilian",
             Fn = "Foreign National",
             Unk = "Unknown";
    }

    public static class EcMapToken
    {
        public static string[] TokenMethods => new[] {
            "Context.WS:login",
            "Context.WS:loginTool",
            "Context.WS:emulateUser",
            "Context.WS:extendSessionLife",
            "Context.WS:getMemberships",
            "Context.WS:getMyMemberships",
            "Context.WS:initialize",
            "Course.WS:changeCourseBatchUid",
            "Course.WS:changeCourseCategoryBatchUid",
            "Course.WS:changeCourseDataSourceId",
            "Course.WS:changeOrgBatchUid",
            "Course.WS:changeOrgCategoryBatchUid",
            "Course.WS:changeOrgDataSourceId",
            "Course.WS:createCourse",
            "Course.WS:createOrg",
            "Course.WS:getAvailableGroupTools",
            "Course.WS:getCartridge",
            "Course.WS:getCategories",
            "Course.WS:getClassifications",
            "Course.WS:getCourse",
            "Course.WS:getCourseCategoryMembership",
            "Course.WS:getGroup",
            "Course.WS:getOrg",
            "Course.WS:getOrgCategoryMembership",
            "Course.WS:getServerVersion",
            "Course.WS:getStaffInfo",
            "Course.WS:initializeCourse",
            "Course.WS:saveCartridge",
            "Course.WS:saveCourse",
            "Course.WS:saveCourseCategory",
            "Course.WS:saveGroup",
            "Course.WS:saveOrgCategory",
            "Course.WS:saveOrgCategoryMembership",
            "Course.WS:saveStaffInfo",
            "Course.WS:setCourseBannerImage",
            "Course.WS:updateCourse",
            "Course.WS:updateOrg",
            "Announcement.WS:getCourseAnnouncements",
            "Announcement.WS:getOrgAnnouncements",
            "Announcement.WS:getSystemAnnouncements",
            "Announcement.WS:initializeAnnouncementWS",
            "Announcement.WS:createCourseAnnouncements",
            "Announcement.WS:createOrgAnnouncements",
            "Announcement.WS:createSystemAnnouncements",
            "Announcement.WS:updateCourseAnnouncements",
            "Announcement.WS:updateOrgAnnouncements",
            "Announcement.WS:updateSystemAnnouncements",
            "Announcement.WS:getServerVersion",
            "Gradebook.WS:getAttempts",
            "Gradebook.WS:getGradebookColumns",
            "Gradebook.WS:getGradebookTypes",
            "Gradebook.WS:getGrades",
            "Gradebook.WS:getGradingSchemas",
            "Gradebook.WS:getRequiredEntitlements",
            "Gradebook.WS:getServerVersion",
            "Gradebook.WS:initializeGradebookWS",
            "Gradebook.WS:saveAttempts",
            "Gradebook.WS:saveColumns",
            "Gradebook.WS:saveGradebookTypes",
            "Gradebook.WS:saveGrades",
            "Gradebook.WS:saveGradingSchemas",
            "CourseMembership.WS:getCourseMembership",
            "CourseMembership.WS:getCourseRoles",
            "CourseMembership.WS:getGroupMembership",
            "CourseMembership.WS:getServerVersion",
            "CourseMembership.WS:initializeCourseMembershipWS",
            "Content.WS:addContentFile",
            "Content.WS:updateContentFileLinkName",
            "Content.WS:getContentFiles",
            "Content.WS:getFilteredContent",
            "Content.WS:getReviewStatusByCourseId",
            "Content.WS:getFilteredCourseStatus",
            "Content.WS:getLinksByReferrerType",
            "Content.WS:getLinksByReferredToType",
            "Content.WS:getTOCsByCourseId",
            "Content.WS:initializeContentWS",
            "Content.WS:initializeVersion2ContentWS",
            "Content.WS:getRequiredEntitlements",
            "Content.WS:saveContent",
            "Content.WS:saveCourseTOC",
            "Content.WS:saveContentsReviewed",
            "NotificationDistributorOperations.WS:getServerVersion",
            "NotificationDistributorOperations.WS:initializeNotificationDistributorOperationsWS",
            "NotificationDistributorOperations.WS:setDistributorAvailabilityForUser",
            "NotificationDistributorOperations.WS:registerDistributorResults",
            "NotificationDistributorOperations.WS:",
            "User.WS:getServerVersion",
            "User.WS:initializeUserWS",
            "User.WS:saveUser",
            "User.WS:saveObserverAssociation",
            "User.WS:saveAddressBookEntry",
            "User.WS:getUser",
            "User.WS:getAddressBookEntry",
            "User.WS:getObservee",
            "User.WS:changeUserBatchUid",
            "User.WS:changeUserDataSourceId",
            "User.WS:getSystemRoles",
            "User.WS:getInstitutionRoles",
            "User.WS:getUserInstitutionRoles",
            "Calendar.WS:initializeCalendarWS",
            "Calendar.WS:createPersonalCalendarItem",
            "Calendar.WS:createCourseCalendarItem",
            "Calendar.WS:createInstitutionCalendarItem",
            "Calendar.WS:updatePersonalCalendarItem",
            "Calendar.WS:updateCourseCalendarItem",
            "Calendar.WS:updateInstitutionCalendarItem",
            "Calendar.WS:savePersonalCalendarItem",
            "Calendar.WS:saveCourseCalendarItem",
            "Calendar.WS:saveInstitutionCalendarItem",
            "Calendar.WS:getCalendarItem",
            "Calendar.WS:canUpdatePersonalCalendarItem",
            "Calendar.WS:canUpdateCourseCalendarItem",
            "Calendar.WS:canUpdateInstitutionCalendarItem",
            "Util.WS:initializeUtilWS",
            "Util.WS:getRequiredEntitlements",
            "Util.WS:checkEntitlement",
            "Util.WS:saveSetting",
            "Util.WS:loadSetting",
            "Util.WS:deleteSetting",
            "Util.WS:getDataSources"
        };
    }

    public static class EcMapSchCategory
    {
        public static Dictionary<EpmeSchool, string> CatIdBySchool => new Dictionary<EpmeSchool, string>{
            { EpmeSchool.Afsncoa, "_888_1"},
            { EpmeSchool.Bcee, "_206_1"},
            { EpmeSchool.Clc, "_892_1"},
            { EpmeSchool.Ncoa, "_889_1"},
            { EpmeSchool.Keesler, "_890_1"},
            { EpmeSchool.Sheppard, "_893_1"},
            { EpmeSchool.Tyndall, "_891_1"},
            { EpmeSchool.Epmeic, "_894_1"}
        };
    }
     
   
}
