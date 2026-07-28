import type { TPagination } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { useIsMobile } from "@/hooks/use-mobile";
import { Inbox } from "lucide-react";

export interface DataTableColumn<T> {
  header: string;
  accessor: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  pagination?: TPagination;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  renderCard?: (item: T, index: number) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

function DataTable<T extends object>({
  columns,
  data,
  pagination,
  isLoading,
  onPageChange,
  renderCard,
  emptyTitle = "No results",
  emptyDescription = "No data available.",
}: DataTableProps<T>) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <Empty className="border border-dashed py-12">
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </Empty>
    );
  }

  const totalPages = pagination?.totalPage ?? 1;
  const currentPage = pagination?.page ?? 1;
  const total = pagination?.total ?? data.length;
  const limit = pagination?.limit ?? 10;
  const endIndex = Math.min(currentPage * limit, total);

  return (
    <div className="w-full space-y-4">
      {isMobile && renderCard ? (
        <div className="space-y-4">
          {data.map((row, index) => renderCard(row, index))}
        </div>
      ) : (
        <div className="rounded-none border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                {columns.map((column) => (
                  <TableHead
                    key={String(column.accessor)}
                    className={`${column.className || ""} whitespace-nowrap`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => {
                    const value = row[column.accessor];
                    return (
                      <TableCell
                        key={String(column.accessor)}
                        className={column.className}
                      >
                        {column.cell
                          ? column.cell(value, row)
                          : String(value ?? "")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-muted/30 rounded-lg border border-border">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            <div className="hidden sm:block">
              Page {currentPage} of {totalPages} &bull; Showing{" "}
              {endIndex} of {total} items
            </div>
            <div className="sm:hidden">
              {currentPage} / {totalPages}
            </div>
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="gap-1 text-xs h-8 px-2 sm:h-9 sm:px-3 sm:gap-2"
            >
              <span className="text-lg sm:text-base">&larr;</span>
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="gap-1 text-xs h-8 px-2 sm:h-9 sm:px-3 sm:gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="text-lg sm:text-base">&rarr;</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
