import levelsService from '@/services/levels.service'
import { useQuery } from '@tanstack/react-query'
import { EmptyCard } from './empty-card'
import { LevelsCard } from './levels-card'

export const LevelsWrapper = ({
	id,
	courseId,
	canCreate,
}: {
	id: string
	courseId: string
	canCreate: boolean
}) => {
	const { data } = useQuery({
		queryKey: ['get levels by lesson', 1],
		queryFn: () => levelsService.getAll(id),
	})
	return (
		<ul className='grid gap-6 grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] pb-32'>
			{data?.data.map((item, idx) => (
				<LevelsCard
					key={`level-${idx}`}
					id={item.id}
					task={item.task}
					correct_answer={item.correct_answer}
					level_type={item.level_type}
					lesson={item.lesson}
					points={item.points}
					courseId={courseId}
				/>
			))}
			{data?.data.length === 0 && (
				<EmptyCard
					text={<>Уровней нет</>}
					className='w-full h-full min-h-[400px]'
				/>
			)}
		</ul>
	)
}
