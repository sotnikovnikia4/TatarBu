'use client'

import { ClassroomCard } from '@/components/classroom-card'
import { CreateClassroomDialog } from '@/components/create-classroom-dialog'
import { EmptyCard } from '@/components/empty-card'
import { EnterRandomClassroom } from '@/components/enter-random-classroom'
import classroomsService from '@/services/classrooms.service'
import { useUserStore } from '@/stores/userStore'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

export default function ClassroomPage() {
	const { user, update } = useUserStore()
	const { data, isSuccess } = useQuery({
		queryKey: ['classrooms', 1],
		queryFn:
			user && user.role === 'ROLE_PUPIL'
				? () => classroomsService.getByUser(user.id)
				: () => classroomsService.getAll(),
	})

	if (isSuccess) {
		if (user?.role === 'ROLE_PUPIL' && data && data.data.length > 0) {
			update({ ...user, group: data.data[0].id })
		}
	}

	return (
		<motion.main
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
			className='relative px-3 sm:px-8 lg:pl-28 lg:pr-12 xl:pl-36 xl:pr-12 py-8 xl:py-10 h-screen flex flex-col gap-5'
		>
			<div className='flex items-center justify-between'>
				<h1 className='text-neutral-dark text-2xl font-bold'>Список классов</h1>
				{user?.role === 'ROLE_TEACHER' && (
					<div className='flex gap-3'>
						<CreateClassroomDialog />
					</div>
				)}
			</div>
			<ul className='gap-6 grid grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] pb-20'>
				{data?.data?.map((item, idx) => (
					<ClassroomCard
						key={`classroom-${idx}`}
						name={item.name}
						teacher={item.teacher}
						id={item.id}
						students={item.students}
						canLeave={
							user?.role === 'ROLE_PUPIL'
								? item.students.filter(i => i.login === user.login).length > 0
									? true
									: false
								: false
						}
						canDelete={item.teacher.id === user?.id}
					/>
				))}
				{data?.data.length === 0 && (
					<EmptyCard
						text={
							user?.role === 'ROLE_PUPIL' ? (
								<div className='flex flex-col gap-1'>
									<span>Вы не состоите в классе</span>
									<EnterRandomClassroom />
								</div>
							) : (
								<>Классов нет</>
							)
						}
					/>
				)}
			</ul>
		</motion.main>
	)
}
