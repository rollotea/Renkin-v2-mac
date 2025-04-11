import { Helmet } from "react-helmet-async";

import { useParams } from "../../../routes/hooks";

import { CONFIG } from "../../../global-config";
import { useGetProduct } from "../../../actions/product";

import { ProductDetailsView } from "../../../sections/product/view";
import { useGetItemDetail } from "../../../actions/item-details";

// ----------------------------------------------------------------------

const metadata = { title: `Product details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  // const { product, productLoading, productError } = useGetProduct(id);
  const { product, productLoading, productError } = useGetItemDetail(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductDetailsView
        product={product}
        loading={productLoading}
        error={productError}
      />
    </>
  );
}
