'use client'

import { ResponsiveNavbar } from '@/components/dashboard-navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

interface IDashboardLayout {
	children: React.ReactNode
}

const queryClient = new QueryClient()

export default function DashboardLayout({ children }: IDashboardLayout) {
	return (
		<QueryClientProvider client={queryClient}>
			<Toaster richColors position='top-center' />
			<ResponsiveNavbar />
			<main>{children}</main>
		</QueryClientProvider>
	)
}
