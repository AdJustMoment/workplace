"use client";

import {
  useQueryVideo,
  useTasks,
  useQueryKeywords,
} from "@/hooks/apis/use.tasks";
import { TaskStatus, Task } from "@/services/task.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useTags } from "@/hooks/apis/use.tags";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

const queryVideoSchema = z.object({
  tagId: z.string().min(1, "Tag ID is required"),
  queryKeywordId: z.string().min(1, "Query keyword ID is required"),
});

type QueryVideoForm = z.infer<typeof queryVideoSchema>;

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.DONE]: "bg-success",
  [TaskStatus.PROCESSING]: "bg-warning",
  [TaskStatus.NOT_STARTED]: "bg-base-300",
  [TaskStatus.FAILED]: "bg-error",
};

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${statusColors[info.getValue()]}`}
        />
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("taskTag", {
    header: "Task Tag",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => format(new Date(info.getValue()), "PPpp"),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => format(new Date(info.getValue()), "PPpp"),
  }),
  columnHelper.display({
    id: "expand",
    header: () => null,
    cell: ({ row }) => (
      <ChevronDown
        className={`h-4 w-4 transition-transform ${
          row.getIsExpanded() ? "rotate-180" : ""
        }`}
      />
    ),
  }),
];

export default function TasksPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const { data: tasksData = { tasks: [], total: 0 }, refetch } = useTasks({
    limit: pageSize,
    skip: pageIndex * pageSize,
  });

  const { data: tagsData } = useTags();
  const form = useForm<QueryVideoForm>({
    resolver: zodResolver(queryVideoSchema),
    defaultValues: {
      tagId: "",
      queryKeywordId: "",
    },
  });

  const selectedTagId = form.watch("tagId");
  const selectedQueryKeywordId = form.watch("queryKeywordId");
  const { data: keywordsData } = useQueryKeywords(selectedTagId);

  const { mutate: queryVideo } = useQueryVideo();

  const table = useReactTable({
    data: tasksData.tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(tasksData.total / pageSize),
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

  const closeDialog = () => {
    const dialog = document.getElementById(
      "add-task-modal"
    ) as HTMLDialogElement;
    dialog?.close();
  };

  const onSubmit = async (data: QueryVideoForm) => {
    queryVideo(
      {
        tagId: parseInt(data.tagId),
        queryKeywordId: data.queryKeywordId,
      },
      {
        onSuccess: () => {
          closeDialog();
          form.reset();
          toast.success("Query task created");
          refetch();
        },
        onError: () => {
          toast.error("Failed to create query task");
        },
      }
    );
  };

  const onRefresh = () => {
    refetch();
    toast.success("Tasks refreshed");
  };

  const toggleTask = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex gap-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              const dialog = document.getElementById(
                "add-task-modal"
              ) as HTMLDialogElement;
              dialog?.showModal();
            }}
          >
            Add Query Task
          </button>
          <button className="btn btn-outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => toggleTask(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {expandedTaskId === row.original.id && (
                  <tr>
                    <td colSpan={6} className="bg-base-200">
                      <div className="p-4">
                        <p className="text-base-content/80">
                          {row.original.description ||
                            "No description provided."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
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

      <dialog id="add-task-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add Query Task</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Tag</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...form.register("tagId")}
              >
                <option value="">Select a tag</option>
                {tagsData?.tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.tagId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {form.formState.errors.tagId.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Query Keyword</span>
              </label>
              <select
                className="select select-bordered w-full"
                {...form.register("queryKeywordId")}
                disabled={!selectedTagId}
              >
                <option value="">Select a keyword</option>
                {keywordsData?.keywords.map((keyword) => (
                  <option key={keyword.id} value={keyword.id}>
                    {keyword.keyword}
                  </option>
                ))}
              </select>
              {form.formState.errors.queryKeywordId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {form.formState.errors.queryKeywordId.message}
                  </span>
                </label>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const dialog = document.getElementById(
                    "add-task-modal"
                  ) as HTMLDialogElement;
                  dialog?.close();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedTagId || !selectedQueryKeywordId}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
