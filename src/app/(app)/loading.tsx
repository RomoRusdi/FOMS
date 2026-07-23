import { Loader } from "@/components/loader";

export default function Loading() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center p-6">
      <Loader />
    </div>
  );
}
