import { Level } from '@/types/levels'
import { InputTaskWrapper } from './tasks/input-task-wrapper'
import { RecordingTaskWrapper } from './tasks/recording-task-wrapper'
import { SelectTaskWrapper } from './tasks/select-task-wrapper'

export const TaskWrapper = (data: Level) => {
	return data.level_type === 0 ? (
		<SelectTaskWrapper
			id={data.id}
			title={<>Поставь слова в правильном порядке</>}
			options={data.task
				.split('-')
				.map(item => ({ value: item.trim(), label: item.trim() }))}
		/>
	) : data.level_type === 1 ? (
		<InputTaskWrapper
			id={data.id}
			title={<>Напиши правильное слово/словосочетание</>}
			task={data.task}
		/>
	) : (
		<RecordingTaskWrapper
			id={data.id}
			title={<>Проверка произношения</>}
			task={data.task}
		/>
	)
}
