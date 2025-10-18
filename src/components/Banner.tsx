interface Props {
	status: string | null
}

const successClass = 'bg-green-100 border-green-400 text-green-800'
const failClass = 'bg-red-100 border-red-400 text-red-800'

export const Banner = ({ status }: Props) => {
	if (!status) return null

	return (
		<div
			className={`${status === 'sucess' ? successClass : failClass} border px-4 py-3 rounded-lg text-center`}
		>
			{status === 'success'
				? 'Your message was uploaded successfully.'
				: 'There was an error uploading your message. Please try again.'}
		</div>
	)
}
