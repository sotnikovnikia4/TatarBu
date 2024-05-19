'use client'

import { CreateLevelDialog } from '@/components/create-level-dialog'
import { LevelsWrapper } from '@/components/levels-wrapper'
import lessonsService from '@/services/lessons.service'
import { useUserStore } from '@/stores/userStore'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export default function LessonPage() {
	const params = useParams()
	const { user } = useUserStore()
	const { data } = useQuery({
		queryKey: ['get lesson by id', 1],
		queryFn: () => lessonsService.getById(params.lessonId as string),
	})

	return (
		<main className='relative px-3 sm:px-8 lg:pl-28 lg:pr-12 xl:px-36 py-8 xl:py-10 h-screen flex flex-col gap-8'>
			<div className='flex items-center flex-wrap gap-4 justify-between'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-2xl font-bold text-neutral-dark'>
						Урок {data?.data.description}
					</h1>
				</div>
				{user?.role === 'ROLE_TEACHER' && (
					<CreateLevelDialog id={params.lessonId as string} />
				)}
				{user?.role === 'ROLE_EDITOR' && (
					<CreateLevelDialog id={params.lessonId as string} />
				)}
			</div>
			<LevelsWrapper
				id={params.lessonId as string}
				canCreate={true}
				courseId={params.courseId as string}
			/>
		</main>
	)
}
