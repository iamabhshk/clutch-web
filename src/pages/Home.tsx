import { useQuery} from "@tanstack/react-query"
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

function Home(){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await api.get('/api/posts');
            return response.data as Post[];
        }
    })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error.message}</div>
    console.log(data)

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-2xl mx-auto space-y-2 p-4">
                {data?.map((post: Post) => {
                    const timeAgo = post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : '';

                    return (
                        <article
                            key={post.id}
                            className="flex border border-slate-700 rounded bg-slate-900 hover:border-slate-500 transition-colors duration-150 cursor-pointer"
                        >
                            <p className="text-slate-400 p-3">Voting placeholder</p>

                            <div className="flex-1 p-3 flex flex-col justify-between">

                                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mb-1">
                                    {post.game?.slug && (
                                        <span className="font-bold text-cyan-400 hover:underline">
                                            {post.game.name}
                                        </span>
                                    )}
                                    <span>•</span>
                                    <span>Posted by</span>
                                    <span className="hover:underline text-slate-300">
                                        u/{post.author?.profile?.gamertag || 'anonymous'}
                                    </span>
                                    <span className="text-slate-500">{timeAgo}</span>

                                    {post.type && (
                                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-slate-700 text-slate-300 rounded border border-slate-600 uppercase tracking-wide">
                                            {post.type}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-start gap-2 mb-2">
                                    {post.isSpoiler && (
                                        <span className="shrink-0 px-1 py-0.5 text-[10px] font-bold tracking-wide text-red-400 border border-red-500 rounded uppercase">
                                            Spoiler
                                        </span>
                                    )}
                                    <h2 className="text-lg font-medium text-slate-100 leading-snug">
                                        {post.title}
                                    </h2>
                                </div>

                                <div className="text-sm text-slate-300 mb-3 leading-relaxed">
                                    {post.body}
                                </div>

                                <p className="text-slate-500 text-xs">Reactions Placeholder</p>

                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default Home