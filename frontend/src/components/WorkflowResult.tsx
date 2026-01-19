import { useState } from "react";

interface WorkflowResultProps {
    result: any;
}

export function WorkflowResult({ result }: WorkflowResultProps) {
    const [showJson, setShowJson] = useState(false);
    const [copied, setCopied] = useState(false);

    // Helper to copy JSON to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Helper to render readable content
    const renderReadable = (data: any) => {
        if (Array.isArray(data)) {
            if (data.length === 0) return <p className="text-gray-500 italic">Empty list</p>;
            return (
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="border border-slate-200 rounded-md p-3 bg-slate-50">
                            <div className="text-xs font-semibold text-slate-400 mb-1">Item {index + 1}</div>
                            {renderReadable(item)}
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof data === "object" && data !== null) {
            return (
                <div className="grid grid-cols-1 gap-2">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                            <span className="text-sm font-medium text-slate-700 min-w-[120px]">{key}:</span>
                            <div className="text-sm text-slate-600 break-words flex-1">
                                {typeof value === 'object' ? renderReadable(value) : String(value)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return <span>{String(data)}</span>;
    };

    // Specific rendering for Matches
    const renderMatches = (matches: any[]) => (
        <div className="space-y-3">
            {matches.map((match: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="flex-1 text-right font-medium text-slate-700">{match.home_team}</div>
                    <div className="mx-4 flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-100 rounded text-lg font-bold text-slate-900 leading-none">
                            {match.home_score} - {match.away_score}
                        </span>
                    </div>
                    <div className="flex-1 text-left font-medium text-slate-700">{match.away_team}</div>
                    <div className="ml-4 text-[10px] text-slate-400 uppercase font-semibold w-16 text-right">
                        {match.match_date}
                    </div>
                </div>
            ))}
        </div>
    );

    // Specific rendering for Standings
    const renderStandings = (standings: any) => {
        const table = standings.total || standings;
        if (!Array.isArray(table)) return renderReadable(standings);

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Pos</th>
                            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Team</th>
                            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">P</th>
                            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">W</th>
                            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">D</th>
                            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">L</th>
                            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {table.slice(0, 20).map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2 text-sm text-slate-500 font-medium">{row.standing_place || row.position}</td>
                                <td className="px-3 py-2 text-sm font-semibold text-slate-900">{row.standing_team || row.team_name}</td>
                                <td className="px-3 py-2 text-sm text-center text-slate-600">{row.standing_P || row.played}</td>
                                <td className="px-3 py-2 text-sm text-center text-green-600 font-medium">{row.standing_W || row.won}</td>
                                <td className="px-3 py-2 text-sm text-center text-slate-600">{row.standing_D || row.draw}</td>
                                <td className="px-3 py-2 text-sm text-center text-red-600">{row.standing_L || row.lost}</td>
                                <td className="px-3 py-2 text-sm text-center font-bold text-blue-600">{row.standing_PTS || row.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Specific rendering for Top Scorers
    const renderScorers = (scorers: any[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scorers.slice(0, 10).map((s: any, i: number) => (
                <div key={i} className="flex items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold mr-3 shrink-0">
                        {s.player_place || i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{s.player_name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{s.team_name}</div>
                    </div>
                    <div className="text-sm font-black text-blue-600 ml-2">
                        {s.goals} G
                    </div>
                </div>
            ))}
        </div>
    );

    // Specific rendering for Videos
    const renderVideos = (videos: any[]) => (
        <div className="space-y-3">
            {videos.map((v: any, i: number) => (
                <a
                    key={i}
                    href={v.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group"
                >
                    <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center shrink-0">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {v.video_title}
                        </div>
                        <div className="text-[10px] text-slate-500">Watch Highlights</div>
                    </div>
                </a>
            ))}
        </div>
    );

    // Specific rendering for Team Details
    const renderTeamDetails = (team: any) => (
        <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                {team.team_logo && (
                    <img src={team.team_logo} alt={team.team_name} className="w-20 h-20 object-contain p-2 bg-white rounded-xl shadow-sm border border-slate-100" />
                )}
                <div>
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{team.team_name}</h4>
                    <p className="text-sm text-slate-500 font-medium">Coach: <span className="text-slate-700">{team.coaches?.[0]?.coach_name || "Unknown"}</span></p>
                </div>
            </div>

            <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Principal Roster</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {team.players?.slice(0, 15).map((p: any, i: number) => (
                        <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100">
                            <div className="text-[11px] font-bold text-slate-800 line-clamp-1">{p.player_name}</div>
                            <div className="text-[9px] text-slate-400 uppercase font-semibold">{p.player_type}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Main result dispatcher
    const renderData = (data: any) => {
        if (!data) return null;
        if (data.type === "match_info" || data.type === "h2h") return renderMatches(data.matches || []);
        if (data.type === "standings") return renderStandings(data.standings || {});
        if (data.type === "topscorers") return renderScorers(data.scorers || []);
        if (data.type === "videos") return renderVideos(data.videos || []);
        if (data.type === "team_info") return renderTeamDetails(data.team_details || {});

        return renderReadable(data);
    };

    return (
        <div className="rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-200/60">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Match Center Analytics</h3>
                </div>
                <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button
                        onClick={() => setShowJson(false)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${!showJson ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        PREMIUM VIEW
                    </button>
                    <button
                        onClick={() => setShowJson(true)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${showJson ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        RAW JSON
                    </button>
                </div>
            </div>

            <div className="p-6 max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {showJson ? (
                    <div className="relative group rounded-xl bg-slate-900 p-4">
                        <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 px-3 py-1.5 text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg shadow-sm backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                        >
                            {copied ? "COPIED ✅" : "COPY DATA"}
                        </button>
                        <pre className="text-xs font-mono text-blue-400 whitespace-pre-wrap break-all leading-relaxed">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {renderData(result)}
                    </div>
                )}
            </div>
        </div>
    );
}
