import { paths } from "../../../routes/paths";

import { DashboardContent } from "../../../layouts/dashboard";

import { CustomBreadcrumbs } from "../../../components/custom-breadcrumbs";

import { JobNewEditForm } from "../job-new-edit-form";

// ----------------------------------------------------------------------

export function JobCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new template"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Templates", href: paths.dashboard.job.root },
          { name: "New Template" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobNewEditForm />
    </DashboardContent>
  );
}
