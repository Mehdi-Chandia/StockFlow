import { Package } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";

const ProductHeader = () => {
  return (
    <PageHeader
      title="Products"
      description="Manage your products catalog and pricing"
      icon={Package}
      buttonText="Add Product"
      buttonPath="/products/create"
    />
  );
};

export default ProductHeader;
