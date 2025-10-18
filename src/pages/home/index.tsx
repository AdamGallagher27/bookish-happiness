import { useEffect, useState } from 'react'
import { Link } from 'react-router'

interface HomeResponse {
	message: string
}

const testAPI = async (
	setData: React.Dispatch<React.SetStateAction<HomeResponse | null>>,
) => {
	try {
		const response = await fetch('http://localhost:8000/')

		if (response.ok) {
			const data: HomeResponse = await response.json()
			setData(data)
		}
	} catch (error) {
		console.error(error)
	}
}

const Home = () => {
	const [data, setData] = useState<HomeResponse | null>(null)

	useEffect(() => {
		testAPI(setData)
	}, [])

	return (
		<div>
			<p>Homepage</p>
			{data && data.message}
			<Link to='/record'>record</Link>
		</div>
	)
}

export default Home
