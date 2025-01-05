import { Pager } from "@freee_jp/vibes";
import { useState, useEffect } from "react";

interface PageSelectionProps {
  pageMeta: PageMeta | null;
  handlePageChange: (page: number) => void;
}

interface PageMeta {
  current_page: number;
  next_page: number;
  total_pages: number;
  total_count: number;
}

function PageSelection({ pageMeta, handlePageChange }: PageSelectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (pageMeta) {
      setCurrentPage(pageMeta.current_page);
      setPageCount(pageMeta.total_pages);
    }
  }, [pageMeta]);

  return (
    <div id="pager">
      <Pager
        disabled={pageCount > 0 ? false : true}
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={(page) => {
          handlePageChange(page);
          setCurrentPage(page);
        }}
      />
    </div>
  );
}

export default PageSelection;
