interface Props {
	value: string
	onChange(e: unknown): void
}

export const TextInput = ({ value, onChange }: Props) => {
	return (
		<input
			type='text'
			placeholder='Your Full Name'
			value={value}
			onChange={onChange}
			className='w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800'
		/>
	)
}
