import { useQuery } from "@tanstack/react-query"
import { useParams } from 'react-router-dom';
import api from '../lib/api';

type Post = {
    id: string;
    title: string;
    body: string;
    type: string;
    isSpoiler: boolean;
    createdAt: string;
    game: { name: string; slug: string };
    author: { id: string; profile: { gamertag: string } };
};

function PostPage(){
    const { id } = useParams<{ id: string }>();
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const response = await api.get(`/api/posts/${id}`);
            return response.data as Post;
        }
    });
    if (isLoading) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Loading...</div>;
    if (isError || !post) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Post not found.</div>;

    return (
        <div className="max-w-2xl mx-auto my-6 p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4">
            {/* Post Header Meta */}
            <div className="flex justify-between items-start text-xs text-slate-400">
                <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                    {post.type}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
                    Spoiler: {String(post.isSpoiler)}
                    </span>
                </div>
            </div>

            {/* Post Body Content */}
            <div className="space-y-1">
                <h1 className="text-xl font-bold text-white">{post.title}</h1>
                <p className="text-sm text-slate-300">{post.body}</p>
            </div>

            {/* Game Association Details */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <div>
                    <span>Game: <strong className="text-slate-300">{post.game.name}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Posted by <strong className="text-slate-300">u/{post.author.profile.gamertag}</strong></span>
                </div>
                <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="pt-4 border-t border-slate-800">
                <h2 className="text-sm font-semibold text-slate-400 mb-2">Comments</h2>
                <p className="text-xs text-slate-600">Comments coming soon.</p>
            </div>
        </div>
    );
}

export default PostPage         