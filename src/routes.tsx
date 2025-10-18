import { createHashRouter } from 'react-router'
import Home from './pages/home'
import Record from './pages/record'


export const routes = createHashRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/record',
		element: <Record />,
	},
])
