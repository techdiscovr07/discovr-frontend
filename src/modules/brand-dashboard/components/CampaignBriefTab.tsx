import React from 'react';
import { Card, CardHeader, CardBody, Button, Input, TextArea, FileUpload } from '../../../components';

interface CampaignBriefTabProps {
    campaignData: any;
    isBriefEditing: boolean;
    setIsBriefEditing: (editing: boolean) => void;
    briefData: any;
    setBriefData: (data: any) => void;
    handleBriefSubmit: (e: React.FormEvent) => void;
    setSampleVideoFiles: (files: File[]) => void;
    isSubmittingBrief: boolean;
}

export const CampaignBriefTab: React.FC<CampaignBriefTabProps> = ({
    campaignData,
    isBriefEditing,
    setIsBriefEditing,
    briefData,
    setBriefData,
    handleBriefSubmit,
    setSampleVideoFiles,
    isSubmittingBrief
}) => {
    return (
        <Card className="content-card">
            <CardHeader>
                <div className="card-header-content">
                    <h3>Campaign Brief</h3>
                    {campaignData.brief_completed && !isBriefEditing && (
                        <Button size="sm" onClick={() => setIsBriefEditing(true)}>
                            Edit Brief
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardBody>
                {campaignData.brief_completed && !isBriefEditing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Video Title</p>
                            <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.video_title || '-'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Primary Focus</p>
                            <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.primary_focus || '-'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Secondary Focus</p>
                            <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.secondary_focus || '-'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Call to Action</p>
                            <p style={{ color: 'var(--color-text-primary)' }}>{campaignData.cta || '-'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Dos</p>
                            <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{campaignData.dos || '-'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Don'ts</p>
                            <p style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{campaignData.donts || '-'}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Sample Video</p>
                            {campaignData.sample_video_url ? (
                                <a
                                    href={campaignData.sample_video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                                >
                                    View sample video
                                </a>
                            ) : (
                                <p style={{ color: 'var(--color-text-primary)' }}>No sample video</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleBriefSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <Input
                            label="Video Title"
                            placeholder="e.g., Summer Launch Reel"
                            value={briefData.video_title}
                            onChange={(e: any) => setBriefData({ ...briefData, video_title: e.target.value })}
                            required
                        />
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <Input
                                label="Primary Focus"
                                placeholder="Product awareness"
                                value={briefData.primary_focus}
                                onChange={(e: any) => setBriefData({ ...briefData, primary_focus: e.target.value })}
                                required
                            />
                            <Input
                                label="Secondary Focus"
                                placeholder="Drive profile visits"
                                value={briefData.secondary_focus}
                                onChange={(e: any) => setBriefData({ ...briefData, secondary_focus: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <TextArea
                                label="Dos"
                                placeholder="Show product in first 5 seconds"
                                value={briefData.dos}
                                onChange={(e: any) => setBriefData({ ...briefData, dos: e.target.value })}
                                required
                            />
                            <TextArea
                                label="Don'ts"
                                placeholder="No competitor mention"
                                value={briefData.donts}
                                onChange={(e: any) => setBriefData({ ...briefData, donts: e.target.value })}
                                required
                            />
                        </div>
                        <Input
                            label="Call to Action"
                            placeholder="Follow @brand"
                            value={briefData.cta}
                            onChange={(e: any) => setBriefData({ ...briefData, cta: e.target.value })}
                            required
                        />
                        <Input
                            label="Sample Video URL (Optional)"
                            placeholder="https://cdn.example.com/sample.mp4"
                            value={briefData.sample_video_url}
                            onChange={(e: any) => setBriefData({ ...briefData, sample_video_url: e.target.value })}
                        />
                        <FileUpload
                            accept="video/*"
                            maxSize={50}
                            onFileSelect={(files: File[]) => setSampleVideoFiles(files)}
                            label="Sample Video File (Optional)"
                            description="Upload sample file if you don't want to use URL"
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                            {campaignData.brief_completed && (
                                <Button type="button" variant="ghost" onClick={() => setIsBriefEditing(false)}>
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" isLoading={isSubmittingBrief}>
                                {campaignData.brief_completed ? 'Update Brief' : 'Submit Brief'}
                            </Button>
                        </div>
                    </form>
                )}
            </CardBody>
        </Card>
    );
};
