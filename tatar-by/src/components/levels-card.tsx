import { Level } from '@/types/levels'
import Link from 'next/link'

interface Props {
	courseId: string
}

export const LevelsCard = ({
	id,
	courseId,
	lesson,
	points,
	level_type,
}: Level & Props) => {
	return (
		<div className='fle flex-col gap-2 min-h-[250px] w-full min-w-[350px] bg-accent-green p-6 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity'>
			<Link
				href={`/dashboard/courses/${courseId}/${lesson.id}/${id}`}
				className='text-xl font-bold text-neutral-dark text-center'
			>
				Уровень {lesson.id}
			</Link>
			<span className='font-medium text-neutral-dark'>
				Тип уровня: {level_type === 0 && 'Выбери слова в правильном порядке'}{' '}
				{level_type === 1 && 'Напиши правильное слово'}{' '}
				{level_type === 2 && 'Аудиозапись'}
			</span>
			<span className='font-medium text-neutral-dark'>
				Количество очков: {points}
			</span>
		</div>
	)
}
