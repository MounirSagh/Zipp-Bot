"use client";

import { useEffect, useState } from "react";
import { Save, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Admin() {
  const [infoString, setInfoString] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [infoExists, setInfoExists] = useState<boolean | null>(null);

  const { isSignedIn, user } = useUser();
  const clientId = user?.id;

  const API_BASE = "https://aivo-backend.vercel.app/api";

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
  };

  useEffect(() => {
    if (!clientId) return;

    const fetchInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/info/${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setInfoString(data.String);
          setInfoExists(true);
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

  const handleSaveInfo = async () => {
    if (!clientId || !infoString.trim()) {
      showMessage("error", "Client ID and info are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          String: infoString.trim(),
          clientId: clientId,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setInfoExists(true);
        showMessage("success", `Info ${result.operation} successfully.`);
      } else {
        showMessage("error", result.error || "Failed to save info.");
      }
    } catch (error) {
      showMessage("error", "Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const MessageAlert = ({
    type,
    text,
  }: {
    type: "success" | "error";
    text: string;
  }) => {
    if (!text) return null;
    const Icon = type === "success" ? CheckCircle : AlertCircle;
    const variant = type === "success" ? "default" : "destructive";

    return (
      <Alert variant={variant} className="mb-6 flex items-start gap-2">
        <Icon className="mt-[2px] h-5 w-5 shrink-0" />
        <div>
          <AlertTitle className="font-semibold">
            {type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{text}</AlertDescription>
        </div>
      </Alert>
    );
  };

  if (!isSignedIn || !clientId)
    return (
      <div className="p-6 text-center text-lg text-muted-foreground">
        Please sign in to view your dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl border border-neutral-200 bg-white transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Admin Panel
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Manage the information linked to your client identity
          </CardDescription>
        </CardHeader>

        <CardContent>
          <MessageAlert
            type={message.type as "success" | "error"}
            text={message.text}
          />

          <div className="space-y-2 mb-6">
            <Label htmlFor="client-info" className="text-sm font-medium">
              Client Information
            </Label>
            <Textarea
              id="client-info"
              value={infoString}
              onChange={(e) => setInfoString(e.target.value)}
              rows={6}
              placeholder="Enter or update client information here..."
              className="resize-y text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {infoExists === null
                ? "Checking for existing info..."
                : infoExists
                ? "You can update your existing info."
                : "No info found. You can create one now."}
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSaveInfo}
            disabled={loading}
            className="w-full transition-all"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {loading ? "Saving..." : infoExists ? "Update Info" : "Create Info"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Admin;
