import { ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export const Paragraph = ({ children }: Props) => {
	return <p className='text-gray-600 max-w-xl mx-auto'>{children}</p>
}
