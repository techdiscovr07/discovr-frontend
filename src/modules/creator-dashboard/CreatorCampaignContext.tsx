import { createContext, useContext } from 'react';

const CreatorCampaignContext = createContext<any>(null);

export const CreatorCampaignProvider = CreatorCampaignContext.Provider;

export const useCreatorCampaignContext = () => {
    const context = useContext(CreatorCampaignContext);
    if (!context) {
        throw new Error('useCreatorCampaignContext must be used within a CreatorCampaignProvider');
    }
    return context;
};
