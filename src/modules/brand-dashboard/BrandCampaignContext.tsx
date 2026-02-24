import { createContext, useContext } from 'react';

const BrandCampaignContext = createContext<any>(null);

export const useBrandCampaignContext = () => {
    const context = useContext(BrandCampaignContext);
    if (!context) {
        throw new Error('useBrandCampaignContext must be used within a BrandCampaignProvider');
    }
    return context;
};

export const BrandCampaignProvider = ({ children, value }: { children: React.ReactNode, value: any }) => {
    return (
        <BrandCampaignContext.Provider value={value}>
            {children}
        </BrandCampaignContext.Provider>
    );
};
