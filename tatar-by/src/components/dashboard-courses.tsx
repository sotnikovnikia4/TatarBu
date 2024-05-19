'use client'

import coursesService from '@/services/courses.service'
import { useUserStore } from '@/stores/userStore'
import { cn } from '@/utils/cn'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AddCourseDialog } from './add-course-dialog'
import { EmptyCard } from './empty-card'
import { ScrollableCard } from './scrollable-card'

const slideWidth = 350
const slideGap = 20

const scrollToSlide = (slider: HTMLUListElement | null, slideIndex: number) => {
	if (!slider) return
	slider.scrollTo({
		left: slideIndex * (slideWidth + slideGap),
		behavior: 'smooth',
	})
}

interface IScrollableSection {
	text: string | React.ReactNode
	emptyString: string | React.ReactNode
	withCreate?: boolean
	className?: string
	options:
		| Array<{
				id: string
				title: string
				min_age: number
				max_age: number
		  }>
		| []
}

export const ScrollableSection = ({
	text,
	options,
	emptyString,
	withCreate = false,
	className,
}: IScrollableSection) => {
	const sliderRef = useRef<HTMLUListElement>(null)
	const [sliderPos, setSliderPos] = useState(0)
	const [currSlide, setCurrSlide] = useState(0)
	const [scrollToEndOfSlider, setScrollToEndOfSlider] = useState(false)

	const updateSliderState = () => {
		const slider = sliderRef.current
		if (!slider) return
		setSliderPos(slider.scrollLeft)
		setCurrSlide(Math.floor(slider.scrollLeft / (slideWidth + slideGap)))
		setScrollToEndOfSlider(
			slider.scrollWidth - slider.scrollLeft - slider.clientWidth === 0
		)
	}

	useEffect(() => {
		const slider = sliderRef.current
		if (!slider) return
		const handleScroll = () => updateSliderState()
		slider.addEventListener('scroll', handleScroll)
		return () => slider.removeEventListener('scroll', handleScroll)
	}, [])

	const nextSlide = useCallback(() => {
		scrollToSlide(sliderRef.current, currSlide + 1)
	}, [currSlide])

	const prevSlide = useCallback(() => {
		scrollToSlide(sliderRef.current, currSlide - 1)
	}, [currSlide])

	return (
		<div className='flex flex-col gap-4'>
			<div className='h-[325px] flex flex-col gap-4 overflow-hidden'>
				<div className='flex items-center gap-8'>
					<h1 className='text-xl font-bold text-neutral-dark'>{text}</h1>
					{withCreate && <AddCourseDialog />}
				</div>
				<ul
					ref={sliderRef}
					onScroll={ev => {
						setSliderPos(ev.currentTarget.scrollLeft)
					}}
					className={cn(
						'min-h-[325px] flex gap-5 pb-10 overflow-x-auto snap-x snap-mandatory',
						className
					)}
				>
					{options?.map((item, idx) => (
						<li key={`courses-${idx}`} className='snap-start'>
							<ScrollableCard
								id={item.id}
								title={item.title}
								min_age={item.min_age}
								max_age={item.max_age}
							/>
						</li>
					))}
					{options.length === 0 && <EmptyCard text={emptyString} />}
				</ul>
			</div>
			{options.length > 1 && (
				<div className='flex items-center justify-center gap-4'>
					<button
						onClick={() => prevSlide()}
						className='p-2 rounded-xl border border-neutral-light hover:bg-neutral-light/10 transition-all disabled:opacity-80'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='w-6 h-6 stroke-neutral-dark'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M15.75 19.5 8.25 12l7.5-7.5'
							/>
						</svg>
					</button>
					<button
						onClick={() => nextSlide()}
						className='p-2 rounded-xl border border-neutral-light hover:bg-neutral-light/10 transition-all disabled:opacity-80'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='w-6 h-6 stroke-neutral-dark'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m8.25 4.5 7.5 7.5-7.5 7.5'
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	)
}

export const DashboardCourses = () => {
	const { user } = useUserStore()
	const { data } = useQuery({
		queryKey: ['allCourses', 1],
		queryFn: () => coursesService.getEditorCourses(),
	})

	return (
		<ScrollableSection
			emptyString={<>Курсов пока нет</>}
			text={<Link href={'/dashboard/courses'}>Доступные курсы</Link>}
			options={data?.data || []}
			withCreate={user?.role === 'ROLE_PUPIL' ? false : true}
		/>
	)
}

export const TeacherCourses = () => {
	const { user } = useUserStore()
	const { data } = useQuery({
		queryKey: ['teacherCourses', 1],
		queryFn: () => coursesService.getByTeacherId(user?.id || ''),
	})

	return (
		<ScrollableSection
			emptyString={<>Курсов пока нет</>}
			text={<Link href={'/dashboard/courses'}>Ваши курсы</Link>}
			options={data?.data || []}
			withCreate={user?.role === 'ROLE_PUPIL' ? false : true}
		/>
	)
}

export const UserCourses = ({ id }: { id: string }) => {
	const { data } = useQuery({
		queryKey: ['userCourses', 1],
		queryFn: () => coursesService.getByStudentId(id),
	})

	return (
		<ScrollableSection
			emptyString={<>Вы не состоите ни в 1 курсе</>}
			text={<>Ваши курсы</>}
			options={data ? data.data : []}
		/>
	)
}
