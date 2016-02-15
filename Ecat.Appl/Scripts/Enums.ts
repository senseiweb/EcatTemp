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
		Gunter = 2,
		Keesler = 4,
		Lackland = 8,
		Peterson = 16,
		Tyndall = 32,
		Sheppard = 64,
		McGheeTyson = 128,
		Elmendorf = 256,
		Hickam = 512,
		Kadena = 1024,
		Kisling = 2048
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

