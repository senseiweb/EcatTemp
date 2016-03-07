




 
 


 




/// <reference path="serverEnums.ts" />

declare module ecat.entity.s.user {
	interface Person {
		personId: number;
		isActive: boolean;
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
		student: ecat.entity.s.user.ProfileStudent;
		faculty: ecat.entity.s.user.ProfileFaculty;
		external: ecat.entity.s.user.ProfileExternal;
		hqStaff: ecat.entity.s.user.ProfileStaff;
		profile: ecat.entity.s.user.ProfileBase;
	}
	interface ProfileStudent extends ecat.entity.s.user.ProfileBase {
		contactNumber: string;
		commander: string;
		shirt: string;
		commanderEmail: string;
		shirtEmail: string;
		courses: ecat.entity.s.school.StudentInCourse[];
		courseGroupMemberships: ecat.entity.s.school.CrseStudentInGroup[];
	}
	interface ProfileBase {
		personId: number;
		bio: string;
		homeStation: string;
		person: ecat.entity.s.user.Person;
	}
	interface ProfileFaculty extends ecat.entity.s.user.ProfileBase {
		isCourseAdmin: boolean;
		isReportViewer: boolean;
		courses: ecat.entity.s.school.FacultyInCourse[];
	}
	interface ProfileExternal extends ecat.entity.s.user.ProfileBase {
	}
	interface ProfileStaff extends ecat.entity.s.user.ProfileBase {
		meetingAttendances: ecat.entity.s.staff.MeetingAttendee[];
	}
}
declare module ecat.entity.s.school {
	interface StudentInCourse {
		entityId: string;
		courseId: number;
		studentPersonId: number;
		course: ecat.entity.s.school.Course;
		student: ecat.entity.s.user.ProfileStudent;
		workGroupEnrollments: ecat.entity.s.school.CrseStudentInGroup[];
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
		studentsInCourse: ecat.entity.s.school.StudentInCourse[];
		studentInCrseGroups: ecat.entity.s.school.CrseStudentInGroup[];
		spResponses: ecat.entity.s.learner.SpResponse[];
		faculty: ecat.entity.s.school.FacultyInCourse[];
		workGroups: ecat.entity.s.school.WorkGroup[];
	}
	interface CrseStudentInGroup {
		entityId: string;
		studentId: number;
		courseId: number;
		workGroupId: number;
		workGroup: ecat.entity.s.school.WorkGroup;
		studentProfile: ecat.entity.s.user.ProfileStudent;
		course: ecat.entity.s.school.Course;
		studentInCourse: ecat.entity.s.school.StudentInCourse;
		groupPeers: ecat.entity.s.school.CrseStudentInGroup[];
		assessorSpResponses: ecat.entity.s.learner.SpResponse[];
		assesseeSpResponses: ecat.entity.s.learner.SpResponse[];
		authorOfComments: ecat.entity.s.learner.SpComment[];
		recipientOfComments: ecat.entity.s.learner.SpComment[];
		assessorStratResponse: ecat.entity.s.learner.StratResponse[];
		assesseeStratResponse: ecat.entity.s.learner.StratResponse[];
		spResult: ecat.entity.s.learner.SpResult;
		stratResult: ecat.entity.s.learner.StratResult;
		facultyStrat: ecat.entity.s.faculty.FacStratResponse;
		numberOfAuthorComments: number;
	}
	interface WorkGroup {
		id: number;
		courseId: number;
		mpCategory: string;
		groupNumber: string;
		assignedSpInstrId: number;
		assignedKcInstrId: number;
		customName: string;
		bbGroupId: string;
		defaultName: string;
		maxStrat: number;
		mpSpStatus: string;
		isPrimary: boolean;
		course: ecat.entity.s.school.Course;
		facSpResponses: ecat.entity.s.faculty.FacSpResponse[];
		facStratResponses: ecat.entity.s.faculty.FacStratResponse[];
		facSpComments: ecat.entity.s.faculty.FacSpComment[];
		groupMembers: ecat.entity.s.school.CrseStudentInGroup[];
		spComments: ecat.entity.s.learner.SpComment[];
		spResponses: ecat.entity.s.learner.SpResponse[];
		spResults: ecat.entity.s.learner.SpResult[];
		spStratResponses: ecat.entity.s.learner.StratResponse[];
		spStratResults: ecat.entity.s.learner.StratResult[];
		assignedSpInstr: ecat.entity.s.designer.SpInstrument;
		assignedKcInstr: ecat.entity.s.designer.KcInstrument;
		canPublish: boolean;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface FacultyInCourse {
		entityId: string;
		courseId: number;
		facultyPersonId: number;
		course: ecat.entity.s.school.Course;
		facultyProfile: ecat.entity.s.user.ProfileFaculty;
		spResponses: ecat.entity.s.faculty.FacSpResponse[];
		spComments: ecat.entity.s.faculty.FacSpComment[];
		stratResponse: ecat.entity.s.faculty.FacStratResponse[];
		flaggedComments: ecat.entity.s.learner.SpComment[];
	}
	interface Academy {
		id: string;
		longName: string;
		shortName: string;
		edLevel: Ecat.Shared.Core.Utility.EdLevel;
		base: Ecat.Shared.Core.Utility.AcademyBase;
		bbCategoryId: string;
		parentBbCategoryId: string;
	}
}
declare module ecat.entity.s.faculty {
	interface FacSpResponse {
		entityId: string;
		inventoryItemId: number;
		workGroupId: number;
		facultyPersonId: number;
		assesseePersonId: number;
		courseId: number;
		mpItemResponse: string;
		itemModelScore: number;
		scoreModelVersion: number;
		workGroup: ecat.entity.s.school.WorkGroup;
		assessee: ecat.entity.s.school.CrseStudentInGroup;
		facultyAssessor: ecat.entity.s.school.FacultyInCourse;
		inventoryItem: ecat.entity.s.designer.SpInventory;
	}
	interface FacSpComment {
		entityId: string;
		courseId: number;
		studentPersonId: number;
		facultyPersonId: number;
		workGroupId: number;
		version: number;
		commentText: string;
		mpCommentFlagRecipient: string;
		mpCommentFlagAuthor: string;
		student: ecat.entity.s.school.CrseStudentInGroup;
		facultyCourse: ecat.entity.s.school.FacultyInCourse;
		workGroup: ecat.entity.s.school.WorkGroup;
	}
	interface FacStratResponse {
		entityId: string;
		stratPosition: number;
		stratResultId: number;
		courseId: number;
		facultyPersonId: number;
		assesseePersonId: number;
		workGroupId: number;
		studentAssessee: ecat.entity.s.school.CrseStudentInGroup;
		workGroup: ecat.entity.s.school.WorkGroup;
		facultyAssessor: ecat.entity.s.school.FacultyInCourse;
		modifiedById: number;
		modifiedDate: Date;
	}
}
declare module ecat.entity.s.learner {
	interface SpComment {
		entityId: string;
		authorPersonId: number;
		recipientPersonId: number;
		facultyPersonId: number;
		workGroupId: number;
		courseId: number;
		mpCommentType: string;
		commentText: string;
		mpCommentFlagFac: string;
		mpCommentFlagAuthor: string;
		mpCommentFlagRecipient: string;
		author: ecat.entity.s.school.CrseStudentInGroup;
		recipient: ecat.entity.s.school.CrseStudentInGroup;
		commentFlaggedBy: ecat.entity.s.school.FacultyInCourse;
		workGroup: ecat.entity.s.school.WorkGroup;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpResponse {
		entityId: string;
		assessorPersonId: number;
		assesseePersonId: number;
		workGroupId: number;
		courseId: number;
		inventoryItemId: number;
		mpItemResponse: string;
		itemModelScore: number;
		inventoryItem: ecat.entity.s.designer.SpInventory;
		workGroup: ecat.entity.s.school.WorkGroup;
		course: ecat.entity.s.school.Course;
		assessor: ecat.entity.s.school.CrseStudentInGroup;
		assessee: ecat.entity.s.school.CrseStudentInGroup;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface SpResult {
		entityId: string;
		courseId: number;
		workGroupId: number;
		studentId: number;
		assignedInstrumentId: number;
		mpStudentSpResult: string;
		spResultScore: number;
		isScored: boolean;
		resultFor: ecat.entity.s.school.CrseStudentInGroup;
		assignedInstrument: ecat.entity.s.designer.SpInstrument;
		facultyResponses: ecat.entity.s.faculty.FacSpResponse[];
		spResponses: ecat.entity.s.learner.SpResponse[];
		sanitizedResponses: ecat.entity.s.learner.SanitizedSpResponse[];
		sanitizedComments: ecat.entity.s.learner.SanitizedSpComment[];
	}
	interface SanitizedSpResponse {
		id: number;
		resultEntityId: string;
		courseId: number;
		workGroupId: number;
		isInstructorResponse: boolean;
		isSelfResponse: boolean;
		peerGenericName: string;
		mpItemResponse: string;
		itemModelScore: number;
		inventoryItemId: number;
		assessResultId: number;
		inventoryItem: ecat.entity.s.designer.SpInventory;
		result: ecat.entity.s.learner.SpResult;
	}
	interface SanitizedSpComment {
		id: number;
		resultEntityId: number;
		courseId: number;
		workGroupId: number;
		authorName: string;
		commentText: string;
		mpCommentFlagAuthor: string;
		mpCommentFlagRecipient: string;
		result: ecat.entity.s.learner.SpResult;
	}
	interface StratResponse {
		entityId: string;
		assessorPersonId: number;
		assesseePersonId: number;
		courseId: number;
		workGroupId: number;
		stratPosition: number;
		assessor: ecat.entity.s.school.CrseStudentInGroup;
		assessee: ecat.entity.s.school.CrseStudentInGroup;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface StratResult {
		entityId: string;
		courseId: number;
		studentId: number;
		workGroupId: number;
		originalStratPosition: number;
		finalStratPosition: number;
		stratScore: number;
		resultFor: ecat.entity.s.school.CrseStudentInGroup;
		facStrat: ecat.entity.s.faculty.FacStratResponse;
		stratResponses: ecat.entity.s.learner.StratResponse[];
		modifiedById: number;
		modifiedDate: Date;
	}
	interface KcResult {
		id: number;
		instrumentId: number;
		numberCorrect: number;
		score: number;
		instrument: ecat.entity.s.designer.KcInstrument;
	}
	interface KcResponse {
		entityId: string;
		inventoryId: number;
		courseId: number;
		studentId: number;
		resultId: number;
		isCorrect: boolean;
		version: number;
		allowNewAttempt: boolean;
		student: ecat.entity.s.school.StudentInCourse;
		result: ecat.entity.s.learner.KcResult;
		inventory: ecat.entity.s.designer.KcInventory;
	}
}
declare module ecat.entity.s.designer {
	interface SpInventory {
		id: number;
		instrumentId: number;
		displayOrder: number;
		isScored: boolean;
		isDisplayed: boolean;
		behavior: string;
		modifiedById: number;
		modifiedDate: Date;
		instrument: ecat.entity.s.designer.SpInstrument;
		itemResponses: ecat.entity.s.learner.SpResponse[];
	}
	interface SpInstrument {
		id: number;
		name: string;
		isActive: boolean;
		version: string;
		studentInstructions: string;
		facultyInstructions: string;
		modifiedDate: Date;
		modifiedById: number;
		inventoryCollection: ecat.entity.s.designer.SpInventory[];
		assignedGroups: ecat.entity.s.school.WorkGroup[];
		spAssessMaps: ecat.entity.s.designer.SpAssessMap[];
	}
	interface SpAssessMap extends ecat.entity.s.designer.AssessMap {
		spInstrumentId: number;
		spInstrument: ecat.entity.s.designer.SpInstrument;
	}
	interface AssessMap {
		id: number;
		isActive: boolean;
		academyId: string;
		groupType: string;
		assignedData: Date;
	}
	interface KcInstrument {
		id: number;
		modifiedById: number;
		instructions: string;
		version: string;
		isActive: boolean;
		modifiedDate: Date;
		results: ecat.entity.s.learner.KcResult[];
		assignedGroups: ecat.entity.s.school.WorkGroup[];
	}
	interface KcInventory {
		id: number;
		modifiedById: number;
		instrumentId: number;
		displayOrder: number;
		isScored: boolean;
		isDisplayed: boolean;
		knowledgeArea: string;
		questionText: string;
		itemWeight: number;
		answer: string;
		modifiedDate: Date;
		instrument: ecat.entity.s.designer.KcInstrument;
		responses: ecat.entity.s.learner.KcResponse[];
	}
	interface CogInstrument {
		id: number;
		modifiedById: number;
		version: string;
		isActive: boolean;
		cogInstructions: string;
		mpCogInstrumentType: string;
		cogResultRange: string;
		modifiedDate: Date;
	}
	interface CogInventory {
		id: number;
		instrumentId: number;
		displayOrder: number;
		isScored: boolean;
		isDisplayed: boolean;
		adaptiveDescription: string;
		innovativeDescription: string;
		itemDescription: string;
		isReversed: boolean;
		instrument: ecat.entity.s.designer.CogInstrument;
		modifiedById: number;
		modifiedDate: Date;
	}
}
declare module ecat.entity.s.staff {
	interface MeetingAttendee {
		meetingId: number;
		attendeeId: number;
		isOrganizer: number;
		attendee: ecat.entity.s.user.ProfileStaff;
		meeting: ecat.entity.s.staff.Meeting;
	}
	interface Meeting {
		id: number;
		meetingReason: string;
		abstract: string;
		background: string;
		purpose: string;
		meetingDate: Date;
		attendees: ecat.entity.s.staff.MeetingAttendee[];
		actionItemses: ecat.entity.s.staff.ActionItem[];
		decisions: ecat.entity.s.staff.Decision[];
		discussions: ecat.entity.s.staff.Discussion[];
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
		meeting: ecat.entity.s.staff.Meeting;
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
		meeting: ecat.entity.s.staff.Meeting;
		modifiedById: number;
		modifiedDate: Date;
	}
	interface Discussion {
		id: number;
		meetingId: number;
		discussionItem: string;
		meeting: ecat.entity.s.staff.Meeting;
	}
}
declare module ecat.entity.s.cog {
	interface CogResponse {
		id: number;
		cogInventoryItem: number;
		itemScore: number;
	}
	interface CogResult {
		id: number;
		mpCogOutcome: string;
		mpCogScore: number;
	}
}
declare module ecat.entity.s.common {
	interface AcademyCategory {
		id: string;
		bbCatId: string;
		bbCatName: string;
		relatedCoursesCount: number;
	}
	interface LoginToken {
		personId: number;
		authToken: string;
		tokenExpireWarning: Date;
		tokenExpire: Date;
		person: ecat.entity.s.user.Person;
	}
}



