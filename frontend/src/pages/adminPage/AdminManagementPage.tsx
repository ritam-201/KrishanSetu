import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Edit3,
  X,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  User,
  CalendarDays,
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
  Eye,
} from 'lucide-react';

import { useAdminAuth } from '../../context/AdminContext';
import { AdminUser } from '../../types';

interface AdminRecord extends AdminUser {
  createdAt?: string;
  updatedAt?: string;
}

interface EditForm {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminManagementPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedAdmin, setSelectedAdmin] =
    useState<AdminRecord | null>(null);

  const [editingAdmin, setEditingAdmin] =
    useState<AdminRecord | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const [editForm, setEditForm] = useState<EditForm>({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
  });

  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(
    null
  );

  /* =========================================================
     GET TOKEN
  ========================================================= */

  const getToken = () => {
    return (
      localStorage.getItem('kisansetu_admin_token') ||
      localStorage.getItem('adminToken') ||
      ''
    );
  };

  /* =========================================================
     LOAD ADMINS
  ========================================================= */

  const loadAdmins = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const token = getToken();

      if (!token) {
        throw new Error(
          'Admin authentication session not found. Please login again.'
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/admins`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load registered admins.'
        );
      }

      setAdmins(data.admins || []);
    } catch (err) {
      console.error('Load admins error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load registered administrators.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredAdmins = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return admins;
    }

    return admins.filter((admin) => {
      return (
        admin.fullName.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search) ||
        admin.adminId.toLowerCase().includes(search) ||
        admin.phone.toLowerCase().includes(search) ||
        admin.department.toLowerCase().includes(search) ||
        admin.designation.toLowerCase().includes(search)
      );
    });
  }, [admins, searchTerm]);

  /* =========================================================
     EDIT ADMIN
  ========================================================= */

  const openEditModal = (admin: AdminRecord) => {
    setEditingAdmin(admin);

    setEditForm({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      department: admin.department,
      designation: admin.designation,
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingAdmin(null);
  };

  const handleEditChange = (
    field: keyof EditForm,
    value: string
  ) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSaveAdmin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editingAdmin) return;

    if (
      !editForm.fullName.trim() ||
      !editForm.email.trim() ||
      !editForm.phone.trim() ||
      !editForm.department.trim() ||
      !editForm.designation.trim()
    ) {
      alert('Please fill out all admin details.');
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/admins/${encodeURIComponent(
          editingAdmin.adminId
        )}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: editForm.fullName.trim(),
            email: editForm.email.trim().toLowerCase(),
            phone: editForm.phone.trim(),
            department: editForm.department.trim(),
            designation: editForm.designation.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to update admin.'
        );
      }

      setAdmins((previous) =>
        previous.map((admin) =>
          admin.adminId === editingAdmin.adminId
            ? {
                ...admin,
                ...data.admin,
              }
            : admin
        )
      );

      setEditingAdmin(null);

      alert('Admin details updated successfully.');
    } catch (err) {
      console.error('Update admin error:', err);

      alert(
        err instanceof Error
          ? err.message
          : 'Unable to update admin details.'
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const handleStatusChange = async (
    admin: AdminRecord
  ) => {
    const nextStatus =
      admin.accountStatus === 'active'
        ? 'disabled'
        : 'active';

    const actionText =
      nextStatus === 'active'
        ? 'activate'
        : 'disable';

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${admin.fullName}'s account?`
    );

    if (!confirmed) return;

    try {
      setStatusUpdating(admin.adminId);

      const token = getToken();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/admins/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adminId: admin.adminId,
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to update account status.'
        );
      }

      setAdmins((previous) =>
        previous.map((item) =>
          item.adminId === admin.adminId
            ? {
                ...item,
                accountStatus: data.admin.accountStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error('Status update error:', err);

      alert(
        err instanceof Error
          ? err.message
          : 'Unable to update account status.'
      );
    } finally {
      setStatusUpdating(null);
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date?: string) => {
    if (!date) return 'Never';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return 'Never';
    }

    return parsed.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCreatedDate = (date?: string) => {
    if (!date) return 'Not available';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return 'Not available';
    }

    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  /* =========================================================
     OPEN DETAILS
  ========================================================= */

  const openDetails = (admin: AdminRecord) => {
    setSelectedAdmin(admin);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedAdmin(null);
  };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalAdmins = admins.length;

  const activeAdmins = admins.filter(
    (admin) => admin.accountStatus === 'active'
  ).length;

  const disabledAdmins = admins.filter(
    (admin) => admin.accountStatus === 'disabled'
  ).length;

  /* =========================================================
     ACCESS GUARD
  ========================================================= */

  if (adminUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Lock className="h-7 w-7 text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Super Admin Access Required
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Only Super Admins can view and manage registered
            administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-emerald-600" />

              <h1 className="text-2xl font-bold text-slate-900">
                Registered Admins
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              View and manage administrators registered with
              KisanSetu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadAdmins(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />

            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Registered Admins
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalAdmins}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Accounts
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {activeAdmins}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Disabled Accounts
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {disabledAdmins}
            </p>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-800">
                Unable to load administrators
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => loadAdmins()}
                className="mt-3 text-sm font-semibold text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by name, email, Admin ID, phone, department..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading registered administrators...
                </p>
              </div>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <User className="h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No administrators found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {searchTerm
                  ? 'Try changing your search term.'
                  : 'No registered administrators are available yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Administrator
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.map((admin) => {
                    const isCurrentAdmin =
                      admin.adminId === adminUser?.adminId;

                    const isSuperAdmin =
                      admin.role === 'SUPER_ADMIN';

                    return (
                      <tr
                        key={admin.adminId}
                        className="transition hover:bg-slate-50/80"
                      >
                        {/* ADMIN */}

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                              {admin.fullName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {admin.fullName}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {admin.adminId}
                              </p>

                              {isCurrentAdmin && (
                                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                  YOU
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-5">
                          <p className="flex items-center gap-2 text-sm text-slate-700">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {admin.email}
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {admin.phone}
                          </p>
                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-5 py-5">
                          <p className="flex items-start gap-2 text-sm font-medium text-slate-700">
                            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                            <span>
                              {admin.department}

                              <span className="mt-1 block text-xs font-normal text-slate-500">
                                {admin.designation}
                              </span>
                            </span>
                          </p>
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              isSuperAdmin
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {admin.role.replace('_', ' ')}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              admin.accountStatus === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : admin.accountStatus ===
                                  'disabled'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {admin.accountStatus === 'active' ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}

                            {admin.accountStatus
                              .charAt(0)
                              .toUpperCase() +
                              admin.accountStatus.slice(1)}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openDetails(admin)}
                              title="View details"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(admin)
                              }
                              title="Edit admin"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            {!isCurrentAdmin && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(admin)
                                }
                                disabled={
                                  statusUpdating ===
                                  admin.adminId
                                }
                                title={
                                  admin.accountStatus ===
                                  'active'
                                    ? 'Disable account'
                                    : 'Activate account'
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                              >
                                {statusUpdating ===
                                admin.adminId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : admin.accountStatus ===
                                  'active' ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Unlock className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =======================================================
          DETAILS MODAL
      ======================================================= */}

      {showDetails && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Administrator Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedAdmin.adminId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <DetailItem
                icon={<User className="h-4 w-4" />}
                label="Full Name"
                value={selectedAdmin.fullName}
              />

              <DetailItem
                icon={<Mail className="h-4 w-4" />}
                label="Admin Email"
                value={selectedAdmin.email}
              />

              <DetailItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone Number"
                value={selectedAdmin.phone}
              />

              <DetailItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Role"
                value={selectedAdmin.role.replace(
                  '_',
                  ' '
                )}
              />

              <DetailItem
                icon={<Building2 className="h-4 w-4" />}
                label="Department"
                value={selectedAdmin.department}
              />

              <DetailItem
                icon={
                  <BriefcaseBusiness className="h-4 w-4" />
                }
                label="Designation"
                value={selectedAdmin.designation}
              />

              <DetailItem
                icon={
                  <CheckCircle2 className="h-4 w-4" />
                }
                label="Account Status"
                value={
                  selectedAdmin.accountStatus
                    .charAt(0)
                    .toUpperCase() +
                  selectedAdmin.accountStatus.slice(1)
                }
              />

              <DetailItem
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="Registered On"
                value={formatCreatedDate(
                  selectedAdmin.createdAt
                )}
              />

              <DetailItem
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="Last Login"
                value={formatDate(
                  selectedAdmin.lastLogin
                )}
              />

              <DetailItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Two-Factor Authentication"
                value={
                  selectedAdmin.twoFactorEnabled
                    ? 'Enabled'
                    : 'Disabled'
                }
              />
            </div>

            <div className="mx-6 mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Password Protected
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                For security reasons, the administrator's
                password is never displayed here. Password
                changes must be handled through the secure
                password-change process.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  closeDetails();
                  openEditModal(selectedAdmin);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Edit3 className="h-4 w-4" />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          EDIT MODAL
      ======================================================= */}

      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Administrator
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingAdmin.adminId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveAdmin}
              className="p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Full Name"
                  value={editForm.fullName}
                  onChange={(value) =>
                    handleEditChange('fullName', value)
                  }
                />

                <FormField
                  label="Admin Email"
                  type="email"
                  value={editForm.email}
                  onChange={(value) =>
                    handleEditChange('email', value)
                  }
                />

                <FormField
                  label="Phone Number"
                  value={editForm.phone}
                  onChange={(value) =>
                    handleEditChange('phone', value)
                  }
                />

                <FormField
                  label="Department"
                  value={editForm.department}
                  onChange={(value) =>
                    handleEditChange(
                      'department',
                      value
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <FormField
                    label="Designation"
                    value={editForm.designation}
                    onChange={(value) =>
                      handleEditChange(
                        'designation',
                        value
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Password is not editable here
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  This form only edits the information
                  provided during admin registration. The
                  password remains securely hashed in the
                  database and is never displayed.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   DETAIL ITEM
========================================================= */

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
};

export { AdminManagementPage };