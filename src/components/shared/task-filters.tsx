import SearchInput from "@/components/shared/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/constants/enums";
import { useTaskFilterStore } from "@/stores/task-filter-store";
import { Priority, Status } from "@/types/task";

const TaskFilters = () => {
  const {
    search,
    status,
    priority,
    setSearch,
    setStatus,
    setPriority,
  } = useTaskFilterStore();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search tasks..."
        className="w-full sm:w-72"
      />
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        <Tabs
          value={status}
          onValueChange={(v) => setStatus(v.value as Status | "ALL")}
        >
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            {Object.values(Status).map((s) => (
              <TabsTrigger key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs
          value={priority}
          onValueChange={(v) => setPriority(v.value as Priority | "ALL")}
        >
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            {Object.values(Priority).map((p) => (
              <TabsTrigger key={p} value={p}>
                {PRIORITY_CONFIG[p].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskFilters;
