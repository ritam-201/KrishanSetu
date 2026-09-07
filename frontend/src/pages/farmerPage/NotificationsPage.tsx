import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  CircleDot,
  Clock3,
  CreditCard,
  Inbox,
  ShieldCheck,
  Ticket,
  Trash2,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import type { AppNotification } from "../../types";

type NotificationFilter =
  | "all"
  | "unread"
  | "slot"
  | "queue"
  | "verification"
  | "payment"
  | "alert";

const TYPE_CONFIG = {
  slot: {
    label: "Booking",
    icon: Ticket,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
  },

  queue: {
    label: "Queue",
    icon: CircleDot,
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-100",
  },

  verification: {
    label: "Verification",
    icon: ShieldCheck,
    iconClass: "text-purple-600",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-100",
  },

  payment: {
    label: "Payment",
    icon: CreditCard,
    iconClass: "text-orange-600",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-100",
  },

  alert: {
    label: "Alert",
    icon: AlertTriangle,
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-100",
  },
} as const;

const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = now.getTime() - date.getTime();

  if (difference < 60 * 1000) {
    return "Just now";
  }

  if (difference < 60 * 60 * 1000) {
    return `${Math.floor(difference / (60 * 1000))}m ago`;
  }

  if (difference < 24 * 60 * 60 * 1000) {
    return `${Math.floor(difference / (60 * 60 * 1000))}h ago`;
  }

  if (difference < 48 * 60 * 60 * 1000) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatFullDate = (timestamp: string) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationBar: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filter === "unread") {
      result = result.filter((notification) => !notification.read);
    } else if (filter !== "all") {
      result = result.filter(
        (notification) => notification.type === filter
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );
  }, [notifications, filter]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleNotificationClick = (
    notification: AppNotification
  ) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleDelete = (
    event: React.MouseEvent,
    notificationId: string
  ) => {
    event.stopPropagation();

    setDeletingId(notificationId);

    setTimeout(() => {
      deleteNotification(notificationId);
      setDeletingId(null);
    }, 180);
  };

  const filterItems: {
    id: NotificationFilter;
    label: string;
  }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "slot", label: "Booking" },
    { id: "queue", label: "Queue" },
    { id: "verification", label: "Verification" },
    { id: "payment", label: "Payment" },
    { id: "alert", label: "Alerts" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* =====================================================
          NOTIFICATION BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Open notifications"
        className={`
          group relative flex h-11 w-11 items-center justify-center
          rounded-2xl border transition-all duration-300
          ${
            isOpen
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-md"
              : "border-slate-200 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md"
          }
        `}
      >
        <Bell
          className={`h-5 w-5 transition-transform duration-300 ${
            isOpen ? "scale-110" : "group-hover:rotate-12"
          }`}
        />

        {unreadCount > 0 && (
          <>
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-ping rounded-full bg-red-500 opacity-60" />

            <span className="absolute -right-1.5 -top-2 flex min-h-5 min-w-5items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* =====================================================
          NOTIFICATION PANEL
      ====================================================== */}

      {isOpen && (
        <div
          className="
            absolute right-0 top-[calc(100%+12px)] z-100
            w-107.5 max-w-[calc(100vw-24px)]
            overflow-hidden rounded-3xl
            border border-slate-200/80
            bg-white
            shadow-[0_24px_70px_-18px_rgba(15,23,42,0.30)]
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <div className="relative overflow-hidden border-b border-slate-100 bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-700 px-5 pb-5 pt-5 text-white">
            {/* Decorative circles */}

            <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />

            <div className="absolute -bottom-16 right-16 h-28 w-28 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    Notifications
                  </h2>

                  <p className="mt-0.5 text-xs text-emerald-50">
                    Stay updated with your KisanSetu activity
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Unread summary */}

            <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.12)]" />

                <span className="text-xs font-medium text-white/90">
                  {unreadCount === 0
                    ? "You're all caught up"
                    : `${unreadCount} unread ${
                        unreadCount === 1
                          ? "notification"
                          : "notifications"
                      }`}
                </span>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-white/10"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              FILTERS
          ================================================== */}

          <div className="border-b border-slate-100 bg-white px-4 py-3">
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {filterItems.map((item) => {
                const active = filter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`
                      whitespace-nowrap rounded-xl px-3 py-1.5
                      text-[11px] font-semibold transition-all
                      ${
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              NOTIFICATION LIST
          ================================================== */}

          <div className="max-h-120 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50">
                  <Inbox className="h-7 w-7 text-slate-300" />
                </div>

                <h3 className="text-sm font-bold text-slate-700">
                  No notifications
                </h3>

                <p className="mt-1 max-w-62.5 text-xs leading-5 text-slate-400">
                  {filter === "unread"
                    ? "You have no unread notifications right now."
                    : "When something important happens, you'll see it here."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredNotifications.map((notification) => {
                  const config =
                    TYPE_CONFIG[notification.type];

                  const Icon = config.icon;

                  const isDeleting =
                    deletingId === notification.id;

                  return (
                    <div
                      key={notification.id}
                      className={`
                        group relative transition-all duration-200
                        ${
                          isDeleting
                            ? "translate-x-8 opacity-0"
                            : "translate-x-0 opacity-100"
                        }
                        ${
                          !notification.read
                            ? "bg-emerald-50/45"
                            : "bg-white hover:bg-slate-50/80"
                        }
                      `}
                    >
                      {/* Unread indicator */}

                      {!notification.read && (
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-emerald-500" />
                      )}

                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            handleNotificationClick(
                              notification
                            );
                          }
                        }}
                        className="cursor-pointer px-4 py-4"
                      >
                        <div className="flex gap-3">
                          {/* Icon */}

                          <div
                            className={`
                              flex h-10 w-10 shrink-0
                              items-center justify-center
                              rounded-2xl border
                              ${config.bgClass}
                              ${config.borderClass}
                            `}
                          >
                            <Icon
                              className={`h-4.5 w-4.5 ${config.iconClass}`}
                            />
                          </div>

                          {/* Content */}

                          <div className="min-w-0 flex-1 pr-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3
                                className={`
                                  text-[13px] leading-5
                                  ${
                                    notification.read
                                      ? "font-semibold text-slate-700"
                                      : "font-bold text-slate-900"
                                  }
                                `}
                              >
                                {notification.title}
                              </h3>

                              {!notification.read && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            <div className="mt-2.5 flex items-center gap-2">
                              {notification.badge && (
                                <span
                                  className={`
                                    rounded-lg px-2 py-1
                                    text-[9px] font-bold uppercase
                                    tracking-wide
                                    ${config.bgClass}
                                    ${config.iconClass}
                                  `}
                                >
                                  {notification.badge}
                                </span>
                              )}

                              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                <Clock3 className="h-3 w-3" />
                                {getRelativeTime(
                                  notification.timestamp
                                )}
                              </span>
                            </div>

                            {notification.actionUrl && (
                              <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                View details
                                <ChevronRight className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          {/* Delete button */}

                          <button
                            type="button"
                            onClick={(event) =>
                              handleDelete(
                                event,
                                notification.id
                              )
                            }
                            className="
                              flex h-8 w-8 shrink-0
                              items-center justify-center
                              rounded-xl
                              text-slate-300
                              opacity-0
                              transition-all
                              hover:bg-red-50
                              hover:text-red-500
                              group-hover:opacity-100
                            "
                            title="Delete notification"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          {notifications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Notifications are saved automatically
                </div>

                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="text-[10px] font-semibold text-emerald-600 transition hover:text-emerald-700"
                >
                  View all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBar;