import uniqBy from 'lodash/uniqBy';

export interface IAssetStorageItem {
  name: string;
  address: string;
  decimals: number;
}

const ASSETS_STORAGE_KEY = 'scheduleds_assets';

function getItems(): IAssetStorageItem[] {
  try {
    const rows = JSON.parse(localStorage.getItem(ASSETS_STORAGE_KEY) || '[]');
    return rows;
  } catch (e) {
    return [];
  }
}

function add(item: IAssetStorageItem): void {
  const items = getItems();
  const newItems = uniqBy([...items, item], 'address');
  storeItems(newItems);
}

function storeItems(items: IAssetStorageItem[]): void {
  localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(items));
}

const toExport = {
  add,
  getItems,
};

export default toExport;
