import { LevelSchema, LevelValidationSchema } from '@/schemas/schemas'
import levelsService from '@/services/levels.service'
import { useUserStore } from '@/stores/userStore'
import { Level } from '@/types/levels'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const CreateLevelForm = ({ id }: { id: string }) => {
	const { user } = useUserStore()
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<LevelValidationSchema>({
		resolver: zodResolver(LevelSchema),
		defaultValues: {
			lesson: {
				id: id,
			},
			level_type: '',
			task: '',
			correct_answer: '',
			points: '',
		},
	})

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: (data: Omit<Level, 'id'>) => levelsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get lesson by id', 1] })
		},
	})

	const onSubmit: SubmitHandler<LevelValidationSchema> = async data => {
		console.log(data)
		mutate({
			...data,
			correct_answer: data.correct_answer.split('-'),
			points: Number(data.points),
			level_type: Number(data.level_type),
		})
		reset()
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='w-full flex flex-col gap-y-2'
		>
			<Input
				placeholder='ID урока'
				error={errors.lesson?.id?.message}
				{...register('lesson.id')}
			/>
			<Input
				placeholder='Выберите тип 0-2'
				error={errors.level_type?.message}
				{...register('level_type')}
			/>
			<Input
				placeholder='Варианты задания'
				error={errors.task?.message}
				{...register('task')}
			/>
			<Input
				placeholder='Правильная последовательность'
				error={errors.correct_answer?.message}
				{...register('correct_answer')}
			/>
			<Input
				placeholder='Количестов очков'
				error={errors.points?.message}
				{...register('points')}
			/>
			<Button className='mt-2' type='submit'>
				Создать курс
			</Button>
		</form>
	)
}
