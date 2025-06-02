"use client";

import {
  useQueryVideo,
  useTasks,
  useQueryKeywords,
} from "@/hooks/apis/use.tasks";
import { TaskStatus } from "@/services/task.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useTags } from "@/hooks/apis/use.tags";
import { useState } from "react";

const queryVideoSchema = z.object({
  tagId: z.coerce.number().min(1, "Tag ID is required"),
  queryKeywordId: z.string().min(1, "Query keyword ID is required"),
});

type QueryVideoForm = z.infer<typeof queryVideoSchema>;

const statusColors = {
  [TaskStatus.DONE]: "bg-success",
  [TaskStatus.PROCESSING]: "bg-warning",
  [TaskStatus.NOT_STARTED]: "bg-base-300",
};

export default function TasksPage() {
  const { data: tasksData, refetch } = useTasks();
  const { data: tagsData } = useTags();
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const form = useForm<QueryVideoForm>({
    resolver: zodResolver(queryVideoSchema),
    defaultValues: {
      tagId: undefined,
      queryKeywordId: "",
    },
  });

  const selectedTagId = form.watch("tagId");
  const selectedQueryKeywordId = form.watch("queryKeywordId");
  const { data: keywordsData } = useQueryKeywords(selectedTagId);

  const { mutate: queryVideo } = useQueryVideo();

  const closeDialog = () => {
    const dialog = document.getElementById(
      "add-task-modal"
    ) as HTMLDialogElement;
    dialog?.close();
  };

  const onSubmit = async (data: QueryVideoForm) => {
    queryVideo(data, {
      onSuccess: () => {
        closeDialog();
        form.reset();
        toast.success("Query task created");
        refetch();
      },
      onError: () => {
        toast.error("Failed to create query task");
      },
    });
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
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Task Tag</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasksData?.tasks.map((task) => (
              <>
                <tr
                  key={task.id}
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => toggleTask(task.id)}
                >
                  <td>{task.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${statusColors[task.status]}`}
                      />
                      {task.status}
                    </div>
                  </td>
                  <td>{task.taskTag}</td>
                  <td>{format(new Date(task.createdAt), "PPpp")}</td>
                  <td>{format(new Date(task.updatedAt), "PPpp")}</td>
                  <td>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedTaskId === task.id ? "rotate-180" : ""
                      }`}
                    />
                  </td>
                </tr>
                {expandedTaskId === task.id && (
                  <tr>
                    <td colSpan={6} className="bg-base-200">
                      <div className="p-4">
                        <p className="text-base-content/80">
                          {task.description || "No description provided."}
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
