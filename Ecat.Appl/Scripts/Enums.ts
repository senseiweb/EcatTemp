module Ecat.Shared.Model {
	export const enum EdLevel {
		None = 0,
		Chief = 2,
		Senior = 4,
		Ncoa = 8,
		Airman = 16,
		Instructor = 32
	}
	export const enum AcademyBase {
		None = 0,
		Gunter = 1,
		Keesler = 2,
		Lackland = 3,
		Peterson = 4,
		Tyndall = 5,
		Sheppard = 6,
		McGheeTyson = 7,
		Elmendorf = 8,
		Hickam = 9,
		Kadena = 10,
		Kisling = 11
	}
	export const enum RoleMap {
		Unknown = 0,
		SysAdmin = 1,
		Designer = 2,
		CrseAdmin = 3,
		Facilitator = 4,
		Student = 5,
		External = 6,
		RefOnly = 7
	}
}

