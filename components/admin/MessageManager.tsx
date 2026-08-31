'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  X,
  ExternalLink,
  MessageSquare,
  Filter,
  RefreshCw,
  Phone,
  User,
  Calendar,
  CheckCheck,
  Archive,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  unread: number;
  replied: number;
  read: number;
}

export default function MessageManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, replied: 0, read: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('status', activeTab);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await axios.get(`/api/admin/messages?${params.toString()}`);
      if (res.data?.success) {
        setMessages(res.data.data || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const totalPages = Math.max(1, Math.ceil(messages.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedMessages = messages.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handleUpdateStatus = async (id: number, status: 'unread' | 'read' | 'replied' | 'archived') => {
    try {
      setActionLoading(true);
      const res = await axios.patch(`/api/admin/messages/${id}`, { status });
      if (res.data?.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to update message status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      setActionLoading(true);
      const res = await axios.delete(`/api/admin/messages/${id}`);
      if (res.data?.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
        setDeleteModalId(null);
        fetchMessages();
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const openMessageModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0F172A] font-display">
              Contact Submissions
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-[#6366F1] border border-indigo-200">
              {stats.unread} Unread
            </span>
          </div>
          <p className="mt-1 text-xs text-[#707EAE]">
            Manage and respond to incoming customer inquiries from the contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E9EDF7] bg-white px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 text-[#6366F1] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-[#E9EDF7] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#707EAE]">Total Submissions</p>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">{stats.total}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-800">Unread Messages</p>
            <h3 className="text-2xl font-extrabold text-amber-900">{stats.unread}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800">Replied Messages</p>
            <h3 className="text-2xl font-extrabold text-emerald-900">{stats.replied}</h3>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Header */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: 'unread', label: `Unread (${stats.unread})` },
            { id: 'read', label: `Read (${stats.read})` },
            { id: 'replied', label: `Replied (${stats.replied})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#6366F1] text-white shadow-xs'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#6366F1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0]" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] pl-10 pr-4 py-2 text-xs text-[#0F172A] placeholder-[#A3AED0] outline-none focus:border-[#6366F1] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Messages Table Container */}
      <div className="rounded-2xl border border-[#E9EDF7] bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#707EAE]">
            <RefreshCw className="h-6 w-6 text-[#6366F1] animate-spin mx-auto mb-2" />
            <span>Loading contact messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#6366F1] mx-auto">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No messages found</h3>
            <p className="text-xs text-[#707EAE] max-w-sm mx-auto">
              {searchQuery
                ? `No submissions match "${searchQuery}".`
                : 'No contact form submissions in this category.'}
            </p>
          </div>
        ) : (
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                <tr className="border-b border-[#E9EDF7] bg-[#F8FAFC] text-[11px] font-bold text-[#707EAE] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Sender Details</th>
                  <th className="py-3.5 px-6">Subject & Preview</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Submitted Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EDF7] text-xs">
                {paginatedMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-purple-50/20 transition-colors ${
                      msg.status === 'unread' ? 'bg-indigo-50/30 font-semibold' : ''
                    }`}
                  >
                    {/* Sender Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100/70 text-[#6366F1] font-extrabold text-xs shrink-0">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A]">{msg.name}</p>
                          <p className="text-[11px] text-[#707EAE]">{msg.email}</p>
                          {msg.phone && (
                            <p className="text-[10px] text-slate-400 font-mono">{msg.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Subject & Preview */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="font-bold text-[#0F172A] truncate">{msg.subject}</p>
                      <p className="text-[11px] text-[#707EAE] line-clamp-1 mt-0.5 font-normal">
                        {msg.message}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold capitalize ${
                          msg.status === 'unread'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : msg.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : msg.status === 'read'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {msg.status === 'unread' && <AlertCircle className="h-3 w-3" />}
                        {msg.status === 'replied' && <CheckCheck className="h-3 w-3" />}
                        {msg.status === 'read' && <CheckCircle2 className="h-3 w-3" />}
                        {msg.status}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-6 text-[#707EAE] font-mono text-[11px]">
                      {new Date(msg.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openMessageModal(msg)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF7] bg-white text-[#6366F1] hover:bg-indigo-50 transition-colors"
                          title="View Message Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => handleUpdateStatus(msg.id, 'replied')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF7] bg-white text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Reply via Email"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setDeleteModalId(msg.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF7] bg-white text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {messages.length > 0 && (
          <div className="p-4 border-t border-[#E9EDF7] bg-[#F8FAFC]">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={messages.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) =>
                setCurrentPage(Math.min(Math.max(page, 1), totalPages))
              }
              itemLabel="messages"
            />
          </div>
        )}
      </div>

      {/* Message Detail View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-[#E9EDF7]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF7] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#6366F1]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">Message Details</h3>
                  <p className="text-xs text-[#707EAE]">ID #{selectedMessage.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sender Meta Info */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#F8FAFC] p-4 border border-[#E9EDF7]">
              <div>
                <p className="text-[11px] font-bold text-[#707EAE] uppercase">Sender Name</p>
                <p className="text-xs font-extrabold text-[#0F172A] mt-0.5">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#707EAE] uppercase">Email</p>
                <p className="text-xs font-bold text-[#6366F1] mt-0.5">{selectedMessage.email}</p>
              </div>
              {selectedMessage.phone && (
                <div>
                  <p className="text-[11px] font-bold text-[#707EAE] uppercase">Phone</p>
                  <p className="text-xs font-medium text-[#0F172A] mt-0.5">{selectedMessage.phone}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-[#707EAE] uppercase">Submitted At</p>
                <p className="text-xs font-medium text-[#0F172A] mt-0.5">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Subject & Message Content */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-[#707EAE] uppercase tracking-wider">Subject</span>
                <h4 className="text-base font-extrabold text-[#0F172A] mt-1">{selectedMessage.subject}</h4>
              </div>

              <div>
                <span className="text-xs font-bold text-[#707EAE] uppercase tracking-wider">Message Content</span>
                <div className="mt-2 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Actions Bar inside Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E9EDF7] gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark Replied</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'unread')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-2 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Mark Unread</span>
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <span>Reply via Email</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4 border border-[#E9EDF7]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">Delete Submission?</h3>
            <p className="text-xs text-[#707EAE]">
              Are you sure you want to delete this contact submission? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMessage(deleteModalId)}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
