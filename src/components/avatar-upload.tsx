'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

type AvatarUploadProps = {
  userId: string;
  avatarUrl: string | null;
  fallbackText: string;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
};

export function AvatarUpload({
  userId,
  avatarUrl,
  fallbackText,
  onUploaded,
  onRemoved,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const getInitials = (text: string) => {
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PNG, JPEG, and WebP images are allowed.');
      toast.error('Invalid file type');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Image must be under 2MB.');
      toast.error('File too large');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path);

      onUploaded(publicUrl);
      toast.success('Profile picture updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!avatarUrl) return;

    setUploading(true);
    try {
      const path = new URL(avatarUrl).pathname.replace(
        `/storage/v1/object/public/avatars/`,
        ''
      );

      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([path]);

      if (deleteError) throw deleteError;

      onRemoved();
      toast.success('Profile picture removed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove image';
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='flex flex-col items-center gap-3'>
      <Avatar className='h-20 w-20'>
        {avatarUrl && (
          <AvatarImage
            src={avatarUrl}
            alt='Profile'
          />
        )}
        <AvatarFallback className='text-lg'>{getInitials(fallbackText)}</AvatarFallback>
      </Avatar>

      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className='mr-2 h-4 w-4' />
          {avatarUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>

        {avatarUrl && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleRemove}
            disabled={uploading}
            className='text-destructive hover:text-destructive'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='image/png,image/jpeg,image/webp'
        onChange={handleFileChange}
        className='hidden'
        aria-label='Upload profile picture'
      />

      {error && <p className='text-destructive text-xs'>{error}</p>}
    </div>
  );
}
