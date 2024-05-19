'use client'

import { InputTaskSchema, InputTaskValidationSchema } from '@/schemas/schemas'
import levelsService from '@/services/levels.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MascottWrapper } from '../mascott-wrapper'
import { Button } from '../ui/button'
import { Input, WarningIcon } from '../ui/input'

interface IInputTaskWrapper {
	id: string
	title: string | React.ReactNode
	task: string
}

export const InputTaskWrapper = ({ id, title, task }: IInputTaskWrapper) => {
	const router = useRouter()
	const [err, setErr] = useState<boolean>(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputTaskValidationSchema>({
		resolver: zodResolver(InputTaskSchema),
		defaultValues: {
			level: {
				id: id,
			},
			answer: '',
		},
	})

	const { mutate, data } = useMutation({
		mutationFn: (data: {
			level: {
				id: string
			}
			answer: string[]
		}) => levelsService.checkAnswer(data),
		mutationKey: ['get level by id', 1],
		onSuccess: d => {
			if (d?.data.answer_correctness === 100) {
				setErr(false)
				toast.success('Вы ответили правильно!')
				setInterval(() => router.back(), 1000)
			} else if (d?.data.answer_correctness < 100) {
				setErr(true)
			}
		},
	})

	const onSubmit: SubmitHandler<InputTaskValidationSchema> = d => {
		mutate({
			level: {
				id: d.level.id,
			},
			answer: [d.answer],
		})
	}

	return (
		<div className='min-h-[90vh] grid gap-6 grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] items-center place-items-center'>
			<form className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
				<h1 className='text-2xl font-bold text-neutral-dark'>{title}</h1>
				<h2 className='text-xl font-bold text-neutral-dark'>{task}</h2>
				<Input
					placeholder='Введите ответ'
					error={errors.answer?.message}
					{...register('answer')}
				/>
				{err && (
					<span className='text-red-700 mt-1 text-xs font-medium flex items-center gap-2 whitespace-nowrap'>
						{<WarningIcon />}
						Вы допустили ошибку, попробуйте еще раз
					</span>
				)}
				<Button className='mt-1' type='submit'>
					Отправить
				</Button>
			</form>
			<div>
				<MascottWrapper
					textClassName='-left-10 -top-24 min-w-[200px] text-center'
					text={err && <>Ошибка! Попробуй еще раз</>}
				/>
			</div>
		</div>
	)
}
