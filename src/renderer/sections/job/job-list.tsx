import type { IJobItem } from "../../types/job";

import { useCallback } from "react";

import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import { paths } from "../../routes/paths";

import { ScrapingTemplateItem } from "./job-item";
import { ScrapingTemplateRow } from "../../../main/types/scraping/scraping-template";
// ----------------------------------------------------------------------

type Props = {
  // jobs: IJobItem[];
  scrapingTemplates: ScrapingTemplateRow[];
};

export function ScrapingTemplateList({ scrapingTemplates }: Props) {
  const handleDelete = useCallback((id: string) => {
    console.info("DELETE", id);
  }, []);

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {scrapingTemplates.map((scrapingTemplate) => (
          <ScrapingTemplateItem
            key={scrapingTemplate.id}
            scrapingTemplate={scrapingTemplate}
            editHref={paths.dashboard.job.edit(scrapingTemplate.id)}
            detailsHref={paths.dashboard.job.details(scrapingTemplate.id)}
            onDelete={() => handleDelete(scrapingTemplate.id)}
          />
        ))}
      </Box>

      {scrapingTemplates.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: "center" },
          }}
        />
      )}
    </>
  );
}
