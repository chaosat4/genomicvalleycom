import { use } from "react";
import QuotationForm from "@/components/QuotationForm";

// Server Component
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <QuotationForm id={resolvedParams.id} />;
}
