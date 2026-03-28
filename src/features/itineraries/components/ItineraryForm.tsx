import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useItineraries } from '@/features/itineraries/hooks/useItineraries';
import {
  createItinerarySchema,
  type CreateItineraryFormValues,
  type CreateItineraryValues,
} from '@/features/itineraries/schemas/create-itinerary-schema';
import type { Itinerary } from '@/features/itineraries/types/itinerary';
import { notify } from '@/lib/notify';
import { supabase } from '@/lib/supabase';

interface ItineraryFormProps {
  mode: 'create' | 'edit';
  initialValues?: Itinerary;
}

export default function ItineraryForm({
  mode,
  initialValues,
}: ItineraryFormProps) {
  const navigate = useNavigate();
  const { createItinerary, updateItinerary } = useItineraries();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateItineraryFormValues, undefined, CreateItineraryValues>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      destination: initialValues?.destination ?? '',
      startDate: initialValues?.startDate ?? '',
      endDate: initialValues?.endDate ?? '',
      travelers: initialValues?.travelers ?? 1,
      budget: initialValues?.budget,
      currency: initialValues?.currency ?? 'USD',
      coverImage: initialValues?.coverImage ?? '',
      notes: initialValues?.notes ?? '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');
      const ext = file.name.split('.').pop() ?? 'jpg';
      const filename = `${authData.user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('itinerary-covers')
        .upload(filename, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage
        .from('itinerary-covers')
        .getPublicUrl(filename);
      setValue('coverImage', publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: CreateItineraryValues) => {
    try {
      const now = new Date().toISOString();

      if (mode === 'edit' && initialValues) {
        await updateItinerary({
          ...initialValues,
          title: values.title,
          destination: values.destination,
          startDate: values.startDate,
          endDate: values.endDate,
          coverImage: values.coverImage || undefined,
          notes: values.notes || undefined,
          travelers: values.travelers,
          budget: values.budget,
          currency: values.currency || 'USD',
          updatedAt: now,
        });

        notify.success('Trip updated', {
          description: 'Your itinerary changes were saved.',
        });

        navigate(`/itinerary/${initialValues.id}`);
        return;
      }

      const created = await createItinerary({
        id: '',
        title: values.title,
        destination: values.destination,
        startDate: values.startDate,
        endDate: values.endDate,
        coverImage: values.coverImage || undefined,
        notes: values.notes || undefined,
        status: 'planning',
        travelers: values.travelers,
        budget: values.budget,
        currency: values.currency || 'USD',
        createdAt: now,
        updatedAt: now,
        items: [],
      });

      notify.success('Trip created', {
        description: 'Your new itinerary is ready to plan.',
      });

      navigate(`/itinerary/${created.id}`);
    } catch {
      notify.error('Failed to save trip', {
        description: 'Please try again.',
      });
    }
  };

  return (
    <Card className='border-slate-200 shadow-sm py-6'>
      <CardHeader>
        <CardTitle className='mb-1'>
          {mode === 'edit' ? 'Edit itinerary' : 'Create a new itinerary'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-5 md:grid-cols-2'>
            <p className='text-xs font-semibold text-flag-red-600'>
              *Required fields
            </p>
            <div className='space-y-2 md:col-span-2'>
              <Label htmlFor='title'>Trip title*</Label>
              <input
                id='title'
                {...register('title')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='e.g. Paris Adventure'
              />
              {errors.title && (
                <p className='text-sm text-flag-red-600'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className='space-y-2 md:col-span-2'>
              <Label htmlFor='destination'>Destination*</Label>
              <input
                id='destination'
                {...register('destination')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='e.g. Paris, France'
              />
              {errors.destination && (
                <p className='text-sm text-flag-red-600'>
                  {errors.destination.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='startDate'>Start date*</Label>
              <input
                id='startDate'
                type='date'
                {...register('startDate')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              />
              {errors.startDate && (
                <p className='text-sm text-flag-red-600'>
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='endDate'>End date*</Label>
              <input
                id='endDate'
                type='date'
                {...register('endDate')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              />
              {errors.endDate && (
                <p className='text-sm text-flag-red-600'>
                  {errors.endDate.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='travelers'>Travelers</Label>
              <input
                id='travelers'
                type='number'
                min={1}
                {...register('travelers')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              />
              {errors.travelers && (
                <p className='text-sm text-flag-red-600'>
                  {errors.travelers.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='budget'>Budget</Label>
              <input
                id='budget'
                type='number'
                min={0}
                step='0.01'
                {...register('budget')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='e.g. 3200'
              />
              {errors.budget && (
                <p className='text-sm text-flag-red-600'>
                  {errors.budget.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='currency'>Currency</Label>
              <input
                id='currency'
                {...register('currency')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='USD'
              />
              {errors.currency && (
                <p className='text-sm text-flag-red-600'>
                  {errors.currency.message}
                </p>
              )}
            </div>

            <div className='space-y-2 md:col-span-2'>
              <Label htmlFor='coverImage'>Cover image</Label>
              <div className='flex gap-2'>
                <input
                  id='coverImage'
                  {...register('coverImage')}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  placeholder='https://...'
                />
                <label className='flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent whitespace-nowrap'>
                  {isUploading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Upload className='h-4 w-4' />}
                  Upload
                  <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
              {uploadError && <p className='text-sm text-flag-red-600'>{uploadError}</p>}
              {errors.coverImage && (
                <p className='text-sm text-flag-red-600'>
                  {errors.coverImage.message}
                </p>
              )}
            </div>

            <div className='space-y-2 md:col-span-2'>
              <Label htmlFor='notes'>Notes</Label>
              <textarea
                id='notes'
                {...register('notes')}
                className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                placeholder='Museums, local food, walking-heavy trip...'
              />
              {errors.notes && (
                <p className='text-sm text-flag-red-600'>
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='bg-pumpkin-spice-500 hover:bg-pumpkin-spice-600'
              disabled={isSubmitting}
            >
              {mode === 'edit' ? 'Save changes' : 'Create itinerary'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
