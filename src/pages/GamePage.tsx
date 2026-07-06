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
    updatedAt: string;
    game: { name: string; slug: string };
    author: { id: string; profile: { gamertag: string } };
};

type Game = {
    id: string;
    name: string;
    slug: string;
    genre: string | null;
    description: string | null;
    createdAt: string;
    posts: Post[];

};


function GamePage(){
    const { slug } = useParams<{ slug: string }>();

    const { data: game, isLoading, isError, error } = useQuery({
        queryKey: ['game', slug],
        queryFn: async () => {
            const response = await api.get(`/api/games/${slug}`);
            return response.data as Game;
        }
    });

    if (isLoading) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Loading...</div>;
    if (isError || !game) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Game not found.</div>;

    return (
        <div className="max-w-2xl mx-auto my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-6">
            {/* Game Info Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{game.name}</h1>
                    <span className="px-2.5 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                    {game.genre}
                    </span>
                </div>
                <p className="text-sm text-slate-300">{game.description}</p>
            </div>

            {/* Posts Section */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                <h2 className="text-lg font-semibold text-slate-200">Posts ({game.posts.length})</h2>
            
                {game.posts.map((post) => (
                    <article key={post.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
                        {/* Post Header */}
                        <div className="flex justify-between items-start text-xs text-slate-400">
                            <span>u/{post.author.profile.gamertag}</span>
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{post.type}</span>
                                {post.isSpoiler && <span className="px-2 py-0.5 bg-red-900 rounded text-red-300">Spoiler</span>}
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="space-y-1">
                            <h3 className="font-bold text-white text-base">{post.title}</h3>
                            <p className="text-sm text-slate-300">{post.body}</p>
                        </div>

                        {/* Post Footer */}
                        <div className="text-[11px] text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default GamePage
