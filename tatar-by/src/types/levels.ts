export interface Level {
	id: string
	task: string
	points: number
	lesson: {
		id: string
	}
	level_type: number
	correct_answer: string[]
}

export interface CheckInfo {
	errors: string[]
	answer_correctness: number
}
