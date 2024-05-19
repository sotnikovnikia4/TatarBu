'use client'

import { TaskWrapper } from '@/components/task-wrapper'
import levelsService from '@/services/levels.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export default function LessonPage() {
	const params = useParams()
	const { data } = useQuery({
		queryKey: ['get level by id', 1],
		queryFn: () => levelsService.getById(params.levelId as string),
	})

	return (
		<main className='min-h-screen relative px-3 sm:px-8 lg:pl-28 lg:pr-12 xl:px-36 py-8 xl:py-10 flex flex-col gap-4'>
			{/*<div className='flex flex-wrap gap-4 justify-between'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-2xl font-bold text-neutral-dark'>
						Задание {data?.data.task}
					</h1>
				</div>
	</div>*/}
			{data && (
				<TaskWrapper
					id={data?.data.id}
					correct_answer={data.data.correct_answer}
					lesson={data.data.lesson}
					level_type={data.data.level_type}
					points={data.data.points}
					task={data.data.task}
				/>
			)}
		</main>
	)
}
