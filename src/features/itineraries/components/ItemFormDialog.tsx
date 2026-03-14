import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  ItineraryItem,
  ItineraryItemType,
} from '@/features/itineraries/types/itinerary';

type ItemFormValues = {
  title: string;
  description: string;
  type: ItineraryItemType;
  time: string;
  location: string;
  reservationNumber: string;
  cost: string;
  notes: string;
};

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    title: string;
    description?: string;
    type: ItineraryItemType;
    time?: string;
    location?: string;
    reservationNumber?: string;
    cost?: number;
    notes?: string;
  }) => void;
  editItem?: ItineraryItem | null;
  isSaving?: boolean;
}

const itemTypes: { value: ItineraryItemType; label: string }[] = [
  { value: 'attraction', label: 'Attraction' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'transport', label: 'Transport' },
  { value: 'flight', label: 'Flight' },
  { value: 'activity', label: 'Activity' },
  { value: 'other', label: 'Other' },
];

type ItemTemplate = {
  key: string;
  label: string;
  values: Partial<ItemFormValues>;
};

const itemTemplates: ItemTemplate[] = [
  {
    key: 'flight',
    label: 'Flight',
    values: {
      title: 'Flight',
      type: 'flight',
      description: 'Flight details and airport transfer.',
      reservationNumber: '',
      cost: '',
      location: '',
      notes: '',
      time: '',
    },
  },
  {
    key: 'hotel',
    label: 'Hotel',
    values: {
      title: 'Hotel Check-in',
      type: 'hotel',
      description: 'Hotel stay or check-in details.',
      reservationNumber: '',
      cost: '',
      location: '',
      notes: '',
      time: '',
    },
  },
  {
    key: 'restaurant',
    label: 'Restaurant',
    values: {
      title: 'Dinner Reservation',
      type: 'restaurant',
      description: 'Meal reservation or dining plan.',
      reservationNumber: '',
      cost: '',
      location: '',
      notes: '',
      time: '',
    },
  },
  {
    key: 'attraction',
    label: 'Attraction',
    values: {
      title: 'Visit Attraction',
      type: 'attraction',
      description: 'Sightseeing or landmark visit.',
      reservationNumber: '',
      cost: '',
      location: '',
      notes: '',
      time: '',
    },
  },
  {
    key: 'transport',
    label: 'Transport',
    values: {
      title: 'Transportation',
      type: 'transport',
      description: 'Train, metro, taxi, or transfer.',
      reservationNumber: '',
      cost: '',
      location: '',
      notes: '',
      time: '',
    },
  },
  {
    key: 'custom',
    label: 'Custom',
    values: {
      title: '',
      type: 'activity',
      description: '',
      reservationNumber: '',
      cost: '',
      location: '',
      notes: '',
      time: '',
    },
  },
];

function getInitialForm(editItem?: ItineraryItem | null): ItemFormValues {
  if (!editItem) {
    return {
      title: '',
      description: '',
      type: 'attraction',
      time: '',
      location: '',
      reservationNumber: '',
      cost: '',
      notes: '',
    };
  }

  return {
    title: editItem.title ?? '',
    description: editItem.description ?? '',
    type: editItem.type ?? 'attraction',
    time: editItem.time ?? '',
    location: editItem.location ?? '',
    reservationNumber: editItem.reservationNumber ?? '',
    cost: editItem.cost != null ? String(editItem.cost) : '',
    notes: editItem.notes ?? '',
  };
}

function ItemFormInner({
  onOpenChange,
  onSubmit,
  editItem,
  isSaving = false,
}: Omit<ItemFormDialogProps, 'open'>) {
  const [form, setForm] = useState<ItemFormValues>(() =>
    getInitialForm(editItem),
  );

  const applyTemplate = (template: ItemTemplate) => {
    setForm((prev) => ({
      ...prev,
      ...template.values,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      title: form.title,
      description: form.description || undefined,
      type: form.type,
      time: form.time || undefined,
      location: form.location || undefined,
      reservationNumber: form.reservationNumber || undefined,
      cost: form.cost ? Number(form.cost) : undefined,
      notes: form.notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Quick Templates */}
      {!editItem ? (
        <div className='space-y-2'>
          <Label>Quick templates</Label>

          <div className='flex flex-wrap gap-2'>
            {itemTemplates.map((template) => (
              <Button
                key={template.key}
                type='button'
                variant='outline'
                size='sm'
                onClick={() => applyTemplate(template)}
                className='rounded-full'
              >
                {template.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
      {/* Form */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='col-span-2 space-y-1.5'>
          <Label htmlFor='item-title'>Title *</Label>
          <input
            id='item-title'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder='e.g. Visit Eiffel Tower'
            required
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
          />
        </div>

        <div className='space-y-1.5'>
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(value) =>
              setForm({ ...form, type: value as ItineraryItemType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='item-time'>Time</Label>
          <input
            id='item-time'
            type='time'
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
          />
        </div>

        <div className='col-span-2 space-y-1.5'>
          <Label htmlFor='item-location'>Location</Label>
          <input
            id='item-location'
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder='Address or location name'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
          />
        </div>

        <div className='col-span-2 space-y-1.5'>
          <Label htmlFor='item-description'>Description</Label>
          <Textarea
            id='item-description'
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder='Details about this activity...'
            rows={2}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='item-reservation'>Reservation #</Label>
          <input
            id='item-reservation'
            value={form.reservationNumber}
            onChange={(e) =>
              setForm({ ...form, reservationNumber: e.target.value })
            }
            placeholder='Confirmation number'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='item-cost'>Cost</Label>
          <input
            id='item-cost'
            type='number'
            min='0'
            step='0.01'
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            placeholder='0.00'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
          />
        </div>

        <div className='col-span-2 space-y-1.5'>
          <Label htmlFor='item-notes'>Notes</Label>
          <Textarea
            id='item-notes'
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder='Any additional notes...'
            rows={2}
          />
        </div>
      </div>

      <DialogFooter className=''>
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={isSaving}
          className='bg-slate-800 hover:bg-slate-900'
        >
          {isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
          {editItem ? 'Update' : 'Add Item'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function ItemFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editItem,
  isSaving = false,
}: ItemFormDialogProps) {
  const formKey = editItem?.id ?? 'new';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-lg overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {editItem ? 'Edit Item' : 'Add to Itinerary'}
          </DialogTitle>
        </DialogHeader>

        {open ? (
          <ItemFormInner
            key={formKey}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
            editItem={editItem}
            isSaving={isSaving}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
