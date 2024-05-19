import { Level } from './levels'

export interface Lesson {
	id: string
	course: {
		id: string
	}
	description: string
	levels: Level[]
}

export type CreateLessonReq = Omit<Lesson, 'id'>
