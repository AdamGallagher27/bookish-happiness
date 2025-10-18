import { Title } from '@/components/Title'
import { Link } from 'react-router'

const Home = () => {
	return (
		<div className='min-h-screen bg-gray-100 px-6 py-10'>
			<div>
				<Title text='Record a Story' />
				<Link to='/record'>Record</Link>
			</div>
			<div className='flex'></div>
		</div>
	)
}

export default Home
