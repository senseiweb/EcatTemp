
 
 
 

 

/// <reference path="Enums.ts" />

declare module Ecat.Models {
	interface EcPerson {
		personId: number;
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
	interface EcCourseMember {
		id: number;
		courseId: number;
		personId: number;
		mpCourseRole: string;
		course: Ecat.Models.EcCourse;
		person: Ecat.Models.EcPerson;
		groups: Ecat.Models.EcGroupMember[];
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
		members: Ecat.Models.EcCourseMember[];
		groups: Ecat.Models.EcGroup[];
	}
	interface EcAcademy {
		id: number;
		mpEducationLevel: string;
		epmeSchool: Ecat.Models.EpmeSchool;
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
		mpSpStatus: number;
		isHomeGroup: boolean;
		course: Ecat.Models.EcCourse;
		members: Ecat.Models.EcGroupMember[];
		spInstrument: Ecat.Models.SpInstrument;
		kcInstrument: Ecat.Models.KcInstrument;
	}
	interface EcGroupMember {
		id: number;
		groupId: number;
		memberId: number;
		group: Ecat.Models.EcGroup;
		member: Ecat.Models.EcCourseMember;
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
		mpSpItemResponse: number;
		itemResponseScore: number;
		scoreModelVersion: number;
		assessor: Ecat.Models.EcGroupMember;
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
	interface SpInventory {
		id: number;
		instrumentId: number;
		modifiedById: number;
		displayOrder: number;
		isScored: boolean;
		isDisplayed: boolean;
		selfBehavior: string;
		peerBehavior: string;
		instructorBehavior: string;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
		instrument: Ecat.Models.SpInstrument;
		responses: Ecat.Models.SpAssessResponse[];
	}
	interface SpInstrument {
		id: number;
		modifiedById: number;
		isActive: boolean;
		version: string;
		selfInstructions: string;
		peerInstructions: string;
		instructorInstructions: string;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
		inventories: Ecat.Models.SpInventory[];
		assignedGroups: Ecat.Models.EcGroup[];
	}
	interface SpAssessResult {
		id: number;
		grpMemberId: number;
		spInstrumentId: number;
		mpAssessResult: string;
		assessResultScore: number;
		scoreModelVersion: number;
		responseCount: number;
		grpMember: Ecat.Models.EcGroupMember;
		spInstrument: Ecat.Models.SpInstrument;
	}
	interface SpComment {
		id: number;
		authorId: number;
		recipientId: number;
		mpCommentType: string;
		commentText: string;
		mpInstructorFlag: string;
		mpRecipientFlag: string;
		author: Ecat.Models.EcGroupMember;
		recipient: Ecat.Models.EcGroupMember;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface SpStratResponse {
		id: number;
		assessorId: number;
		assesseeId: number;
		stratPosition: number;
		assessor: Ecat.Models.EcGroupMember;
		assessee: Ecat.Models.EcGroupMember;
		isDeleted: boolean;
		deletedById: number;
		deletedDate: Date;
		deletedBy: Ecat.Models.EcPerson;
		modifiedById: number;
		modifiedDate: Date;
		modifiedBy: Ecat.Models.EcPerson;
	}
	interface SpStratResult {
		id: number;
		grpMemberId: number;
		scoreModelVersion: number;
		stratPosition: number;
		stratScore: number;
		voteCount: number;
		grpMember: Ecat.Models.EcGroupMember;
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
	interface LoginToken {
		personId: number;
		authToken: string;
		role: Ecat.Models.EcRoles;
		tokenExpireWarning: Date;
		tokenExpire: Date;
		person: Ecat.Models.EcPerson;
	}
}


