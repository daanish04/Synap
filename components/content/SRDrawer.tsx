"use client";

import React, { useEffect, useState } from "react";
import { SR } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import {
  getSRForContent,
  enableSRForContent,
  disableSRForContent,
  submitSRReview,
} from "@/actions/srActions";

const SRDrawer = ({
  contentId,
  initialState,
}: {
  contentId: string;
  initialState: SR | null;
}) => {
  const [srLoading, setSrLoading] = useState(false);
  const [srEnabled, setSrEnabled] = useState(false);
  const [srInitialEnabled, setSrInitialEnabled] = useState(false);
  const [srState, setSrState] = useState<SR | null>(initialState || null);

  useEffect(() => {
    setSrEnabled(!!(initialState && initialState.enabled));
    setSrInitialEnabled(!!(initialState && initialState.enabled));
    setSrState(initialState || null);
  }, [initialState]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" variant="outline" className="text-md cursor-pointer">
          Spaced Repetition
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full mx-auto max-w-md">
          <DrawerHeader>
            <DrawerTitle>Spaced Repetition</DrawerTitle>
            <DrawerDescription>
              Set if you would want to keep this content in your mind- Forever.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-row px-10 gap-2 justify-between items-center">
            <span>Want it enabled?</span>
            <Switch
              checked={srEnabled}
              onCheckedChange={(v) => setSrEnabled(!!v)}
              disabled={srLoading}
            />
          </div>
          <Separator className="my-4" />

          {srState?.enabled ? (
            <div className="flex flex-col gap-3">
              <div
                className={`text-center ${
                  srState?.isDueToday ? "text-red-600 font-semibold" : ""
                }`}
              >
                Next Review Date:{" "}
                {srState?.nextReviewFormatted || "Not scheduled"}
              </div>
              {srState?.isDueToday && (
                <>
                  <div className="text-center">Your review is due:</div>
                  <div className="grid sm:grid-cols-5 grid-cols-6">
                    {[0, 1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        className="sm:col-span-1 col-span-3 flex flex-col gap-1 text-center py-1 px-3 border hover:scale-105 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                        onClick={async () => {
                          setSrLoading(true);
                          const res = await submitSRReview(contentId, score);
                          setSrLoading(false);
                          if (!res?.success)
                            return toast.error(res?.error || "Failed");
                          toast.success("Review submitted");
                          if (res.data) {
                            setSrState({
                              interval: res.data.interval ?? 1,
                              easeFactor: res.data.easeFactor ?? 2.5,
                              repetitions: res.data.repetitions ?? 0,
                              nextReview: res.data.nextReview ?? null,
                              nextReviewFormatted:
                                res.data.nextReviewFormatted ?? null,
                              isDueToday: false,
                              enabled: true,
                            });
                          }
                        }}
                      >
                        {score === 0
                          ? "FORGOT"
                          : score === 1
                          ? "HARD"
                          : score === 2
                          ? "GOOD"
                          : score === 3
                          ? "EASY"
                          : "VERY EASY"}
                        <span className="text-xs text-muted-foreground">
                          {score === 0
                            ? "Completely forgot"
                            : score === 1
                            ? "Remembered with difficulty"
                            : score === 2
                            ? "Remembered with some effort"
                            : score === 3
                            ? "Remembered easily"
                            : "Too Easy"}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-10">
              <div className="text-sm text-muted-foreground text-center">
                Spaced Repetition is disabled for this content.
              </div>
            </div>
          )}

          <DrawerFooter>
            <DrawerClose asChild>
              <div className="flex flex-col gap-1">
                <Button
                  disabled={srLoading || srEnabled === srInitialEnabled}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={async () => {
                    setSrLoading(true);
                    try {
                      if (srEnabled && !srInitialEnabled) {
                        const res = await enableSRForContent(contentId);
                        if (!res?.success)
                          throw new Error(res?.error || "Failed to enable");
                        const refreshed = await getSRForContent(contentId);
                        if (
                          refreshed?.success &&
                          refreshed.data &&
                          refreshed.data.enabled
                        ) {
                          const d = refreshed.data;
                          setSrInitialEnabled(true);
                          setSrState({
                            interval: d.interval ?? 1,
                            easeFactor: d.easeFactor ?? 2.5,
                            repetitions: d.repetitions ?? 0,
                            nextReview: d.nextReview ?? null,
                            nextReviewFormatted: d.nextReviewFormatted ?? null,
                            isDueToday: !!d.isDueToday,
                            enabled: true,
                          });
                        }
                        toast.success("Enabled spaced repetition");
                      } else if (!srEnabled && srInitialEnabled) {
                        const res = await disableSRForContent(contentId);
                        if (!res?.success)
                          throw new Error(res?.error || "Failed to disable");
                        setSrInitialEnabled(false);
                        setSrState(null);
                        toast.success("Disabled spaced repetition");
                      } else {
                        toast.success("Saved");
                      }
                    } catch (e) {
                      toast.error((e as Error).message);
                      setSrEnabled(srInitialEnabled);
                    } finally {
                      setSrLoading(false);
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="outline" className="cursor-pointer">
                  Close
                </Button>
              </div>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SRDrawer;
