import { useQuery } from "@tanstack/react-query"
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

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

type Profile = {
    id: string;
    gamertag: string;
    bio: string;
    avatarUrl: string;
    createdAt: string;
    user: {
        posts: Post[];
    };
};


function Profile(){
    const { username } = useParams();
    const navigate = useNavigate();
    const { data: profile, isLoading, isError, error } = useQuery({
        queryKey: ['profile', username],
        queryFn: async () => {
            const response = await api.get(`/api/users/${username}`);
            return response.data as Profile;
        }
    });
    if (isLoading) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Loading...</div>;
    if (isError || !profile) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Profile not found.</div>;

    return (
        <div className="max-w-2xl mx-auto my-6 p-6 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-6">
            {/* Profile Header Block */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">@{profile.gamertag}</h1>
                </div>
                <p className="text-sm text-slate-400">Bio: {profile.bio ?? "None"}</p>
                {profile.avatarUrl 
                    ? <img src={profile.avatarUrl} className="w-16 h-16 rounded-full" alt="avatar" />
                    : <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-cyan-400">{profile.gamertag[0].toUpperCase()}</div>
                }
                <div className="text-xs text-slate-500">
                    <span>Joined: {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* User's Posts Feed */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                <h2 className="text-lg font-semibold text-slate-200">
                    User Posts ({profile.user.posts.length})
                </h2>
            
                {profile.user.posts.map((post) => (
                    <article key={post.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                        {/* Post Header */}
                        <div className="flex justify-between items-start text-xs text-slate-400">
                            <div>
                                <span>Game: <strong className="font-bold text-cyan-400 hover:underline" onClick={(e) => {e.stopPropagation(); navigate(`/game/${post.game.slug}`);}}>
                                    {post.game.name}
                                </strong></span>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{post.type}</span>
                            </div>
                        </div>

                        {/* Post Title */}
                        <div>
                            <h3 className="font-bold text-white text-base">{post.title}</h3>
                        </div>

                        {/* Post Footer */}
                        <div className="text-[11px] text-slate-500 flex gap-4">
                            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Profile