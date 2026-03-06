export const DEMO_CAMPAIGN_ID = 'demo-campaign-001';

export const DEMO_CAMPAIGNS = [
    {
        id: DEMO_CAMPAIGN_ID,
        video_title: 'Discovr App Launch - Tech First Impressions',
        primary_focus: 'Highlighting the AI-powered search & matchmaking',
        secondary_focus: 'Ease of use for creators & brand discovery',
        dos: 'Show the app on a real device, be energetic and authentic',
        donts: 'Do not benchmark against competitors by name',
        cta: 'Download Discovr today from the link in my bio!',
        script_template: "Hey guys! If you're a creator looking to land brand deals, you *need* to check out the new Discovr app...",
        sample_video_url: 'https://youtube.com/shorts/sample-video',
        brand_id: 'TechDiscovr',
        description: 'We are launching the Discovr App and need top tech creators to review it.',
        creator_categories: ['Technology', 'Software', 'Gadgets'],
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
    { id: 'creator-001', name: 'Techie Tina', instagram: 'techietina_x', status: 'accepted', followers: 150000, avg_views: 45000, final_amount: 15000 },
    { id: 'creator-002', name: 'Gadget Guru', instagram: 'thegadgetguru', status: 'accepted', followers: 89000, avg_views: 22000, final_amount: 8000 },
    { id: 'creator-003', name: 'Sarah Tech', instagram: 'sarah.tech', status: 'rejected', followers: 200000, avg_views: 120000, final_amount: 0 },
    { id: 'creator-004', name: 'Review Raj', instagram: 'raj.reviews.tech', status: 'pending', followers: 350000, avg_views: 150000, final_amount: 0 },
];

export const DEMO_BIDS = [
    { creator_id: 'creator-001', proposed_amount: 15000, status: 'accepted' },
    { creator_id: 'creator-002', proposed_amount: 8000, status: 'accepted' },
    { creator_id: 'creator-003', proposed_amount: 40000, status: 'rejected' },
    { creator_id: 'creator-004', proposed_amount: 50000, status: 'pending' },
];

export const DEMO_SCRIPTS = [
    { id: 'script-001', creator_id: 'creator-001', creator_name: 'Techie Tina', script_content: "Hey everyone! Today I'm trying out the Discovr App. It uses AI to match creators with brands. I set up my profile in 2 mins, and instantly saw 5 campaigns waiting for me! Download it from my bio.", status: 'pending', script_feedback: '', ai_analysis: 'High match. The script naturally integrates the AI aspect and has a strong CTA.' },
    { id: 'script-002', creator_id: 'creator-002', creator_name: 'Gadget Guru', script_content: 'This app is pretty decent. It helps you get brand deals. Check it out.', status: 'revision_requested', script_feedback: 'Please make it more energetic and mention the AI matchmaking feature!', ai_analysis: 'Low energy. Missing key talking point: AI matchmaking.' }
];

export const DEMO_CONTENT = [
    { id: 'content-001', creator_id: 'creator-001', creator_name: 'Techie Tina', content_url: 'https://youtube.com/shorts/discovr-tina', status: 'pending', content_feedback: '', ai_analysis: 'Lighting is great. Audio is clear. The CTA is visible on screen for 4 seconds.' },
    { id: 'content-002', creator_id: 'creator-002', creator_name: 'Gadget Guru', content_url: 'https://youtube.com/shorts/guru-app', status: 'approved', content_feedback: 'Awesome energy, cleared to post.', ai_analysis: 'Very engaging. High audience retention expected.' }
];

export const DEMO_CREATOR_CAMPAIGNS = [
    {
        id: DEMO_CAMPAIGN_ID,
        title: 'Discovr App Launch - Tech First Impressions',
        brand_name: 'TechDiscovr',
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
