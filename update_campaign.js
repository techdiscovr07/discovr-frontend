const fs = require('fs');
const filePath = 'src/modules/brand-dashboard/CampaignDetails.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the modals and insert <BrandCampaignModals />
const startToken = '{/* Upload Creators Sheet Modal */}';
const endToken = '{/* Tab Content */}';
const startIdx = content.indexOf(startToken);
const endIdx = content.indexOf(endToken);

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + '<BrandCampaignModals />\n\n                ' + content.substring(endIdx);
} else {
    console.error('Could not find modal section');
    process.exit(1);
}

// 2. Wrap the return statement with BrandCampaignProvider
const defineContextValue = `
    const contextValue = {
        isUploadSheetModalOpen, setIsUploadSheetModalOpen,
        creatorsSheetFile, setCreatorsSheetFile,
        handleUploadCreatorsSheet, isUploadingSheet,
        isBriefModalOpen, setIsBriefModalOpen,
        briefData, setBriefData,
        handleBriefSubmit, setSampleVideoFiles, isSubmittingBrief,
        isScriptTemplateModalOpen, setIsScriptTemplateModalOpen,
        brandScriptTemplate, setBrandScriptTemplate,
        handleScriptTemplateSubmit, isSubmittingScriptTemplate,
        isAIReviewOpen, setIsAIReviewOpen,
        selectedScript, aiComment, setAiComment,
        handleSubmitAIReview, isSubmittingAIReview,
        isAIAnalyzing, analysisProgress,
        isAIContentReviewOpen, setIsAIContentReviewOpen,
        selectedContentItem, contentAiComment, setContentAiComment,
        handleSubmitAIContentReview, isSubmittingAIContentReview,
        isAIContentAnalyzing, contentAnalysisProgress,
        isCounterModalOpen, setIsCounterModalOpen,
        counterBid, setCounterBid, counterAmount, setCounterAmount,
        handleSubmitCounter, isSubmittingCounter,
        isEditFollowerRangesModalOpen, setIsEditFollowerRangesModalOpen,
        selectedFollowerRanges, setSelectedFollowerRanges,
        followerRangeOptions, handleUpdateFollowerRanges, isUpdatingFollowerRanges
    };

    return (
        <BrandCampaignProvider value={contextValue}>`;

content = content.replace('    return (\n        <div className="dashboard"', defineContextValue + '\n        <div className="dashboard"');
content = content.replace('        </div>\n    );\n};', '        </div>\n        </BrandCampaignProvider>\n    );\n};');

// 3. Add imports at the top
const importsToAdd = `import { BrandCampaignProvider } from './BrandCampaignContext';\nimport { BrandCampaignModals } from './components/BrandCampaignModals';\n`;
content = importsToAdd + content;

fs.writeFileSync(filePath, content);
console.log('Update successful!');
