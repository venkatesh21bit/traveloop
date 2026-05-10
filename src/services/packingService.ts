import { supabase } from '@/db/supabase';
import type { PackingList, PackingItem } from '@/types/types';

// Fetch packing list for a trip
export async function fetchPackingList(tripId: string): Promise<PackingList | null> {
  const { data, error } = await supabase
    .from('packing_lists')
    .select(`
      *,
      items:packing_items(*)
    `)
    .eq('trip_id', tripId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Create packing list
export async function createPackingList(tripId: string): Promise<PackingList> {
  const { data, error } = await supabase
    .from('packing_lists')
    .insert({ trip_id: tripId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Add packing item
export async function addPackingItem(data: {
  packingListId: string;
  name: string;
  category: string;
  order: number;
}): Promise<PackingItem> {
  const { data: item, error } = await supabase
    .from('packing_items')
    .insert({
      packing_list_id: data.packingListId,
      name: data.name,
      category: data.category,
      is_packed: false,
      item_order: data.order,
    })
    .select()
    .single();

  if (error) throw error;
  return item;
}

// Update packing item
export async function updatePackingItem(
  id: string,
  data: Partial<{
    name: string;
    category: string;
    isPacked: boolean;
    order: number;
  }>
): Promise<void> {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.isPacked !== undefined) updateData.is_packed = data.isPacked;
  if (data.order !== undefined) updateData.item_order = data.order;

  const { error } = await supabase
    .from('packing_items')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

// Delete packing item
export async function deletePackingItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('packing_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Toggle packed status
export async function togglePackedStatus(id: string, isPacked: boolean): Promise<void> {
  const { error } = await supabase
    .from('packing_items')
    .update({ is_packed: isPacked })
    .eq('id', id);

  if (error) throw error;
}

// Get packing progress
export async function getPackingProgress(packingListId: string): Promise<{
  total: number;
  packed: number;
  percentage: number;
}> {
  const { data, error } = await supabase
    .from('packing_items')
    .select('is_packed')
    .eq('packing_list_id', packingListId);

  if (error) throw error;

  const total = data?.length || 0;
  const packed = data?.filter((item) => item.is_packed).length || 0;
  const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;

  return { total, packed, percentage };
}

// Reset all items to unpacked
export async function resetPackingList(packingListId: string): Promise<void> {
  const { error } = await supabase
    .from('packing_items')
    .update({ is_packed: false })
    .eq('packing_list_id', packingListId);

  if (error) throw error;
}

// Create default packing items
export async function createDefaultPackingItems(packingListId: string): Promise<void> {
  const defaultItems = [
    // Clothing
    { name: 'T-shirts', category: 'clothing', order: 0 },
    { name: 'Pants/Jeans', category: 'clothing', order: 1 },
    { name: 'Underwear', category: 'clothing', order: 2 },
    { name: 'Socks', category: 'clothing', order: 3 },
    { name: 'Shoes', category: 'clothing', order: 4 },
    { name: 'Jacket', category: 'clothing', order: 5 },
    
    // Electronics
    { name: 'Phone', category: 'electronics', order: 6 },
    { name: 'Charger', category: 'electronics', order: 7 },
    { name: 'Camera', category: 'electronics', order: 8 },
    { name: 'Power Bank', category: 'electronics', order: 9 },
    
    // Documents
    { name: 'Passport', category: 'documents', order: 10 },
    { name: 'ID Card', category: 'documents', order: 11 },
    { name: 'Travel Insurance', category: 'documents', order: 12 },
    { name: 'Tickets', category: 'documents', order: 13 },
    
    // Toiletries
    { name: 'Toothbrush', category: 'toiletries', order: 14 },
    { name: 'Toothpaste', category: 'toiletries', order: 15 },
    { name: 'Shampoo', category: 'toiletries', order: 16 },
    { name: 'Sunscreen', category: 'toiletries', order: 17 },
    
    // Miscellaneous
    { name: 'Medications', category: 'miscellaneous', order: 18 },
    { name: 'First Aid Kit', category: 'miscellaneous', order: 19 },
    { name: 'Snacks', category: 'miscellaneous', order: 20 },
  ];

  const items = defaultItems.map((item) => ({
    packing_list_id: packingListId,
    name: item.name,
    category: item.category,
    is_packed: false,
    item_order: item.order,
  }));

  const { error } = await supabase.from('packing_items').insert(items);

  if (error) throw error;
}
