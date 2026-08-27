import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex justify-end items-center space-x-4 mt-6">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Sebelumnya
      </Button>
      <span className="text-sm font-medium text-slate-600">
        Halaman {currentPage} dari {lastPage}
      </span>
      <Button
        variant="outline"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Selanjutnya
      </Button>
    </div>
  );
}
