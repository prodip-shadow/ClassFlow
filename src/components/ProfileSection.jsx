'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  HiOutlineUserCircle,
  HiOutlineCamera,
  HiOutlineEnvelope,
  HiOutlineIdentification,
} from 'react-icons/hi2';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';

export function ProfileSection() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || name === user.name) return;
    setSavingName(true);
    try {
      const { data } = await api.patch('/users', {
        name: name.trim(),
      });
      setUser(data);
      toast('Profile updated.', 'success');
    } catch {
      toast('Failed to update profile.', 'error');
    } finally {
      setSavingName(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const upload = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { data } = await api.patch('/users', {
        photoURL: upload.data.url,
      });
      setUser(data);
      toast('Profile photo updated.', 'success');
    } catch {
      toast('Failed to upload photo.', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div
      className="card bg-base-200 border border-base-300 shadow-sm"
      data-testid="profile-section"
    >
      <div className="card-body p-6">
        <h3 className="card-title font-heading">
          <HiOutlineUserCircle className="w-5 h-5 text-primary" />
          Your profile
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 mt-2">
          <div className="flex flex-col items-center gap-3">
            <div className="avatar">
              <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-200 ring-offset-2 overflow-hidden">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 flex items-center justify-center">
                    <HiOutlineUserCircle className="w-16 h-16 text-muted" />
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              data-testid="upload-photo-btn"
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Uploading...
                </>
              ) : (
                <>
                  <HiOutlineCamera className="w-4 h-4" />
                  Change photo
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </div>
          <div className="flex-1 space-y-4">
            <form onSubmit={handleNameSave} className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <HiOutlineIdentification className="w-4 h-4" /> Display name
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered bg-base-300 border-base-300 focus:border-primary"
                  data-testid="input-name"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <HiOutlineEnvelope className="w-4 h-4" /> Email
                  </span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="input input-bordered bg-base-300 border-base-300 opacity-70"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <div>
                  <span className="badge badge-primary capitalize text-sm py-3 px-4">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={
                  savingName || name.trim() === user.name || !name.trim()
                }
                className="btn btn-primary"
                data-testid="save-name-btn"
              >
                {savingName ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />{' '}
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
