import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const fetchTotal = async () => {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) throw new Error("sever error");
  const data = await res.json();
  return data;
};

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: fetchTotal,
  });

  if (isPending) return "Loading....";

  if (error) return { "An Error occured: ": error.message };

  return (
    <>
      <Card className="w-[350px] mx-auto ">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Total Money you spent is:</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "...." : data?.total}</CardContent>
      </Card>
    </>
  );
}
