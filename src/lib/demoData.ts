export const DEMO_CAMPAIGN_ID = 'demo-campaign-001';

export const DEMO_CAMPAIGNS = [
    {
        id: DEMO_CAMPAIGN_ID,
        title: "L'Oreal Paris - Hyaluronic Acid Serum Launch",
        name: "L'Oreal Paris - Hyaluronic Acid Serum Launch",
        video_title: "L'Oreal Paris - Hyaluronic Acid Serum Launch",
        brand: "L'Oreal Paris",
        primary_focus: 'Highlight the instant hydration and skin plumping effect',
        secondary_focus: 'Showcase the lightweight, non-sticky texture',
        dos: 'Show real before/after, apply on damp skin, be authentic about results',
        donts: 'Do not use smoothing filters, do not compare directly to competitor brands by name',
        cta: 'Click the link in my bio to get your L\'Oreal Paris Serum today!',
        script_template: "Hey guys! If you struggle with dry or dull skin, you *need* to see this. I've been using the new L'Oreal Paris Hyaluronic Acid Serum...",
        sample_video_url: 'https://youtube.com/shorts/loreal-sample-video',
        brand_id: "L'Oreal Paris",
        description: 'We are launching our new 1.5% Pure Hyaluronic Acid Serum. We are looking for beauty and skincare creators to showcase authentic, unfiltered results.',
        creator_categories: ['Beauty', 'Skincare', 'Lifestyle'],
        total_budget: 500000,
        creator_count: 5,
        go_live_date: '2026-04-01T00:00:00Z',
        status: 'content_review',
        brief_completed: true,
        review_status: 'creators_are_final',
        follower_ranges: ['50000-100000', '100000-500000']
    }
];

export const DEMO_CREATORS = [
    { id: 'creator-001', name: 'Glamour Grace', instagram: 'glamour.grace', status: 'accepted', followers: 150000, avg_views: 45000, final_amount: 15000 },
    { id: 'creator-002', name: 'Skincare Sam', instagram: 'skincarebysam', status: 'accepted', followers: 89000, avg_views: 22000, final_amount: 8000 },
    { id: 'creator-003', name: 'Bella Beauty', instagram: 'bella.glow', status: 'rejected', followers: 200000, avg_views: 120000, final_amount: 0 },
    { id: 'creator-004', name: 'Review Raj', instagram: 'raj.lifestyle', status: 'pending', followers: 350000, avg_views: 150000, final_amount: 0 },
];

export const DEMO_BIDS = [
    { creator_id: 'creator-001', proposed_amount: 15000, status: 'accepted' },
    { creator_id: 'creator-002', proposed_amount: 8000, status: 'accepted' },
    { creator_id: 'creator-003', proposed_amount: 40000, status: 'rejected' },
    { creator_id: 'creator-004', proposed_amount: 50000, status: 'pending' },
];

export const DEMO_SCRIPTS = [
    { id: 'script-001', creator_id: 'creator-001', creator_name: 'Glamour Grace', script_content: "Hey everyone! Today I'm trying out the new L'Oreal Serum. Look at that instant hydration! It absorbs in seconds. You can get yours from the link in my bio.", status: 'pending', script_feedback: '', ai_analysis: 'High match. The script naturally details the product benefits and has a strong CTA.' },
    { id: 'script-002', creator_id: 'creator-002', creator_name: 'Skincare Sam', script_content: 'This serum is pretty decent. It helps with dryness. Check it out.', status: 'revision_requested', script_feedback: 'Please make it more energetic and mention the specific 1.5% Hyaluronic Acid formula!', ai_analysis: 'Low energy. Missing key talking point: 1.5% formula and plumping effect.' }
];

export const DEMO_CONTENT = [
    { id: 'content-001', creator_id: 'creator-001', creator_name: 'Glamour Grace', content_url: 'https://youtube.com/shorts/glamour-loreal', status: 'pending', content_feedback: '', ai_analysis: 'Lighting is great. Product texture is clearly shown. The CTA is visible on screen for 4 seconds.' },
    { id: 'content-002', creator_id: 'creator-002', creator_name: 'Skincare Sam', content_url: 'https://youtube.com/shorts/sam-skincare', status: 'approved', content_feedback: 'Awesome energy, clear skin texture shown. Cleared to post.', ai_analysis: 'Very engaging. High audience retention expected.' }
];

export const DEMO_CREATOR_CAMPAIGNS = [
    {
        id: DEMO_CAMPAIGN_ID,
        title: "L'Oreal Paris - Hyaluronic Acid Serum Launch",
        brand_name: "L'Oreal Paris",
        status: 'content_review',
        amount: 15000,
        go_live_date: '2026-04-01T00:00:00Z',
        creator_status: 'accepted',
        match_score: 95
    }
];

export const DEMO_CREATOR_BID_STATUS = {
    campaign_id: DEMO_CAMPAIGN_ID,
    status: 'accepted',
    proposed_amount: 15000,
    counter_amount: 15000,
    brand_action: 'accept'
};
