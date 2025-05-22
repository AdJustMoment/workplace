import { Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUpdateVideosStatus } from "@/hooks/apis/use.validate.videos";
import { useVideos } from "@/hooks/apis/use.videos";
import { Video } from "@/services/video.service";
import { Row } from "@tanstack/react-table";

export function ActionsCell({ row }: { row: Row<Video> }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateVideosStatus, isPending } = useUpdateVideosStatus();
  const { refetch } = useVideos({
    limit: 10,
    skip: 0,
    valid: true,
    tagId: null,
  });

  const handleRemove = () => {
    updateVideosStatus(
      {
        videos: [row.original],
        valid: false,
      },
      {
        onSuccess: () => {
          toast.success("Video removed successfully");
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to remove video");
        },
      }
    );
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {isOpen && (
        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
          <li>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-base-200"
              onClick={() => {
                setIsOpen(false);
                handleRemove();
              }}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
