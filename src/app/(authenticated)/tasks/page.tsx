"use client";

import { useQueryVideo, useTasks } from "@/hooks/apis/use.tasks";
import { TaskStatus } from "@/services/task.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const queryVideoSchema = z.object({
  tagId: z.coerce.number().min(1, "Tag ID is required"),
  queryText: z.string().min(1, "Query text is required"),
});

type QueryVideoForm = z.infer<typeof queryVideoSchema>;

const statusColors = {
  [TaskStatus.DONE]: "bg-success",
  [TaskStatus.PROCESSING]: "bg-warning",
  [TaskStatus.NOT_STARTED]: "bg-base-300",
};

export default function TasksPage() {
  const { data: tasksData, refetch } = useTasks();

  const form = useForm<QueryVideoForm>({
    resolver: zodResolver(queryVideoSchema),
    defaultValues: {
      tagId: undefined,
      queryText: "",
    },
  });

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
            </tr>
          </thead>
          <tbody>
            {tasksData?.tasks.map((task) => (
              <tr key={task.id}>
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
              </tr>
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
                <span className="label-text">Tag ID</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                {...form.register("tagId")}
              />
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
                <span className="label-text">Query Text</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...form.register("queryText")}
              />
              {form.formState.errors.queryText && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {form.formState.errors.queryText.message}
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
              <button type="submit" className="btn btn-primary">
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
