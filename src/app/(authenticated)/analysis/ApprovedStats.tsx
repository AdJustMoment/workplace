import { useVideos } from "@/hooks/apis/use.videos";

type ApprovedStatsProps = {
  tagId: number | null;
};

export default function ApprovedStats({ tagId }: ApprovedStatsProps) {
  const { data: allVideos = { total: 0 } } = useVideos({
    valid: true,
    tagId,
  });

  const { data: tenMinutesVideos = { total: 0 } } = useVideos({
    valid: true,
    tagId,
    lengthSecFrom: 0,
    lengthSecTo: 600,
  });

  const { data: twentyMinutesVideos = { total: 0 } } = useVideos({
    valid: true,
    tagId,
    lengthSecFrom: 601,
    lengthSecTo: 1200,
  });

  const { data: thirtyMinutesVideos = { total: 0 } } = useVideos({
    valid: true,
    tagId,
    lengthSecFrom: 1201,
    lengthSecTo: 1800,
  });

  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">Approved Videos</div>
        <div className="stat-value">{allVideos.total}</div>
        <div className="stat-desc">All durations</div>
      </div>

      <div className="stat">
        <div className="stat-title">Approved Videos</div>
        <div className="stat-value">{tenMinutesVideos.total}</div>
        <div className="stat-desc">0-10 minutes</div>
      </div>

      <div className="stat">
        <div className="stat-title">Approved Videos</div>
        <div className="stat-value">{twentyMinutesVideos.total}</div>
        <div className="stat-desc">10-20 minutes</div>
      </div>

      <div className="stat">
        <div className="stat-title">Approved Videos</div>
        <div className="stat-value">{thirtyMinutesVideos.total}</div>
        <div className="stat-desc">20+ minutes</div>
      </div>
    </div>
  );
}
