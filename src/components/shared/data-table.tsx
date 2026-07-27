import type { TPagination } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Inbox } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: TPagination;
  isLoading?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  pagination,
  isLoading,
  onPaginationChange,
  emptyTitle = "No results",
  emptyDescription = "No data available.",
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    pageCount: pagination?.totalPage ?? -1,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: onPaginationChange,
    state: {
      pagination: {
        pageIndex: (pagination?.page ?? 1) - 1,
        pageSize: pagination?.limit ?? 10,
      },
    },
  });

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

  const generatePageNumbers = () => {
    if (!pagination) return [];
    const { totalPage, page } = pagination;
    const pages: (number | "ellipsis")[] = [];

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPage - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPage - 2) pages.push("ellipsis");
      pages.push(totalPage);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-none border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPage > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  table.previousPage()
                }
                className={
                  !pagination.hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {generatePageNumbers().map((pageNum, i) =>
              pageNum === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={pageNum === pagination.page}
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  table.nextPage()
                }
                className={
                  !pagination.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default DataTable;
