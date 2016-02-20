/// <reference path="Enums.ts" />
declare module Ecat.Shared.Model {
	interface Person {
		personId: number;
		isActive: boolean;
		bbUserId: string;
		bbUserName: string;
		lastName: string;
		firstName: string;
		avatarLocation: string;
		goByName: string;
		mpGender: string;
		mpAffiliation: string;
		mpPaygrade: string;
		mpComponent: string;
		email: string;
		registrationComplete: boolean;
		mpInstituteRole: string;
		student: Ecat.Shared.Model.Student;
		facilitator: Ecat.Shared.Model.Facilitator;
		external: Ecat.Shared.Model.External;
		hqStaff: Ecat.Shared.Model.HqStaff;
		security: Ecat.Shared.Model.Security;
		profile: Ecat.Shared.Model.Profile;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface Student extends Ecat.Shared.Model.Profile {
		contactNumber: string;
		commander: string;
		shirt: string;
		commanderEmail: string;
		shirtEmail: string;
		person: Ecat.Shared.Model.Person;
		groupPersonas: Ecat.Shared.Model.MemberInGroup[];
		coursePersonas: Ecat.Shared.Model.MemberInCourse[];
	}
	interface Profile {
		personId: number;
		bio: string;
		homeStation: string;
	}
	interface MemberInGroup {
		id: number;
		groupId: number;
		courseEnrollmentId: number;
		studentId: number;
		group: Ecat.Shared.Model.WorkGroup;
		courseEnrollment: Ecat.Shared.Model.MemberInCourse;
		student: Ecat.Shared.Model.Student;
		groupPeers: Ecat.Shared.Model.MemberInGroup[];
		assessorSpResponses: Ecat.Shared.Model.SpAssessResponse[];
		assesseeSpResponses: Ecat.Shared.Model.SpAssessResponse[];
		authorOfComments: Ecat.Shared.Model.SpComment[];
		recipientOfComments: Ecat.Shared.Model.SpComment[];
		assessorStratResponse: Ecat.Shared.Model.SpStratResponse[];
		assesseeStratResponse: Ecat.Shared.Model.SpStratResponse[];
		assessResults: Ecat.Shared.Model.SpAssessResult[];
		stratResults: Ecat.Shared.Model.SpStratResult[];
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface WorkGroup {
		id: number;
		assignedSpInstrId: number;
		assignedKcInstrId: number;
		courseId: number;
		mpCategory: string;
		groupNumber: string;
		customName: string;
		bbGroupId: string;
		defaultName: string;
		maxStrat: number;
		mpSpStatus: string;
		isPrimary: boolean;
		course: Ecat.Shared.Model.Course;
		facSpResponses: Ecat.Shared.Model.FacSpAssessResponse[];
		facStratResponses: Ecat.Shared.Model.FacSpStratResponse[];
		facSpComments: Ecat.Shared.Model.FacSpComment[];
		groupMembers: Ecat.Shared.Model.MemberInGroup[];
		assignedSpInstr: Ecat.Shared.Model.SpInstrument;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface Course {
		id: number;
		academyId: string;
		bbCourseId: string;
		name: string;
		classNumber: string;
		term: string;
		gradReportPublished: boolean;
		startDate: Date;
		gradDate: Date;
		courseMembers: Ecat.Shared.Model.MemberInCourse[];
		groups: Ecat.Shared.Model.WorkGroup[];
	}
	interface MemberInCourse {
		id: number;
		courseId: number;
		personId: number;
		mpCourseRole: string;
		course: Ecat.Shared.Model.Course;
		person: Ecat.Shared.Model.Person;
		studGroupEnrollments: Ecat.Shared.Model.MemberInGroup[];
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
	}
	interface FacSpAssessResponse {
		id: number;
		assesseeId: number;
        inventoryItemId: number;
		assessResultId: number;
		assignedGroupId: number;
        mpItemResponse: string;
        itemModelScore: number;
		scoreModelVersion: number;
		assignedGroup: Ecat.Shared.Model.WorkGroup;
		assessee: Ecat.Shared.Model.MemberInGroup;
        inventoryItem: Ecat.Shared.Model.SpInventory;
		assessResult: Ecat.Shared.Model.SpAssessResult;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpInventory {
		id: number;
		instrumentId: number;
		displayOrder: number;
		isScored: boolean;
		isDisplayed: boolean;
		behavior: string;
		modifiedById: number;
		modifiedDate: Date;
		instrument: Ecat.Shared.Model.SpInstrument;
	}
	interface SpInstrument {
		id: number;
		name: string;
		isActive: boolean;
		version: string;
		selfInstructions: string;
		peerInstructions: string;
		facilitatorInstructions: string;
		modifiedDate: Date;
		modifiedById: number;
		inventoryCollection: Ecat.Shared.Model.SpInventory[];
		assignedGroups: Ecat.Shared.Model.WorkGroup[];
		spAssessMaps: Ecat.Shared.Model.SpAssessMap[];
	}
	interface SpAssessMap extends Ecat.Shared.Model.AssessMap {
		spInstrumentId: number;
		spInstrument: Ecat.Shared.Model.SpInstrument;
	}
	interface AssessMap {
		id: number;
		isActive: boolean;
		academyId: string;
		groupType: string;
		assignedData: Date;
	}
	interface SpAssessResult {
		id: number;
		resultForId: number;
		assignedInstrumentId: number;
		mpStudentSpResult: string;
		spResultScore: number;
		resultFor: Ecat.Shared.Model.MemberInGroup;
		assignedInstrument: Ecat.Shared.Model.SpInstrument;
		sanitizedResponses: Ecat.Shared.Model.SanitizedResponse[];
		sanitizedComments: Ecat.Shared.Model.SanitizedComment[];
	}
	interface SanitizedResponse {
		id: number;
		isInstructorResponse: boolean;
		isSelfResponse: boolean;
		peerGenericName: string;
		mpItemResponse: string;
		itemModelScore: number;
		inventoryItemId: number;
		assessResultId: number;
		inventoryItem: Ecat.Shared.Model.SpInventory;
		assessResult: Ecat.Shared.Model.SpAssessResult;
	}
	interface SanitizedComment {
		id: number;
		resultId: number;
		authorName: string;
		commentText: string;
		mpCommentFlagAuthor: string;
		mpCommentFlagRecipient: string;
		result: Ecat.Shared.Model.SpAssessResult;
	}
	interface FacSpStratResponse {
		id: number;
		assesseeId: number;
		stratPosition: number;
		stratResultId: number;
		assignedGroupId: number;
		assessee: Ecat.Shared.Model.MemberInGroup;
		stratResult: Ecat.Shared.Model.SpStratResult;
		assignedGroup: Ecat.Shared.Model.WorkGroup;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpStratResult {
		id: number;
		grpMemberId: number;
		facStratResponseId: number;
		originalStratPosition: number;
		finalStratPosition: number;
		stratScore: number;
		grpMember: Ecat.Shared.Model.MemberInGroup;
		facStrat: Ecat.Shared.Model.FacSpStratResponse;
		sourceResponses: Ecat.Shared.Model.SpStratResponse[];
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpStratResponse {
		id: number;
		assessorId: number;
		assesseeId: number;
		stratPosition: number;
		stratResultId: number;
		assessor: Ecat.Shared.Model.MemberInGroup;
		assessee: Ecat.Shared.Model.MemberInGroup;
		stratResult: Ecat.Shared.Model.SpStratResult;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface FacSpComment {
		id: number;
		recipientId: number;
		assignedGroupId: number;
		commentText: string;
		mpCommentFlagRecipient: string;
		recipient: Ecat.Shared.Model.MemberInGroup;
		assignedGroup: Ecat.Shared.Model.WorkGroup;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpAssessResponse {
		id: number;
		assessorId: number;
		assesseeId: number;
		inventoryItemId: number;
		assessResultId: number;
		mpItemResponse: string;
		itemModelScore: number;
		inventoryItem: Ecat.Shared.Model.SpInventory;
		assessResult: Ecat.Shared.Model.SpAssessResult;
		assessor: Ecat.Shared.Model.MemberInGroup;
		assessee: Ecat.Shared.Model.MemberInGroup;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpComment {
		id: number;
		authorId: number;
		recipientId: number;
		facFlaggedById: number;
		mpCommentType: string;
		commentText: string;
		mpCommentFlagFac: string;
		mpCommentFlagAuthor: string;
		mpCommentFlagRecipient: string;
		author: Ecat.Shared.Model.MemberInGroup;
		recipient: Ecat.Shared.Model.MemberInGroup;
		facFlaggedBy: Ecat.Shared.Model.MemberInCourse;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface Facilitator extends Ecat.Shared.Model.Profile {
		isCourseAdmin: boolean;
		person: Ecat.Shared.Model.Person;
		coursePersonas: Ecat.Shared.Model.MemberInCourse[];
	}
	interface External extends Ecat.Shared.Model.Profile {
		person: Ecat.Shared.Model.Person;
	}
	interface HqStaff extends Ecat.Shared.Model.Profile {
		person: Ecat.Shared.Model.Person;
		meetingAttendences: Ecat.Shared.Model.MeetingAttendee[];
	}
	interface MeetingAttendee {
		meetingId: number;
		attendeeId: number;
		isOrganizer: number;
		attendee: Ecat.Shared.Model.HqStaff;
		meeting: Ecat.Shared.Model.Meeting;
	}
	interface Meeting {
		id: number;
		meetingReason: string;
		abstract: string;
		background: string;
		purpose: string;
		meetingDate: Date;
		attendees: Ecat.Shared.Model.MeetingAttendee[];
		actionItemses: Ecat.Shared.Model.ActionItem[];
		decisions: Ecat.Shared.Model.Decision[];
	}
	interface ActionItem {
		id: number;
		meetingId: number;
		todo: string;
		opr: string;
		mpActionStatus: string;
		resolution: string;
		dueDate: Date;
		resolutionDate: Date;
		meeting: Ecat.Shared.Model.Meeting;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface Decision {
		id: number;
		meetingId: number;
		status: string;
		decisionItem: string;
		approvalAuthority: string;
		approvedDate: Date;
		meeting: Ecat.Shared.Model.Meeting;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface Security {
		personId: number;
		passwordHash: string;
		badPasswordCount: number;
		person: Ecat.Shared.Model.Person;
	}
	interface Academy {
		id: string;
		longName: string;
		shortName: string;
		edLevel: Ecat.Shared.Model.EdLevel;
		base: Ecat.Shared.Model.AcademyBase;
		bbCategoryId: string;
		parentBbCategoryId: string;
	}
	interface AcademyCategory {
		id: string;
		bbCatId: string;
		bbCatName: string;
		relatedCoursesCount: number;
	}
	interface LoginToken {
		personId: number;
		role: Ecat.Shared.Model.RoleMap;
		authToken: string;
		tokenExpireWarning: Date;
		tokenExpire: Date;
		person: Ecat.Shared.Model.Person;
	}
>>>>>>> Stashed changes
}

