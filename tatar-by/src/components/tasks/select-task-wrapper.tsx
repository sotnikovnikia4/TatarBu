'use client'

import { SelectTaskSchema, SelectTaskValidationSchema } from '@/schemas/schemas'
import levelsService from '@/services/levels.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MascottWrapper } from '../mascott-wrapper'
import { Button } from '../ui/button'
import { WarningIcon } from '../ui/input'
import { Select } from '../ui/select'

interface ISelectTaskWrapper {
	id: string
	title: string | React.ReactNode
	options: Array<{
		value: string
		label: string
	}>
}

export const SelectTaskWrapper = ({
	id,
	title,
	options,
}: ISelectTaskWrapper) => {
	const router = useRouter()
	const [selected, setSelected] = useState<string[]>([])
	const [err, setErr] = useState<boolean>(false)

	const handleSelect = (s: string | null) => {
		if (!s) return
		if (selected.find(i => i === s)) {
			setSelected(prev => prev.filter(i => i !== s))
			return
		}
		setSelected(prev => [...prev, s])
	}

	useEffect(() => {
		setValue('answer', selected)
	}, [selected])

	const { mutate, data } = useMutation({
		mutationFn: (d: any) => levelsService.checkAnswer(d),
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

	const {
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<SelectTaskValidationSchema>({
		resolver: zodResolver(SelectTaskSchema),
		defaultValues: {
			level: {
				id: id,
			},
			answer: selected,
		},
	})

	const onSubmit: SubmitHandler<SelectTaskValidationSchema> = d => {
		mutate({
			level: {
				id: d.level.id,
			},
			answer: d.answer,
		})
	}

	return (
		<div className='min-h-[90vh] grid gap-6 grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] items-center place-items-center'>
			<form className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
				<h1 className='text-2xl font-bold text-neutral-dark'>{title}</h1>
				<Select
					error={errors?.answer?.message}
					selected={selected}
					setSelected={handleSelect}
					options={options}
					withIdx
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
