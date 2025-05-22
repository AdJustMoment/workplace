"use client";

import { useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  Header,
  HeaderGroup,
  Cell,
  PaginationState,
  OnChangeFn,
  Row,
} from "@tanstack/react-table";

import { useVideos } from "@/hooks/apis/use.videos";
import { Video } from "@/services/video.service";
import { useTags } from "@/hooks/apis/use.tags";
import { Tag } from "@/services/video.service";

import { formatTime } from "@/utils/time";
import { ActionsCell } from "@/components/ActionCell";

const columnHelper = createColumnHelper<Video>();

const columns = [
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => (
      <div className="max-w-md truncate" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("viewCount", {
    header: "Views",
    cell: (info) => info.getValue()?.toLocaleString() ?? "N/A",
  }),
  columnHelper.accessor("likeCount", {
    header: "Likes",
    cell: (info) => info.getValue()?.toLocaleString() ?? "N/A",
  }),
  columnHelper.accessor("publishedAt", {
    header: "Published",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("lengthSec", {
    header: "Duration",
    cell: (info) => formatTime(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="w-24">
        <ActionsCell row={row} />
      </div>
    ),
  }),
];

export default function RejectedVideos() {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const pageSize = 10;
  const { data = { videos: [], total: -1 } } = useVideos({
    limit: pageSize,
    skip: pageIndex * pageSize,
    valid: false,
    tagId: selectedTagId,
  });
  const { data: tagsData } = useTags();

  const table = useReactTable({
    data: data.videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(data.total / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: ((updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
      }
    }) as OnChangeFn<PaginationState>,
    manualPagination: true,
  });

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

      <div className="card bg-base-100 shadow">
        <div className="">
          <table className="table table-zebra">
            <thead>
              {table
                .getHeaderGroups()
                .map((headerGroup: HeaderGroup<Video>) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header: Header<Video, unknown>) => (
                        <th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      )
                    )}
                  </tr>
                ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row: Row<Video>) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell: Cell<Video, unknown>) => (
                    <td key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="join">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="join-item btn btn-sm"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="join-item btn btn-sm"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-base-content/80">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
