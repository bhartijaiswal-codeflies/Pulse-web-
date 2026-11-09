import { initialAssets } from '../data/mockData';

const ASSETS_KEY = 'pulse_assets';

export const assetService = {
  getAssets: () => {
    const saved = localStorage.getItem(ASSETS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(ASSETS_KEY, JSON.stringify(initialAssets));
    return initialAssets;
  },

  addAsset: (asset) => {
    const current = assetService.getAssets();
    const newAsset = {
      ...asset,
      id: `AST-${Math.floor(200 + Math.random() * 800)}`,
      tag: asset.tag || `TAG-EQP-${Math.floor(100 + Math.random() * 900)}`,
      status: asset.status || 'Available',
      returnStatus: asset.assignedTo && asset.assignedTo !== 'Unassigned' ? 'Not Returned' : 'Returned (Ready)',
    };
    const updated = [newAsset, ...current];
    localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));
    return newAsset;
  },

  updateAsset: (id, updates) => {
    const current = assetService.getAssets();
    const updated = current.map((a) => (a.id === id ? { ...a, ...updates } : a));
    localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));
    return updated.find((a) => a.id === id);
  },

  assignAsset: (assetId, employeeName, employeeId) => {
    const current = assetService.getAssets();
    const updated = current.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          assignedTo: employeeName,
          employeeId: employeeId,
          assignedDate: 'Today',
          status: 'Assigned',
          returnStatus: 'Not Returned',
        };
      }
      return a;
    });
    localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));
    return updated;
  },

  // Simulated Firebase Import with latency, loading and error handling
  importFromFirebase: async (shouldSimulateError = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldSimulateError) {
          reject(new Error('Firebase sync error: Network timeout or collection "company_assets" permission denied.'));
        } else {
          // New simulated synced records from cloud
          const firebaseSyncedAssets = [
            {
              id: 'AST-FB-1',
              tag: 'TAG-MBP-904',
              name: 'MacBook Pro 14" M3 Pro 36GB',
              category: 'Laptops',
              serial: 'C02G9988PL99',
              assignedTo: 'Priya Sharma',
              employeeId: 'PLS-1011',
              assignedDate: '08 Nov, 2026',
              condition: 'Brand New',
              status: 'Assigned',
              returnStatus: 'Not Returned',
            },
            {
              id: 'AST-FB-2',
              tag: 'TAG-MON-780',
              name: 'LG 27UK850 4K UHD Monitor',
              category: 'Monitors',
              serial: 'LG-9923481-KR',
              assignedTo: 'Unassigned',
              employeeId: null,
              assignedDate: '--',
              condition: 'Excellent',
              status: 'Available',
              returnStatus: 'Returned (Ready)',
            },
          ];

          const current = assetService.getAssets();
          // merge without duplicates
          const existingIds = new Set(current.map((a) => a.id));
          const newItems = firebaseSyncedAssets.filter((a) => !existingIds.has(a.id));
          const updated = [...newItems, ...current];
          localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));

          resolve({
            success: true,
            importedCount: newItems.length,
            totalCount: updated.length,
            message: `Successfully synchronized ${newItems.length} new asset records from Firebase database.`,
          });
        }
      }, 1400);
    });
  },
};

