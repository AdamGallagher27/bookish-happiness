import { openDB } from 'idb'
import { ProjectConfig } from '@/types'

const STORE_NAME = 'projects'

export const getDb = async () => {
	return await openDB('video-project', 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME)
			}
		},
	})
}

export const saveProjectConfig = async (config: ProjectConfig) => {
	const db = await getDb()
	await db.put(STORE_NAME, config)
}
