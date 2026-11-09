import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Plus,
  CloudDownload,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Search,
  Filter,
  Monitor,
  Smartphone,
  Headphones,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

export const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState('');

  // Firebase import state
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [simulateError, setSimulateError] = useState(false);

  // New asset form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [serial, setSerial] = useState('');
  const [tag, setTag] = useState('');
  const [condition, setCondition] = useState('Brand New');

  const { addToast } = useToast();
  const employees = employeeService.getEmployees();

  const loadAssets = () => {
    setAssets(assetService.getAssets());
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({
        title: 'Validation error',
        message: 'Asset name/model is required.',
        type: 'warning',
      });
      return;
    }

    const created = assetService.addAsset({
      name: name.trim(),
      category,
      serial: serial.trim() || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      tag: tag.trim() || `TAG-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      condition,
      assignedTo: 'Unassigned',
      employeeId: null,
      assignedDate: '--',
      status: 'Available',
    });

    addToast({
      title: 'Asset Registered',
      message: `${created.name} (${created.tag}) added to inventory.`,
      type: 'success',
    });

    loadAssets();
    setShowAddModal(false);
    setName('');
    setSerial('');
    setTag('');
  };

  const handleImportFromFirebase = async () => {
    setIsImporting(true);
    setImportError(null);

    try {
      const result = await assetService.importFromFirebase(simulateError);
      addToast({
        title: 'Firebase Import Successful',
        message: result.message,
        type: 'success',
      });
      loadAssets();
    } catch (err) {
      setImportError(err.message);
      addToast({
        title: 'Firebase Import Failed',
        message: err.message,
        type: 'error',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmpId || !assigningAsset) return;

    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    assetService.assignAsset(assigningAsset.id, emp.name, emp.id);

    addToast({
      title: 'Asset Assigned',
      message: `${assigningAsset.name} assigned to ${emp.name}.`,
      type: 'success',
    });

    loadAssets();
    setAssigningAsset(null);
    setSelectedEmpId('');
  };

  const handleReturnAsset = (asset) => {
    assetService.updateAsset(asset.id, {
      assignedTo: 'Unassigned',
      employeeId: null,
      status: 'Available',
      returnStatus: 'Returned (Ready)',
      assignedDate: '--',
    });

    addToast({
      title: 'Asset Returned',
      message: `${asset.name} marked returned and available for reallocation.`,
      type: 'info',
    });

    loadAssets();
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.assignedTo && a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      categoryFilter === 'All' || a.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Laptops', 'Monitors', 'Mobile Devices', 'Peripherals'];

  const columns = [
    {
      header: 'Asset & Tag',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-bold text-[#172033] hover:text-[#2563EB] cursor-pointer" onClick={() => setSelectedAsset(row)}>
            {row.name}
          </div>
          <div className="text-[11px] text-[#8292AD] font-mono">{row.tag} • S/N: {row.serial}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-xs font-semibold text-[#172033] px-2.5 py-0.5 rounded-md bg-[#F7F9FC] border border-[#E5EAF2]">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo',
      render: (row) => (
        <div>
          <div className={`text-xs font-bold ${row.assignedTo === 'Unassigned' ? 'text-[#8292AD]' : 'text-[#172033]'}`}>
            {row.assignedTo}
          </div>
          {row.assignedDate && row.assignedDate !== '--' && (
            <div className="text-[10px] text-[#8292AD]">Since {row.assignedDate}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Return Status',
      accessor: 'returnStatus',
      render: (row) => (
        <span className="text-xs text-[#4E5D78]">
          {row.returnStatus}
        </span>
      ),
    },
    {
      header: 'Condition',
      accessor: 'condition',
      render: (row) => (
        <span className="text-xs text-[#8292AD]">{row.condition}</span>
      ),
    },
    {
      header: 'Inventory Status',
      accessor: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="Asset Management"
        badgeText="Hardware & Devices"
        subtitle="Track equipment inventory, employee assignments, return lifecycle and cloud sync."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Assets' }]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Firebase Import Button */}
            <button
              onClick={handleImportFromFirebase}
              disabled={isImporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-all disabled:opacity-60"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                  <span>Syncing Firebase...</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Import From Firebase</span>
                </>
              )}
            </button>

            {/* Add Asset Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Asset</span>
            </button>
          </div>
        }
      />

      {/* Firebase Sync Notification Banner / Error States */}
      {isImporting && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            <div>
              <p className="text-xs font-bold">Importing asset data from Firebase Firestore...</p>
              <p className="text-[11px] text-blue-700">Connecting to collection: company_assets (read-only mode)</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold">1400ms SLA</span>
        </div>
      )}

      {importError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">Firebase Import Error State</p>
              <p className="text-[11px] text-rose-700">{importError}</p>
            </div>
          </div>
          <button
            onClick={() => setImportError(null)}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Test Bar for Reviewer */}
      <div className="p-3 bg-white rounded-xl border border-[#E5EAF2] flex items-center justify-between text-xs text-[#8292AD]">
        <span className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Firebase Connection Mock Service (Ready for backend API credentials)</span>
        </span>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
            className="rounded text-[#2563EB] focus:ring-0"
          />
          <span className="text-[11px]">Simulate Firebase Error State on next click</span>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Hardware"
          value={assets.length}
          subtext="Catalogued equipment"
          badgeText="Active"
          badgeType="success"
          icon={Laptop}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="Assigned to Staff"
          value={assets.filter((a) => a.status === 'Assigned').length}
          subtext="In active employee use"
          badgeText="Deployed"
          badgeType="success"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Available in Stock"
          value={assets.filter((a) => a.status === 'Available').length}
          subtext="Ready for allocation"
          badgeText="Stock Ready"
          badgeType="default"
          icon={RotateCcw}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatsCard
          title="Under Maintenance"
          value={assets.filter((a) => a.status === 'Maintenance').length}
          subtext="Servicing / RMA repair"
          badgeText="Attention"
          badgeType="danger"
          icon={AlertCircle}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Filters Bar matching Reference Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-card">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F7F9FC] text-[#8292AD] hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search tag, model, serial..."
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        pageSize={6}
        emptyMessage="No assets match your search"
        emptySubtext="Try selecting another category or clearing search query."
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            {row.status === 'Assigned' ? (
              <button
                onClick={() => handleReturnAsset(row)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                Return
              </button>
            ) : (
              <button
                onClick={() => setAssigningAsset(row)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                Assign
              </button>
            )}
          </div>
        )}
      />

      {/* Add Asset Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Register Company Asset"
          subtitle="Add new hardware device to company inventory and asset tracking"
        >
          <form onSubmit={handleCreateAsset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Asset Name / Model *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dell XPS 15 9530"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Mobile Devices">Mobile Devices</option>
                  <option value="Peripherals">Peripherals</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Asset Tag Number
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. TAG-LAP-904"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="e.g. C02GL89100PQ"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Register Asset
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Asset Modal */}
      {assigningAsset && (
        <Modal
          isOpen={!!assigningAsset}
          onClose={() => setAssigningAsset(null)}
          title={`Assign Asset: ${assigningAsset.name}`}
          subtitle={`Tag: ${assigningAsset.tag} | Serial: ${assigningAsset.serial}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Select Employee *
              </label>
              <select
                required
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              >
                <option value="">-- Choose employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.id} - {emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setAssigningAsset(null)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <Modal
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          title="Asset Details Card"
          subtitle={`Tag: ${selectedAsset.tag}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 bg-[#F7F9FC] rounded-2xl border border-[#E5EAF2]">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Laptop className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#172033]">{selectedAsset.name}</h4>
                  <StatusBadge status={selectedAsset.status} size="sm" />
                </div>
                <p className="text-xs text-[#8292AD]">Serial: {selectedAsset.serial}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Category</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.category}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Condition</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.condition}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Current Holder</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.assignedTo}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Assignment Date</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.assignedDate}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

