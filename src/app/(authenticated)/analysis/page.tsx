"use client";

import { useState } from "react";
import { useTags } from "@/hooks/apis/use.tags";
import { Tag } from "@/services/video.service";
import ApprovedStats from "./ApprovedStats";
import PendingStats from "./PendingStats";
import RejectedStats from "./RejectedStats";

export default function AnalysisPage() {
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const { data: tagsData } = useTags();

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <select
          className="select select-bordered select-sm w-48"
          value={selectedTagId ?? ""}
          onChange={(e) =>
            setSelectedTagId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Tags</option>
          {tagsData?.tags.map((tag: Tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <ApprovedStats tagId={selectedTagId} />
        <PendingStats tagId={selectedTagId} />
        <RejectedStats tagId={selectedTagId} />
      </div>
    </div>
  );
}
