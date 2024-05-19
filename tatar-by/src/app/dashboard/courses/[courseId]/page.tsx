'use client'

import { CreateLessonDialog } from '@/components/create-lesson-dialog'
import { EmptyCard } from '@/components/empty-card'
import { LessonsWrapper } from '@/components/lessons-wrapper'
import coursesService from '@/services/courses.service'
import { useUserStore } from '@/stores/userStore'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'

export default function DetailCoursePage() {
	const params = useParams()
	const { user } = useUserStore()

	const { data } = useQuery({
		queryKey: ['get course by id', params.courseId],
		queryFn: () => coursesService.getById((params.courseId as string) || ''),
	})

	const canEdit = data
		? data.data.teacher_id === user?.id
			? true
			: data.data.teacher_id === null && user?.role === 'ROLE_EDITOR'
			? true
			: false
		: false

	return data?.data ? (
		<main className='relative px-3 sm:px-8 lg:pl-28 lg:pr-12 xl:px-36 py-8 xl:py-10 h-screen flex flex-col gap-8'>
			<motion.div
				initial={{
					opacity: 0,
					y: 20,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				exit={{
					opacity: 0,
					y: 20,
				}}
				transition={{
					duration: 0.75,
				}}
				className='flex flex-col gap-2'
			>
				<div className='flex items-center flex-wrap gap-4 justify-between'>
					<div className='flex flex-col gap-2'>
						<h1 className='text-2xl font-bold text-neutral-dark'>
							{data?.data.title}
						</h1>
						<span className='font-medium text-neutral-light'>
							Для людей в возрасте от{' '}
							<span className='font-bold text-neutral-dark'>
								{data?.data.min_age}
							</span>{' '}
							до{' '}
							<span className='font-bold text-neutral-dark'>
								{data?.data.max_age}
							</span>{' '}
							лет
						</span>
					</div>
					{canEdit && <CreateLessonDialog id={params.courseId as string} />}
				</div>
			</motion.div>
			<motion.div
				initial={{
					opacity: 0,
					y: 20,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				exit={{
					opacity: 0,
					y: 20,
				}}
				transition={{
					duration: 0.75,
					delay: 0.5,
				}}
				className='w-full h-full'
			>
				<LessonsWrapper
					id={params.courseId as string}
					canCreate={data.data.teacher_id === user?.id}
				/>
			</motion.div>
		</main>
	) : (
		<main className='relative px-3 sm:px-8 lg:pl-28 lg:pr-12 xl:px-36 py-8 xl:py-10 h-screen flex flex-col gap-8'>
			<EmptyCard className='w-full h-full' text={<>Курс не найден</>} />
		</main>
	)
}
