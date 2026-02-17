import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Input, TextArea, LoadingSpinner } from '../components';
import { ArrowLeft, User, Mail, Building2, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile, updateProfile, uploadAvatar } from '../lib/api';
import './Profile.css';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        location: '',
        website: '',
        instagram: '',
        youtube: '',
        tiktok: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const profileData: any = await getUserProfile();
                setFormData({
                    name: profileData.name || user?.displayName || '',
                    email: profileData.email || user?.email || '',
                    bio: profileData.bio || '',
                    location: profileData.location || '',
                    website: profileData.website || '',
                    instagram: profileData.instagram || '',
                    youtube: profileData.youtube || '',
                    tiktok: profileData.tiktok || ''
                });
            } catch (error: any) {
                console.error('Failed to load profile:', error);
                showToast('Failed to load profile', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [user, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Upload avatar if selected
            if (avatarFile.length > 0) {
                await uploadAvatar(avatarFile[0]);
            }

            // Update profile
            await updateProfile(formData);
            await refreshProfile();
            showToast('Profile updated successfully!', 'success');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            showToast(error.message || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const isCreator = profile?.role === 'creator';
    const isBrand = profile?.role === 'brand_owner' || profile?.role === 'brand_emp';

    return (
        <div className="dashboard" style={{ background: 'var(--color-bg-primary)' }}>
            <main className="dashboard-main" style={{ marginLeft: 0, width: '100%', margin: '0 auto' }}>
                <header className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </Button>
                        <h1 className="dashboard-title">Profile</h1>
                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        {/* Avatar Section */}
                        <Card>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            background: 'var(--color-accent)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '48px',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            border: '4px solid var(--color-border-subtle)'
                                        }}>
                                            {user?.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt="Avatar"
                                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                (formData.name || user?.email || 'U').charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <label style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            background: 'var(--color-accent)',
                                            borderRadius: '50%',
                                            width: 36,
                                            height: 36,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '3px solid var(--color-bg-primary)'
                                        }}>
                                            <Camera size={18} color="white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setAvatarFile([file]);
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {avatarFile.length > 0 && (
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                            {avatarFile[0].name} selected
                                        </p>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <h3>Basic Information</h3>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <Input
                                        label="Name"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        leftIcon={<User size={18} />}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        leftIcon={<Mail size={18} />}
                                        required
                                        disabled
                                    />
                                    <TextArea
                                        label="Bio"
                                        placeholder="Tell us about yourself..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                    />
                                    <Input
                                        label="Location"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                    <Input
                                        label="Website"
                                        placeholder="https://yourwebsite.com"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Social Media (for Creators) */}
                        {isCreator && (
                            <Card>
                                <CardHeader>
                                    <h3>Social Media</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        <Input
                                            label="Instagram"
                                            placeholder="@yourhandle"
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                        <Input
                                            label="YouTube"
                                            placeholder="Channel URL or handle"
                                            value={formData.youtube}
                                            onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                                        />
                                        <Input
                                            label="TikTok"
                                            placeholder="@yourhandle"
                                            value={formData.tiktok}
                                            onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Brand Information (for Brands) */}
                        {isBrand && (
                            <Card>
                                <CardHeader>
                                    <h3>Brand Information</h3>
                                </CardHeader>
                                <CardBody>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        <Input
                                            label="Company Name"
                                            placeholder="Your company name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            leftIcon={<Building2 size={18} />}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                            <Button variant="ghost" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isSaving} leftIcon={<Save size={18} />}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};
