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

import { useVideos } from "@/hooks/use.videos";
import { Video, validateVideos } from "@/services/video.service";
import { useTags } from "@/hooks/use.tags";
import { Tag } from "@/services/video.service";

const columnHelper = createColumnHelper<Video>();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="checkbox checkbox-primary"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="checkbox checkbox-primary"
      />
    ),
  }),
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
    cell: (info) => {
      const minutes = Math.floor(info.getValue() / 60);
      const seconds = info.getValue() % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  }),
];

export default function Videos() {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const pageSize = 10;
  const { data = { videos: [], total: -1 }, refetch } = useVideos({
    limit: pageSize,
    skip: pageIndex * pageSize,
    valid: null,
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

  const handleValidate = async (valid: boolean) => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const ytIds = selectedRows.map((row) => row.original.ytId);
    try {
      await validateVideos(ytIds, valid);
      table.resetRowSelection();
      refetch();
    } catch (error) {
      console.error("Failed to validate videos:", error);
      // You might want to add proper error handling here
    }
  };

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
        <button
          onClick={() => handleValidate(true)}
          disabled={table.getSelectedRowModel().rows.length === 0}
          className="btn btn-success btn-sm"
        >
          Approve Selected
        </button>
        <button
          onClick={() => handleValidate(false)}
          disabled={table.getSelectedRowModel().rows.length === 0}
          className="btn btn-error btn-sm"
        >
          Reject Selected
        </button>
        <span className="text-sm text-base-content/60">
          {table.getSelectedRowModel().rows.length} videos selected
        </span>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="overflow-x-auto">
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
                    <td key={cell.id} className="max-w-[200px]">
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
