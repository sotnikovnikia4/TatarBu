import { cn } from '@/utils/cn'

export const EmptyCard = ({
	text,
	className,
}: {
	text: string | React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'w-[350px] h-[250px] p-4 rounded-lg border border-neutral-secondary flex items-center justify-center',
				className
			)}
		>
			<h2 className='text-xl text-center font-bold text-neutral-dark'>
				{text}
			</h2>
		</div>
	)
}
