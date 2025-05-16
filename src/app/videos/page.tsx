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

const columnHelper = createColumnHelper<Video>();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
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
  const { data = { videos: [] }, refetch } = useVideos({
    limit: 10,
    skip: pageIndex * 10,
  });

  const table = useReactTable({
    data: data.videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: -1,
    state: {
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    onPaginationChange: ((updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize: 10 });
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
        <button
          onClick={() => handleValidate(true)}
          disabled={table.getSelectedRowModel().rows.length === 0}
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
        >
          Approve Selected
        </button>
        <button
          onClick={() => handleValidate(false)}
          disabled={table.getSelectedRowModel().rows.length === 0}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
        >
          Reject Selected
        </button>
        <span className="text-sm text-gray-500">
          {table.getSelectedRowModel().rows.length} videos selected
        </span>
      </div>

      <div className="rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Video>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<Video, unknown>) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row: Row<Video>) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell: Cell<Video, unknown>) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-700">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
