interface Props {
	text: string
}

export const Title = ({ text }: Props) => {
	return <h1 className='text-3xl font-semibold text-gray-800 mb-2'>{text}</h1>
}
