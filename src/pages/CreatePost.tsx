import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation} from "@tanstack/react-query"
import api from '../lib/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Define the shape of our submitted post payload
interface PostData {
  title: string;
  body: string;
  gameId: string;  // not game
  type: 'DISCUSSION' | 'CLIP' | 'REVIEW' | 'GUIDE' | 'MEME';  // not postType
  isSpoiler: boolean;
}

interface Game {
  id: string;
  name: string;
  slug: string;
  genre?: string | null;
  coverUrl?: string | null;
  description?: string | null;
  createdAt: Date | string;
}

function CreatePost() {
    const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('');
	
	const { data, isLoading, isError, error } = useQuery({
	  	queryKey: ['games'],
	  	queryFn: async () => {
			const response = await api.get('/api/games');
		  	return response.data as Game[];
		}
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(''); // Reset error message on new submission
		// Create FormData instance using the form element target
		const formData = new FormData(event.currentTarget);
		
		// Safely extract values and handle potential null values with fallbacks
		const postPayload: PostData = {
			title: (formData.get('title') as string) || '',
			body: (formData.get('body') as string) || '',
			gameId: (formData.get('game') as string) || '',
			type: (formData.get('type') as PostData['type']) || 'DISCUSSION',
			isSpoiler: formData.get('isSpoiler') === 'on', // Evaluates to true if checked
		};

        createPostMutation.mutate(postPayload);
		// Log typed data payload
	};

	const createPostMutation = useMutation({
		mutationFn: async (payload: PostData) => {
            const response = await api.post('/api/posts', payload);
            return response.data;
        },
        onSuccess: () => {
            navigate('/', { state: { message: 'Post created successfully!' } });
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.errorMessage || 'Failed to create post. Please try again.');
                return;
            }
            setErrorMessage('Failed to create post. Please try again.');
        }
	});

	if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error.message}</div>

	return (
		<div className="max-w-xl mx-auto mt-10 p-6 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800">
			<h2 className="text-xl font-bold mb-6 text-indigo-400">Create New Post</h2>
			
			<form onSubmit={handleSubmit} className="space-y-5">
				<label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
					Title
				</label>
				<input
					type="text"
					id="title"	
					placeholder="Enter post title"
					name="title"
					required
					className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
				/>
				{/* Game Selector */}
				<div>
					<label htmlFor="game" className="block text-sm font-medium text-slate-300 mb-1">
						Select Game
					</label>
					<select
						id="game"
						name="game"
						required
						className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						<option value="">-- Choose a game --</option>
						{data?.map((game) => (
							<option key={game.id} value={game.id}>
								{game.name}
							</option>
						))}
					</select>
				</div>

				{/* Post Type Selector */}
				<div>
					<label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">
						Post Type
					</label>
					<select
						id="type"
						name="type"
						required
						className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						<option value="DISCUSSION">DISCUSSION</option>
						<option value="CLIP">CLIP</option>
						<option value="REVIEW">REVIEW</option>
						<option value="GUIDE">GUIDE</option>
						<option value="MEME">MEME</option>
					</select>
				</div>

				{/* Body Textarea */}
				<div>
					<label htmlFor="body" className="block text-sm font-medium text-slate-300 mb-1">
						Body Content
					</label>
					<textarea
						id="body"
						name="body"
						rows={5}
						required
						placeholder="What's on your mind?..."
						className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
					/>
				</div>

				{/* Spoiler Toggle Checkbox */}
				<div className="flex items-center">
					<input
						id="isSpoiler"
						name="isSpoiler"
						type="checkbox"
						className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
					/>
					<label htmlFor="isSpoiler" className="ml-2 block text-sm text-slate-300 select-none">
						Mark as Spoiler
					</label>
				</div>

                {errorMessage ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{errorMessage}</p> : null}
				
				{/* Submit Button */}
				<button
					type="submit"
					className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
					>
					Submit Post
				</button>
			</form>
		</div>
	);
}

export default CreatePost;