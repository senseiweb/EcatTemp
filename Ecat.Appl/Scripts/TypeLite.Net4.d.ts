
 
 
 

 

/// <reference path="Enums.ts" />

declare module Ecat.Models {
	interface EcPerson {
		personId: number;
		isActive: boolean;
		bbUserId: string;
		bbUserName: string;
		lastName: string;
		firstName: string;
		avatarLocation: string;
		goByName: string;
		mpGender: string;
		mpMilAffiliation: string;
		mpMilPaygrade: string;
		mpMilComponent: string;
		email: string;
		isRegistrationComplete: boolean;
		mpInstituteRole: string;
		student: Ecat.Models.EcStudent;
		facilitator: Ecat.Models.EcFacilitator;
		external: Ecat.Models.EcExternal;
		security: Ecat.Models.EcSecurity;
		courses: Ecat.Models.EcCourseMember[];
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface EcStudent {
		personId: number;
		contactNumber: string;
		homeStation: string;
		unitCommander: string;
		unitCommanderEmail: string;
		unitFirstSergeant: string;
		unitFirstSergeantEmail: string;
		bio: string;
		person: Ecat.Models.EcPerson;
		courseEnrollments: Ecat.Models.EcCourseMember[];
	}
	interface EcCourseMember {
		id: number;
		courseId: number;
		personId: number;
		mpCourseRole: string;
		course: Ecat.Models.EcCourse;
		person: Ecat.Models.EcPerson;
		groupEnrollments: Ecat.Models.EcGroupMember[];
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
	}
	interface EcCourse {
		id: number;
		academyId: number;
		bbCourseId: string;
		name: string;
		classNumber: string;
		term: string;
		startDate: Date;
		gradDate: Date;
		academy: Ecat.Models.EcAcademy;
		courseMembers: Ecat.Models.EcCourseMember[];
		groups: Ecat.Models.EcGroup[];
	}
	interface EcAcademy {
		id: number;
		name: string;
		base: string;
		mpEdLevel: string;
		bbCategoryId: string;
		courses: Ecat.Models.EcCourse[];
	}
	interface EcGroup {
		id: number;
		spInstrumentId: number;
		kcInstrumentId: number;
		courseId: number;
		mpCategory: string;
		groupNumber: string;
		customName: string;
		bbGroupId: string;
		defaultName: string;
		maxStrat: number;
		mpSpStatus: string;
		isHomeGroup: boolean;
		course: Ecat.Models.EcCourse;
		facSpReponses: Ecat.Models.FacSpAssessResponse[];
		facStratResponses: Ecat.Models.FacSpStratResponse[];
		facSpComments: Ecat.Models.FacSpComment[];
		groupMembers: Ecat.Models.EcGroupMember[];
		spInstrument: Ecat.Models.SpInstrument;
		kcInstrument: Ecat.Models.KcInstrument;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface FacSpAssessResponse {
		id: number;
		assesseeId: number;
		relatedInventoryId: number;
		assessResultId: number;
		assignedGroupId: number;
		mpSpItemResponse: string;
		itemResponseScore: number;
		scoreModelVersion: number;
		assignedGroup: Ecat.Models.EcGroup;
		assessee: Ecat.Models.EcGroupMember;
		relatedInventory: Ecat.Models.SpInventory;
		assessResult: Ecat.Models.SpAssessResult;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface EcGroupMember {
		id: number;
		groupId: number;
		courseEnrollmentId: number;
		personId: number;
		group: Ecat.Models.EcGroup;
		courseEnrollment: Ecat.Models.EcCourseMember;
		person: Ecat.Models.EcPerson;
		groupPeers: Ecat.Models.EcGroupMember[];
		assessorSpResponses: Ecat.Models.SpAssessResponse[];
		assesseeSpResponses: Ecat.Models.SpAssessResponse[];
		authorOfComments: Ecat.Models.SpComment[];
		recipientOfComments: Ecat.Models.SpComment[];
		assessorStratResponse: Ecat.Models.SpStratResponse[];
		assesseeStratResponse: Ecat.Models.SpStratResponse[];
		assessResults: Ecat.Models.SpAssessResult[];
		stratResults: Ecat.Models.SpStratResult[];
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface SpAssessResponse {
		id: number;
		assessorId: number;
		assesseeId: number;
		relatedInventoryId: number;
		assessResultId: number;
		mpSpItemResponse: string;
		itemResponseScore: number;
		scoreModelVersion: number;
		assessor: Ecat.Models.EcGroupMember;
		assessee: Ecat.Models.EcGroupMember;
		relatedInventory: Ecat.Models.SpInventory;
		assessResult: Ecat.Models.SpAssessResult;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface SpInventory {
		id: number;
		instrumentId: number;
		modifiedById: number;
		displayOrder: number;
		isScored: boolean;
		isDisplayed: boolean;
		behavior: string;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
		instrument: Ecat.Models.SpInstrument;
		grpMemberResponses: Ecat.Models.SpAssessResponse[];
		facResponses: Ecat.Models.FacSpAssessResponse[];
	}
	interface SpInstrument {
		id: number;
		modifiedById: number;
		mpEdLevel: string;
		groupType: string;
		isActive: boolean;
		version: string;
		selfInstructions: string;
		peerInstructions: string;
		facilitatorInstructions: string;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
		inventories: Ecat.Models.SpInventory[];
		assignedGroups: Ecat.Models.EcGroup[];
		groupTypeList: string[];
	}
	interface SpAssessResult {
		id: number;
		grpMemberId: number;
		spInstrumentId: number;
		mpAssessResult: string;
		assessResultScore: number;
		scoreModelVersion: number;
		grpMember: Ecat.Models.EcGroupMember;
		spInstrument: Ecat.Models.SpInstrument;
		sourceResponses: Ecat.Models.SpAssessResponse[];
		sourceFacResponses: Ecat.Models.FacSpAssessResponse[];
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
		author: Ecat.Models.EcGroupMember;
		recipient: Ecat.Models.EcGroupMember;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
		facFlaggedBy: Ecat.Models.EcPerson;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface SpStratResponse {
		id: number;
		assessorId: number;
		assesseeId: number;
		stratPosition: number;
		stratResultId: number;
		assessor: Ecat.Models.EcGroupMember;
		assessee: Ecat.Models.EcGroupMember;
		stratResult: Ecat.Models.SpStratResult;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface SpStratResult {
		id: number;
		grpMemberId: number;
		fac: number;
		scoreModelVersion: number;
		originalStratPosition: number;
		finalStratPosition: number;
		stratScore: number;
		grpMember: Ecat.Models.EcGroupMember;
		facStratResponse: Ecat.Models.FacSpStratResponse;
		sourceResponses: Ecat.Models.SpStratResponse[];
	}
	interface FacSpStratResponse {
		id: number;
		assesseeId: number;
		stratPosition: number;
		stratResultId: number;
		assignedGroupId: number;
		assessee: Ecat.Models.EcGroupMember;
		stratResult: Ecat.Models.SpStratResult;
		assignedGroup: Ecat.Models.EcGroup;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface FacSpComment {
		id: number;
		recipientId: number;
		assignedGroupId: number;
		commentText: string;
		mpCommentFlagRecipient: string;
		recipient: Ecat.Models.EcGroupMember;
		assignedGroup: Ecat.Models.EcGroup;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
		facFlaggedBy: Ecat.Models.EcPerson;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface KcInstrument {
		id: number;
		modifiedById: number;
		instructions: string;
		version: string;
		isActive: boolean;
		modifiedDate: Date;
		results: Ecat.Models.KcResult[];
		assignedGroups: Ecat.Models.EcGroup[];
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface KcResult {
		id: number;
		instrumentId: number;
		numberCorrect: number;
		score: number;
		instrument: Ecat.Models.KcInstrument;
	}
	interface EcFacilitator {
		personId: number;
		bio: string;
		person: Ecat.Models.EcPerson;
	}
	interface EcExternal {
		personId: number;
		homeStation: string;
		bio: string;
		person: Ecat.Models.EcPerson;
	}
	interface EcSecurity {
		personId: number;
		passwordHash: string;
		tempPassword: string;
		passwordExpire: Date;
		person: Ecat.Models.EcPerson;
	}
	interface AcademyCategory {
		id: string;
		bbCatId: string;
		bbCatName: string;
		relatedCoursesCount: number;
	}
	interface LoginToken {
		personId: number;
		authToken: string;
		role: Ecat.Models.EcRoles;
		tokenExpireWarning: Date;
		tokenExpire: Date;
		person: Ecat.Models.EcPerson;
	}
}


