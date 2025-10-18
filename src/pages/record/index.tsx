import { Banner, Paragraph, TextInput, Title } from '@/components'
import { useEffect, useRef, useState } from 'react'

export default function Record() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const recordedChunksRef = useRef<Blob[]>([])

	const [recording, setRecording] = useState(false)
	const [formData, setFormData] = useState({ name: '' })
	const [status, setStatus] = useState<'success' | 'error' | null>(null)

	useEffect(() => {
		if (status) {
			const timer = setTimeout(() => setStatus(null), 2000)
			return () => clearTimeout(timer)
		}
	}, [status])

	const startRecording = () => {
		setStatus(null)

		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					aspectRatio: { ideal: 1.777 },
				},
				audio: {
					sampleRate: 44100,
					channelCount: 2,
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false,
				},
			})
			.then((rawStream) => {
				const audioContext = new AudioContext()
				const audioSource = audioContext.createMediaStreamSource(rawStream)
				const audioDestination = audioContext.createMediaStreamDestination()

				// Route the audio through the Web Audio API
				audioSource.connect(audioDestination)

				// Combine video + processed audio
				const finalStream = new MediaStream([
					...rawStream.getVideoTracks(),
					...audioDestination.stream.getAudioTracks(),
				])

				if (videoRef.current) {
					videoRef.current.srcObject = finalStream
					videoRef.current.play()
				}

				mediaRecorderRef.current = new MediaRecorder(finalStream)
				recordedChunksRef.current = []

				mediaRecorderRef.current.ondataavailable = (event) => {
					if (event.data.size > 0) recordedChunksRef.current.push(event.data)
				}

				mediaRecorderRef.current.start()
				setRecording(true)
			})
			.catch((error) => {
				console.error('Error accessing media devices:', error)
				setStatus(error)
			})
	}

	const stopRecording = async () => {
		return new Promise<void>((resolve) => {
			mediaRecorderRef.current?.addEventListener('stop', async () => {
				const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
				const videoFile = new File([blob], 'recording.webm', {
					type: 'video/webm',
				})

				const form = new FormData()
				form.append('video', videoFile)
				form.append('name', formData.name)

				try {
					const res = await fetch('/save', {
						method: 'POST',
						body: form,
					})

					if (res.ok) {
						setStatus('success')
					} else {
						setStatus('error')
					}
				} catch (err) {
					setStatus('error')
				}

				recordedChunksRef.current = []
				setRecording(false)
				setFormData({ name: '' })
				resolve()
			})

			mediaRecorderRef.current?.stop()
			;(videoRef.current?.srcObject as MediaStream)
				?.getTracks()
				.forEach((track) => track.stop())
		})
	}

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10'>
			<div className='w-full max-w-3xl space-y-8'>
				<div className='text-center'>
					<Title text='Record a Story' />
					<Paragraph>
						Kindly begin by entering your name. When you feel ready, click{' '}
						<strong>Start Recording</strong>. Once your image appears, you may
						begin your tribute. When your message is complete, press{' '}
						<strong>Stop & Upload</strong> to save it.
					</Paragraph>
				</div>
				<Banner status={status} />

				<div className='w-full aspect-video bg-black rounded-xl overflow-hidden'>
					<video
						ref={videoRef}
						className='w-full h-full object-cover'
						width={1280}
						height={720}
					/>
				</div>

				<div>
					<TextInput
						value={formData.name}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							setFormData((prev) => ({ ...prev, name: event.target.value }))
						}
					/>
				</div>

				<div className='flex justify-center'>
					{!recording ? (
						<button
							onClick={startRecording}
							disabled={!formData.name.trim()}
							className={`${
								formData.name.trim()
									? 'bg-gray-800 hover:bg-gray-900'
									: 'bg-gray-400 cursor-not-allowed'
							} text-white text-lg font-medium px-8 py-4 rounded-xl transition`}
						>
							Start Recording
						</button>
					) : (
						<button
							onClick={stopRecording}
							className='bg-red-600 hover:bg-red-700 text-white text-lg font-medium px-8 py-4 rounded-xl transition'
						>
							Stop & Upload
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
