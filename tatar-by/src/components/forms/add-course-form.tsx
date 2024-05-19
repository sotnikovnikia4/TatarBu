import {
	CreateCourseSchema,
	CreateCourseValidationSchema,
} from '@/schemas/schemas'
import coursesService from '@/services/courses.service'
import { useUserStore } from '@/stores/userStore'
import { CreateCourseReq } from '@/types/courses'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const AddCourseForm = () => {
	const { user } = useUserStore()
	const {
		setValue,
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateCourseValidationSchema>({
		resolver: zodResolver(CreateCourseSchema),
		defaultValues: {
			title: '',
			teacher_id: user?.id,
			min_age: '',
			max_age: '',
		},
	})

	useEffect(() => {
		setValue('teacher_id', user?.id || '')
	}, [user])

	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn:
			user?.role === 'ROLE_TEACHER'
				? (data: CreateCourseReq) => coursesService.createByTeacher(data)
				: (data: CreateCourseReq) => coursesService.createByEditor(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey:
					user?.role === 'ROLE_TEACHER'
						? ['teacherCourses', 1]
						: ['allCourses', 1],
			})
		},
	})

	const onSubmit: SubmitHandler<CreateCourseValidationSchema> = async data => {
		mutate({
			title: data.title,
			teacher_id: data.teacher_id,
			min_age: Number(data.min_age),
			max_age: Number(data.max_age),
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='w-full flex flex-col gap-y-2'
		>
			<Input
				placeholder='Название'
				error={errors.title?.message}
				{...register('title')}
			/>
			<Input
				placeholder='Минимальный возраст'
				error={errors.min_age?.message}
				{...register('min_age')}
			/>
			<Input
				placeholder='Максимальный возраст'
				error={errors.max_age?.message}
				{...register('max_age')}
			/>
			<Input
				placeholder='Идентификатор учителя'
				error={errors.teacher_id?.message}
				{...register('teacher_id')}
			/>
			<Button className='mt-2' type='submit'>
				Создать курс
			</Button>
		</form>
	)
}
