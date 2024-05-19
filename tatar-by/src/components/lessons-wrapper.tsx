import lessonsService from '@/services/lessons.service'
import { useQuery } from '@tanstack/react-query'
import { EmptyCard } from './empty-card'
import { LessonCard } from './lesson-card'

export const LessonsWrapper = ({
	id,
	canCreate,
}: {
	id: string
	canCreate: boolean
}) => {
	const { data } = useQuery({
		queryKey: ['get lesson by course', 1],
		queryFn: () => lessonsService.get(id),
	})
	return (
		<ul className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] pb-32'>
			{data?.data.map((item, idx) => (
				<LessonCard
					key={`lesson-${idx}`}
					canCreate={canCreate}
					id={item.id}
					name={item.description}
					courseId={item.course.id}
					count={item.levels.length}
				/>
			))}
			{data?.data.length === 0 && (
				<EmptyCard
					text={<>Уроков нет</>}
					className='w-full h-full min-h-[400px]'
				/>
			)}
		</ul>
	)
}
