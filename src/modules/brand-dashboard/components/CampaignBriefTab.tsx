import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Target,
    Zap,
    CheckCircle,
    XCircle,
    Play,
    Paperclip,
    Edit3,
    AlertCircle,
    ArrowRight,
    Type,
    Link as LinkIcon,
    File as FileIcon
} from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Input, TextArea, FileUpload } from '../../../components';

interface CampaignBriefTabProps {
    campaignData: any;
    isBriefEditing: boolean;
    setIsBriefEditing: (editing: boolean) => void;
    briefData: any;
    setBriefData: (data: any) => void;
    handleBriefSubmit: (e: React.FormEvent) => void;
    setSampleVideoFiles: (files: File[]) => void;
    setBriefDocumentFiles: (files: File[]) => void;
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
    setBriefDocumentFiles,
    isSubmittingBrief
}) => {
    const briefCompleted = campaignData.brief_completed;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const renderInfoItem = (icon: any, label: string, value: string, fullWidth = false) => (
        <motion.div
            variants={itemVariants}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                padding: 'var(--space-4)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-subtle)',
                gridColumn: fullWidth ? '1 / -1' : 'auto'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-tertiary)' }}>
                {React.createElement(icon, { size: 14 })}
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <p style={{
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                margin: 0,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
            }}>{value || '-'}</p>
        </motion.div>
    );

    return (
        <Card className="content-card" style={{ overflow: 'visible' }}>
            <CardHeader style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--gradient-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-border-medium)',
                            color: 'var(--color-accent)'
                        }}>
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Campaign Brief</h3>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', margin: 0 }}>Define content requirements and strategy</p>
                        </div>
                    </div>
                    {briefCompleted && !isBriefEditing && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsBriefEditing(true)}
                            style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-2) var(--space-5)' }}
                        >
                            <Edit3 size={14} style={{ marginRight: 'var(--space-2)' }} />
                            Edit Brief
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardBody style={{ padding: 'var(--space-8)' }}>
                <AnimatePresence mode="wait">
                    {briefCompleted && !isBriefEditing ? (
                        <motion.div
                            key="view"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}
                        >
                            {/* Content Strategy Section */}
                            <section>
                                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Target size={14} />
                                    Content Strategy
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    {renderInfoItem(Type, 'Video Title', campaignData.video_title, true)}
                                    {renderInfoItem(Target, 'Primary Focus', campaignData.primary_focus)}
                                    {renderInfoItem(Zap, 'Secondary Focus', campaignData.secondary_focus)}
                                    {renderInfoItem(ArrowRight, 'Call to Action', campaignData.cta, true)}
                                </div>
                            </section>

                            {/* Guidelines Section */}
                            <section>
                                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <CheckCircle size={14} />
                                    Execution Guidelines
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    {renderInfoItem(CheckCircle, "Dos", campaignData.dos)}
                                    {renderInfoItem(XCircle, "Don'ts", campaignData.donts)}
                                </div>
                            </section>

                            {/* Attachments Section */}
                            <section>
                                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Paperclip size={14} />
                                    Attachments & Resources
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        padding: 'var(--space-4)',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--color-border-subtle)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Play size={18} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>Sample Video</p>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', margin: 0 }}>{campaignData.sample_video_url ? 'Reference visual style' : 'No reference video'}</p>
                                            </div>
                                        </div>
                                        {campaignData.sample_video_url && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(campaignData.sample_video_url, '_blank')}
                                                style={{ color: 'var(--color-accent)', padding: '0 var(--space-2)' }}
                                            >
                                                <LinkIcon size={14} />
                                            </Button>
                                        )}
                                    </div>

                                    <div style={{
                                        padding: 'var(--space-4)',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--color-border-subtle)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FileIcon size={18} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>Detailed Brief</p>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', margin: 0 }}>{campaignData.brief_document_url ? 'PDF / Doc / Excel' : 'No document uploaded'}</p>
                                            </div>
                                        </div>
                                        {campaignData.brief_document_url && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(campaignData.brief_document_url, '_blank')}
                                                style={{ color: 'var(--color-accent)', padding: '0 var(--space-2)' }}
                                            >
                                                <LinkIcon size={14} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            {campaignData.review_status !== 'creators_are_final' && !briefCompleted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: 'var(--space-4) var(--space-6)',
                                        background: 'rgba(234, 179, 8, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(234, 179, 8, 0.2)',
                                        borderRadius: 'var(--radius-xl)',
                                        marginBottom: 'var(--space-8)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-4)'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'rgba(234, 179, 8, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-warning)'
                                    }}>
                                        <AlertCircle size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 2px 0', color: 'var(--color-warning)', fontWeight: 800, fontSize: 'var(--text-sm)', letterSpacing: '-0.01em' }}>
                                            Creator Deals Not Finalized
                                        </p>
                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                                            Backend requires all creator payouts to be finalized. Head to <strong>Creators</strong> tab and click <strong>Finalize All Deals</strong> first.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleBriefSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '-var(--space-2)', color: 'var(--color-text-secondary)' }}>Content Details</h5>
                                    <Input
                                        label="Video Title"
                                        placeholder="e.g., Summer Launch Reel"
                                        value={briefData.video_title}
                                        onChange={(e: any) => setBriefData({ ...briefData, video_title: e.target.value })}
                                        leftIcon={<Type size={16} />}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <Input
                                            label="Primary Focus"
                                            placeholder="Product awareness"
                                            value={briefData.primary_focus}
                                            onChange={(e: any) => setBriefData({ ...briefData, primary_focus: e.target.value })}
                                            leftIcon={<Target size={16} />}
                                        />
                                        <Input
                                            label="Secondary Focus"
                                            placeholder="Drive profile visits"
                                            value={briefData.secondary_focus}
                                            onChange={(e: any) => setBriefData({ ...briefData, secondary_focus: e.target.value })}
                                            leftIcon={<Zap size={16} />}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <TextArea
                                            label="Dos"
                                            placeholder="Show product in first 5 seconds"
                                            value={briefData.dos}
                                            onChange={(e: any) => setBriefData({ ...briefData, dos: e.target.value })}
                                            rows={4}
                                        />
                                        <TextArea
                                            label="Don'ts"
                                            placeholder="No competitor mention"
                                            value={briefData.donts}
                                            onChange={(e: any) => setBriefData({ ...briefData, donts: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <Input
                                        label="Call to Action"
                                        placeholder="Follow @brand"
                                        value={briefData.cta}
                                        onChange={(e: any) => setBriefData({ ...briefData, cta: e.target.value })}
                                        leftIcon={<ArrowRight size={16} />}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                    <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '-var(--space-2)', color: 'var(--color-text-secondary)' }}>Media & Documentation</h5>
                                    <Input
                                        label="Sample Video URL (Optional)"
                                        placeholder="https://cdn.example.com/sample.mp4"
                                        value={briefData.sample_video_url}
                                        onChange={(e: any) => setBriefData({ ...briefData, sample_video_url: e.target.value })}
                                        leftIcon={<LinkIcon size={16} />}
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                                        <FileUpload
                                            accept="video/*"
                                            maxSize={50}
                                            onFileSelect={(files: File[]) => setSampleVideoFiles(files)}
                                            label="Or Upload Video"
                                            description="Reference visual style (Max 50MB)"
                                        />
                                        <FileUpload
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            maxSize={20}
                                            onFileSelect={(files: File[]) => setBriefDocumentFiles(files)}
                                            label="Brief Document"
                                            description="Upload PDF/Doc/Excel brief (Max 20MB)"
                                            currentFiles={campaignData.brief_document_url ? [{ name: 'Current Brief Document', url: campaignData.brief_document_url }] : []}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 'var(--space-4)',
                                    paddingTop: 'var(--space-6)',
                                    borderTop: '1px solid var(--color-border-subtle)'
                                }}>
                                    {briefCompleted && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsBriefEditing(false)}
                                            style={{ borderRadius: 'var(--radius-full)' }}
                                        >
                                            Discard Changes
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        isLoading={isSubmittingBrief}
                                        style={{ borderRadius: 'var(--radius-full)', padding: '0 var(--space-8)' }}
                                    >
                                        {briefCompleted ? 'Save Updates' : 'Publish Brief'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardBody>
        </Card>
    );
};
