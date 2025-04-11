import type { IProductItem } from "../../../types/product";

import { paths } from "../../../routes/paths";

import { DashboardContent } from "../../../layouts/dashboard";

import { CustomBreadcrumbs } from "../../../components/custom-breadcrumbs";

import { ProductNewEditForm } from "../product-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  product?: IProductItem;
};

export function ProductEditView({ product }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.product.root}
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Product", href: paths.dashboard.product.root },
          { name: product?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm currentProduct={product} />
    </DashboardContent>
  );
}
