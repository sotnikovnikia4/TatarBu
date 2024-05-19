'use client'

import useRecorder from '@/hooks/use-recoder'
import useRecordingsList from '@/hooks/use-recording-list'
import { InputTaskSchema, InputTaskValidationSchema } from '@/schemas/schemas'
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
import { RecorderControls } from '../ui/recorder-controls'
import RecordingsList from '../ui/recordings-list'

interface IRecordingTaskWrapper {
	id: string
	title: string | React.ReactNode
	task: string
}

export const RecordingTaskWrapper = ({
	id,
	title,
	task,
}: IRecordingTaskWrapper) => {
	const router = useRouter()
	const { recorderState, ...handlers } = useRecorder()
	const { audio } = recorderState
	const { recordings } = useRecordingsList(audio)
	const [state, setState] = useState<number>(0)
	const [err, setErr] = useState<boolean>(false)
	const [acc, setAcc] = useState<number>(0)

	const { mutate, isError, data } = useMutation({
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
				setAcc(d?.data.answer_correctness)
				setErr(true)
			}
		},
	})

	const {
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<InputTaskValidationSchema>({
		resolver: zodResolver(InputTaskSchema),
		defaultValues: {
			level: {
				id: id,
			},
			answer: recordings[0]?.audio,
		},
	})
	useEffect(() => {
		if (recordings.length === 0) {
			return
		}
		setValue('answer', recordings[0]?.audio)
	}, [state])

	const onSubmit: SubmitHandler<InputTaskValidationSchema> = d => {
		mutate({
			level: {
				id: id,
			},
			answer: [d.answer],
		})
	}

	return (
		<div className='min-h-[90vh] grid gap-6 grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] items-center place-items-center'>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-1'>
					<h1 className='text-2xl font-bold text-neutral-dark'>{title}</h1>
					<span className='text-xl font-bold text-neutral-dark'>{task}</span>
					<span className='text-neutral-light'>
						Для записи голоса нажмите на кнопку
					</span>
				</div>
				<div className='max-w-[500px] flex flex-col gap-2'>
					<RecorderControls
						disabled={state === 1}
						recorderState={recorderState}
						handlers={handlers}
					/>
					<RecordingsList setState={setState} audio={audio} />
					{err && (
						<span className='text-red-700 mt-1 text-xs font-medium flex items-center gap-2 whitespace-nowrap'>
							{<WarningIcon />}
							Вы допустили ошибку, попробуйте еще раз
							<br />
							Ваш ответ правильный на: {acc}%
						</span>
					)}
					<Button className='mt-1 w-full' type='submit'>
						Отправить
					</Button>
				</div>
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
