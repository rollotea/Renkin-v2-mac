import { Helmet } from "react-helmet-async";

import { useParams } from "../../../routes/hooks";

import { CONFIG } from "../../../global-config";
import { useGetProduct } from "../../../actions/product";

import { ProductEditView } from "../../../sections/product/view";

// ----------------------------------------------------------------------

const metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = "" } = useParams();

  const { product } = useGetProduct(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView product={product} />
    </>
  );
}
