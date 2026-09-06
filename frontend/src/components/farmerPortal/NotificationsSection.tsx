import React, { useMemo, useState } from "react";
import {
  Bell,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  SlidersHorizontal,
  CheckCheck,
  Circle,
  ArrowRight,
  X,
  Volume2,
  CreditCard,
  CalendarCheck2,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

type NotificationFilter =
  | "all"
  | "unread"
  | "booking"
  | "queue"
  | "delay"
  | "turn"
  | "payment";

export const NotificationsSection: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAuth();

  const [smsActive, setSmsActive] = useState(true);
  const [whatsAppActive, setWhatsAppActive] = useState(true);
  const [inAppActive, setInAppActive] = useState(true);

  const [filter, setFilter] = useState<NotificationFilter>("all");

  /* =========================================================
     UNREAD COUNT
  ========================================================= */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /* =========================================================
     FILTER NOTIFICATIONS
  ========================================================= */

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === "all") {
        return true;
      }

      if (filter === "unread") {
        return !notification.read;
      }

      return notification.type === filter;
    });
  }, [notifications, filter]);

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (timestamp: string): string => {
    if (!timestamp) {
      return "Just now";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    const now = new Date();

    const difference = Math.max(
      0,
      now.getTime() - date.getTime(),
    );

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 30) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     NOTIFICATION VISUALS
  ========================================================= */

  const getNotificationVisual = (type: string) => {
    switch (type) {
      case "booking":
      case "slot":
        return {
          icon: CalendarCheck2,
          iconClass:
            "bg-emerald-100 text-emerald-700 border-emerald-200",
          badgeClass:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: "BOOKING",
        };

      case "queue":
        return {
          icon: Clock3,
          iconClass:
            "bg-blue-100 text-blue-700 border-blue-200",
          badgeClass:
            "bg-blue-50 text-blue-700 border-blue-200",
          label: "QUEUE UPDATE",
        };

      case "delay":
        return {
          icon: AlertTriangle,
          iconClass:
            "bg-amber-100 text-amber-700 border-amber-200",
          badgeClass:
            "bg-amber-50 text-amber-700 border-amber-200",
          label: "DELAY",
        };

      case "turn":
        return {
          icon: Megaphone,
          iconClass:
            "bg-red-100 text-red-700 border-red-200",
          badgeClass:
            "bg-red-50 text-red-700 border-red-200",
          label: "YOUR TURN",
        };

      case "payment":
        return {
          icon: CreditCard,
          iconClass:
            "bg-violet-100 text-violet-700 border-violet-200",
          badgeClass:
            "bg-violet-50 text-violet-700 border-violet-200",
          label: "PAYMENT",
        };

      case "verification":
        return {
          icon: ShieldCheck,
          iconClass:
            "bg-cyan-100 text-cyan-700 border-cyan-200",
          badgeClass:
            "bg-cyan-50 text-cyan-700 border-cyan-200",
          label: "VERIFICATION",
        };

      default:
        return {
          icon: Bell,
          iconClass:
            "bg-slate-100 text-slate-700 border-slate-200",
          badgeClass:
            "bg-slate-50 text-slate-700 border-slate-200",
          label: "UPDATE",
        };
    }
  };

  /* =========================================================
     FILTER BUTTON
  ========================================================= */

  const filterItems: {
    id: NotificationFilter;
    label: string;
  }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "booking", label: "Booking" },
    { id: "queue", label: "Queue" },
    { id: "delay", label: "Delay" },
    { id: "turn", label: "Turn" },
    { id: "payment", label: "Payment" },
  ];

  return (
    <section
      id="smart-notifications"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 border-y border-slate-200"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-100/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Smart Notifications
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Stay Updated.
            <span className="block text-emerald-600">
              Never Miss Your Turn.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Get real-time updates about your procurement booking, queue
            position, delays, token calls, verification, and payment status.
          </p>

        </div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-12">

          {/* =================================================
              LEFT — NOTIFICATION CENTER
          ================================================= */}

          <div className="xl:col-span-8">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

              {/* =============================================
                  TOP HEADER
              ============================================= */}

              <div className="border-b border-slate-100 bg-white px-5 py-5 sm:px-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                      <Bell className="h-5 w-5" />

                      {unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                          Notification Center
                        </h3>

                        <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 sm:inline-flex">
                          Live
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${
                              unreadCount > 1 ? "s" : ""
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>

                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Mark all as read
                    </button>
                  )}

                </div>

                {/* ===========================================
                    FILTERS
                =========================================== */}

                <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

                  {filterItems.map((item) => {

                    const active = filter === item.id;

                    const count =
                      item.id === "unread"
                        ? unreadCount
                        : item.id === "all"
                          ? notifications.length
                          : notifications.filter(
                              (notification) =>
                                notification.type === item.id ||
                                (item.id === "booking" &&
                                  notification.type === "slot"),
                            ).length;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFilter(item.id)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                          active
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {item.label}

                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-white text-slate-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}

                </div>

              </div>

              {/* =============================================
                  NOTIFICATION LIST
              ============================================= */}

              <div className="bg-slate-50/50 p-3 sm:p-5">

                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">

                    {filteredNotifications.map((notification) => {

                      const visual = getNotificationVisual(
                        notification.type,
                      );

                      const Icon = visual.icon;

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            markNotificationRead(notification.id)
                          }
                          className={`group relative w-full rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                            !notification.read
                              ? "border-emerald-200 bg-white shadow-md shadow-emerald-100/50 hover:-translate-y-0.5 hover:shadow-lg"
                              : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
                          }`}
                        >

                          {/* Unread indicator */}

                          {!notification.read && (
                            <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-300" />
                          )}

                          <div className="flex gap-3.5 sm:gap-4">

                            {/* ICON */}

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${visual.iconClass}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            {/* CONTENT */}

                            <div className="min-w-0 flex-1 pr-4">

                              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex flex-wrap items-center gap-2">

                                  <h4
                                    className={`text-sm ${
                                      !notification.read
                                        ? "font-bold text-slate-900"
                                        : "font-semibold text-slate-800"
                                    }`}
                                  >
                                    {notification.title}
                                  </h4>

                                  <span
                                    className={`rounded-md border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${visual.badgeClass}`}
                                  >
                                    {notification.badge ||
                                      visual.label}
                                  </span>

                                </div>

                                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                  <Clock3 className="h-3 w-3" />
                                  {formatTime(notification.timestamp)}
                                </span>

                              </div>

                              <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                                {notification.message}
                              </p>

                              <div className="mt-3 flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                  {!notification.read ? (
                                    <>
                                      <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />

                                      <span className="text-[10px] font-semibold text-emerald-600">
                                        New notification
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />

                                      <span className="text-[10px] font-medium text-slate-400">
                                        Read
                                      </span>
                                    </>
                                  )}

                                </div>

                                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 transition group-hover:text-emerald-600">
                                  View
                                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                </span>

                              </div>

                            </div>

                          </div>

                        </button>
                      );
                    })}

                  </div>
                ) : (
                  /* =========================================
                     EMPTY STATE
                  ========================================= */

                  <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">

                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                      <Bell className="h-7 w-7" />
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      No notifications here
                    </h4>

                    <p className="mt-1 max-w-sm text-xs leading-6 text-slate-500">
                      You're all caught up. New procurement updates will
                      appear here automatically.
                    </p>

                  </div>
                )}

              </div>

              {/* =============================================
                  FOOTER
              ============================================= */}

              <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4 sm:px-7">

                <div className="flex items-center gap-2 text-[10px] text-slate-400">

                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />

                  Smart procurement alerts enabled

                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Live feed

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT — CHANNEL SETTINGS
          ================================================= */}

          <div className="space-y-5 xl:col-span-4">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

              {/* =============================================
                  SETTINGS HEADER
              ============================================= */}

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <SlidersHorizontal className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Alert Preferences
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Choose how you receive updates
                    </p>
                  </div>

                </div>

              </div>

              {/* =============================================
                  CHANNELS
              ============================================= */}

              <div className="space-y-3 p-4 sm:p-5">

                {/* WHATSAPP */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/30">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        WhatsApp
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                        Queue & token alerts
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    aria-label="Toggle WhatsApp notifications"
                    onClick={() =>
                      setWhatsAppActive(!whatsAppActive)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition-colors ${
                      whatsAppActive
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        whatsAppActive
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>

                </div>

                {/* SMS */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/30">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                      <Smartphone className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        SMS Messages
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                        Mobile network fallback
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    aria-label="Toggle SMS notifications"
                    onClick={() => setSmsActive(!smsActive)}
                    className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition-colors ${
                      smsActive
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        smsActive
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>

                </div>

                {/* IN APP */}

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-violet-200 hover:bg-violet-50/30">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
                      <Bell className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        In-App Alerts
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                        Dashboard notifications
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    aria-label="Toggle in-app notifications"
                    onClick={() =>
                      setInAppActive(!inAppActive)
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition-colors ${
                      inAppActive
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        inAppActive
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>

                </div>

              </div>

              {/* =============================================
                  VERIFIED CONTACT
              ============================================= */}

              <div className="mx-4 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:mx-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-emerald-950">
                      Mobile Number Verified
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-emerald-800">
                      Alerts will be delivered using your registered
                      mobile number.
                    </p>

                    <div className="mt-2 inline-flex items-center rounded-lg border border-emerald-200 bg-white/70 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                      SMS • WhatsApp • App
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                SMART ALERT CARD
            ================================================= */}

            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-300/30 sm:p-6">

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />

              <div className="relative">

                <div className="mb-4 flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <Volume2 className="h-4 w-4 text-emerald-300" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Smart Alert System
                  </span>

                </div>

                <h4 className="text-base font-bold">
                  Never wait without information.
                </h4>

                <p className="mt-2 text-xs leading-6 text-slate-300">
                  KisanSetu can notify farmers when their queue position
                  changes, their token is called, procurement is delayed,
                  or payment is initiated.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-lg font-bold text-white">
                      24/7
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Status updates
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-lg font-bold text-white">
                      3
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Alert channels
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};