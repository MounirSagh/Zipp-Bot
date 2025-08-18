"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Save, AlertCircle, CheckCircle, Loader2, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Admin() {
  const [infoString, setInfoString] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });
  const [infoExists, setInfoExists] = useState<boolean | null>(null);
  const [autosave, setAutosave] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);

  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const clientId = user?.id;

  const API_BASE = "https://aivo-backend.vercel.app/api";

  const { chars, words } = useMemo(() => {
    const c = infoString.length;
    const w = infoString.trim() ? infoString.trim().split(/\s+/).length : 0;
    return { chars: c, words: w };
  }, [infoString]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (type: "success" | "error", text: string) => setMessage({ type, text });

  useEffect(() => {
    if (!clientId) return;

    const fetchInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/info/${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setInfoString(data.String || "");
          setInfoExists(true);
          setDirty(false);
        } else {
          setInfoExists(false);
          setInfoString("");
        }
      } catch (err) {
        showMessage("error", "Error fetching info.");
        setInfoExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [clientId]);

  const saveInFlight = useRef(false);
  const handleSaveInfo = async () => {
    if (saveInFlight.current) return;
    if (!clientId || !infoString.trim()) {
      showMessage("error", "Client ID and info are required.");
      return;
    }

    setLoading(true);
    saveInFlight.current = true;
    try {
      const response = await fetch(`${API_BASE}/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ String: infoString.trim(), clientId }),
      });
      const result = await response.json();
      if (result?.success) {
        setInfoExists(true);
        setDirty(false);
        setLastSavedAt(new Date());
        showMessage("success", `Info ${result.operation || "saved"} successfully.`);
      } else {
        showMessage("error", result?.error || "Failed to save info.");
      }
    } catch (error) {
      showMessage("error", "Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
      saveInFlight.current = false;
    }
  };

  useEffect(() => {
    if (!autosave || !dirty) return;
    const t = setTimeout(() => {
      handleSaveInfo();
    }, 1200);
    return () => clearTimeout(t);
  }, [infoString, autosave, dirty]);

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty && !loading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty, loading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isSave = (e.key.toLowerCase() === "s") && (e.metaKey || e.ctrlKey);
      if (isSave) {
        e.preventDefault();
        handleSaveInfo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const MessageAlert = ({ type, text }: { type: "success" | "error"; text: string }) => {
    if (!text) return null as any;
    const Icon = type === "success" ? CheckCircle : AlertCircle;
    const variant = type === "success" ? "default" : "destructive";
    return (
      <Alert variant={variant} className="mb-6 flex items-start gap-2">
        <Icon className="mt-[2px] h-5 w-5 shrink-0" />
        <div>
          <AlertTitle className="font-semibold">{type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{text}</AlertDescription>
        </div>
      </Alert>
    );
  };

  if (!isSignedIn || !clientId) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-neutral-50 to-neutral-100 px-4">
        <Card className="w-full max-w-md border-neutral-200">
          <CardHeader>
            <CardTitle className="text-2xl">Please sign in</CardTitle>
            <CardDescription>Sign in to access your admin dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage the information linked to your client identity</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${loading ? "bg-amber-100 text-amber-800" : infoExists ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-700"}`}>
              {loading ? "Loading…" : infoExists ? "Loaded" : "New"}
            </span>
            {user?.primaryEmailAddress?.emailAddress && (
              <span className="text-xs text-muted-foreground">{user.primaryEmailAddress.emailAddress}</span>
            )}
            <Button onClick={() => signOut()} size="sm" variant="outline" className="flex items-center gap-1">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <Card className="shadow-xl rounded-xl border border-neutral-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Client Information</CardTitle>
            <CardDescription>
              {infoExists === null
                ? "Checking for existing info…"
                : infoExists
                ? "You can update your existing info."
                : "No info found. Create one now."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <MessageAlert type={(message.type as any) || "success"} text={message.text} />

            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                <strong>{words}</strong> words • <strong>{chars}</strong> characters
              </span>
              <div className="inline-flex items-center gap-2">
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={autosave}
                    onChange={(e) => setAutosave(e.target.checked)}
                  />
                  <span className="text-xs">Autosave</span>
                  <span
                    className="relative inline-flex h-5 w-9 items-center rounded-full bg-neutral-300 transition peer-checked:bg-emerald-500"
                    aria-hidden
                  >
                    <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
                  </span>
                </label>
                {lastSavedAt && (
                  <span title={lastSavedAt.toLocaleString()}>
                    Last saved {timeAgo(lastSavedAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="group relative">
              <Textarea
                id="client-info"
                value={infoString}
                onChange={(e) => {
                  setInfoString(e.target.value);
                  setDirty(true);
                }}
                rows={10}
                placeholder="Enter or update client information here…"
                className="resize-y text-sm pr-10"
              />
              <kbd
                title="Save (Ctrl/Cmd + S)"
                className="pointer-events-none absolute bottom-2 right-2 rounded border bg-neutral-50 px-1.5 text-[10px] text-neutral-600"
              >
                ⌘S
              </kbd>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={loading || (!dirty && !!infoExists)}
              onClick={() => {
                if (!clientId) return;
                setLoading(true);
                fetch(`${API_BASE}/info/${clientId}`)
                  .then(async (r) => {
                    if (r.ok) {
                      const d = await r.json();
                      setInfoString(d.String || "");
                      setDirty(false);
                    }
                  })
                  .finally(() => setLoading(false));
              }}
            >
              Discard changes
            </Button>

            <Button
              onClick={handleSaveInfo}
              disabled={loading || !infoString.trim()}
              className="w-full sm:w-auto"
              title="Save (Ctrl/Cmd + S)"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {loading ? "Saving…" : infoExists ? (dirty ? "Update Info" : "Saved") : "Create Info"}
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tip: Press <span className="rounded border px-1">Ctrl/Cmd + S</span> to save. Autosave can be toggled above.
        </p>
      </div>
    </div>
  );
}

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let duration = s;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (let i = 0; i < intervals.length; i++) {
    const [n, u] = intervals[i];
    if (duration < n) { unit = u; break; }
    duration = Math.floor(duration / n);
  }
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  return rtf.format(-duration, unit);
}

export default Admin;
