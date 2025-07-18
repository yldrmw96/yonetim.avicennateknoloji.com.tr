import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="!shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}  
      </CardContent>
    </Card>
  );
}
