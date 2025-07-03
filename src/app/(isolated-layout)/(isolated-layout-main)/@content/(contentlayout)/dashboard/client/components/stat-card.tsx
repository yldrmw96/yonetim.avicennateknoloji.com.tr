"use client";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRightIcon } from "lucide-react";
import AnimatedNumber from "@/components/global/animated-number";

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";
export function StatCard({
  title,
  value,
  icon,
  actionLabel = null,
  action,
  isLoading = true,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  actionLabel?: React.ReactNode;
  action?: React.ReactNode;
  isLoading?: boolean;
}) {

  return (
    <div className="relative border-b border-t relative rounded-[0.72rem] ">
      <Card className="!shadow-xs after:absolute after:content after:inset-0 after:pointer-events-none after:rounded-lg after:shadow-highlight bg-card border border-b-0 border-t-0 flex flex-col gap-0 overflow-hidden  relative rounded-md shadow-highlight shadow-sm text-card-foreground  dark:from-zinc-800">
        <CardHeader>
          <CardTitle className="flex  items-center justify-between [&>svg]:text-4xl [&>svg]:fill-blue-400 [&>svg]:rounded-lg">
            {isLoading ? (
              <Skeleton className="w-1/2 h-[1em]" />
            ) : (
              <p className="text-2xl font-bold font-[family-name:var(--font-nunito)]">
                <AnimatedNumber value={isLoading ? 0 : Number(value)} />
              </p>
            )}
            {isLoading ? (
              <Skeleton className="w-[1.5em] rounded-[0.6rem] h-[1.5em]" />
            ) : (
              <span className=" font-mono text-3xl rounded-2xl text-primary
          ">
                {icon}
              </span>
            )}


          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          {isLoading ? (
            <Skeleton className="w-1/4 h-[1em]" />
          ) : (
            <span className="opacity-50 font-medium text-sm">{title}</span>
          )}
        </CardFooter>
        {actionLabel && (
          <>
            <Separator className="my-2" />
            <CardFooter className="flex items-center justify-start gap-2 ">
              <div className="flex items-center justify-start gap-2 w-full text-sm">
                {isLoading ? (
                  <Skeleton className="w-1/4 h-[1em]" />
                ) : (
                  actionLabel
                )}
                {
                  !isLoading ?
                    (<ChevronRightIcon width={"1em"} height={"1em"} />)
                    : (<Skeleton className="w-[1em] rounded-[0.36rem] h-[1em]" />)
                }

              </div>
            </CardFooter>
          </>
        )}

      </Card>
    </div>
  );
}
