import { axiosWithAuth } from '@/api/interceptors'
import { CheckInfo, Level } from '@/types/levels'

class LevelsService {
	private URL = 'http://localhost:8082' + '/levels'

	async create(data: Omit<Level, 'id'>) {
		return axiosWithAuth.post<Level>(this.URL + '/create', data)
	}

	async getAll(id: string) {
		if (id === '') return
		return axiosWithAuth.get<Level[]>(this.URL + `?lesson_id=${id}`)
	}

	async getById(id: string) {
		if (id === '') return
		return axiosWithAuth.get<Level>(this.URL + `/${id}`)
	}

	async checkAnswer(data: {
		level: {
			id: string
		}
		answer: string[]
	}) {
		return axiosWithAuth.post<CheckInfo>(this.URL + `/check-answer`, data)
	}
}

export default new LevelsService()
