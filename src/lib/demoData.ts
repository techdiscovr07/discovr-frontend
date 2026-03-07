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
    },
    {
        id: 'demo-campaign-002',
        title: "L'Oreal Paris - Infallible Matte Resistance Lipstick",
        name: "L'Oreal Paris - Infallible Matte Resistance Lipstick",
        video_title: "Infallible Matte Resistance Lipstick Launch",
        brand: "L'Oreal Paris",
        primary_focus: 'Test the 16HR wear and transfer-proof claim',
        secondary_focus: 'Show the intense color payoff in one swipe',
        dos: 'Do a transfer test (kiss test/coffee cup test), show application',
        donts: 'Do not use lip liner from other brands to avoid mixed results',
        cta: 'Check the link in my bio to find your perfect Infallible shade!',
        script_template: "Looking for a lipstick that actually stays? I've been testing the new L'Oreal Paris Infallible Matte Resistance...",
        sample_video_url: '',
        brand_id: "L'Oreal Paris",
        description: 'Launching our new 16HR wear liquid lipstick. We want creators to put its transfer-proof claims to the ultimate test.',
        creator_categories: ['Beauty', 'Makeup', 'Lifestyle'],
        total_budget: 350000,
        creator_count: 8,
        go_live_date: '2026-05-15T00:00:00Z',
        status: 'draft',
        brief_completed: false,
        review_status: 'planning',
        follower_ranges: ['10000-50000', '50000-100000']
    },
    {
        id: 'demo-campaign-003',
        title: "L'Oreal Paris - Elvive Dream Lengths Shampoo",
        name: "L'Oreal Paris - Elvive Dream Lengths Shampoo",
        video_title: "Elvive Dream Lengths Hair Care Routine",
        brand: "L'Oreal Paris",
        primary_focus: 'Highlight how it seals split ends and saves last 3cm',
        secondary_focus: 'Show the creamy texture and talk about the scent',
        dos: 'Show the ends of your hair before and after, massage into scalp',
        donts: 'Do not wear hats or heavy hair accessories in the video',
        cta: 'Click my link to get the Elvive Dream Lengths system!',
        script_template: "If you're trying to grow your hair out but struggling with split ends, this is for you. The L'Oreal Paris Elvive Dream Lengths...",
        sample_video_url: '',
        brand_id: "L'Oreal Paris",
        description: 'Promoting our iconic Elvive Dream Lengths line for long, damaged hair. We want to see your hair washing routines.',
        creator_categories: ['Haircare', 'Beauty', 'Lifestyle'],
        total_budget: 200000,
        creator_count: 4,
        go_live_date: '2026-06-01T00:00:00Z',
        status: 'active',
        brief_completed: true,
        review_status: 'creators_in_progress',
        follower_ranges: ['50000-100000']
    }
];

export const DEMO_CREATORS = [
    { id: 'creator-001', name: 'Glamour Grace', instagram: 'glamour.grace', status: 'active', followers: 150000, avg_views: 45000, final_amount: 15000 },
    { id: 'creator-002', name: 'Skincare Sam', instagram: 'skincarebysam', status: 'active', followers: 89000, avg_views: 22000, final_amount: 8000 },
    { id: 'creator-003', name: 'Bella Beauty', instagram: 'bella.glow', status: 'rejected', followers: 200000, avg_views: 120000, final_amount: 0 },
    { id: 'creator-004', name: 'Review Raj', instagram: 'raj.lifestyle', status: 'pending', followers: 350000, avg_views: 150000, final_amount: 0 },
    { id: 'creator-005', name: 'Fashion Fiona', instagram: 'fiona.fits', status: 'active', followers: 125000, avg_views: 65000, final_amount: 12000 },
    { id: 'creator-006', name: 'Tech Tom', instagram: 'tom.tech', status: 'pending', followers: 45000, avg_views: 15000, final_amount: 0 },
    { id: 'creator-007', name: 'Healthy Hanna', instagram: 'hanna.health', status: 'active', followers: 210000, avg_views: 95000, final_amount: 20000 },
    { id: 'creator-008', name: 'Travel Tyler', instagram: 'tyler.travels', status: 'active', followers: 95000, avg_views: 40000, final_amount: 10000 },
    { id: 'creator-009', name: 'Makeup Maya', instagram: 'maya.makeup', status: 'pending', followers: 600000, avg_views: 280000, final_amount: 0 },
    { id: 'creator-010', name: 'Gamer Gabe', instagram: 'gabe.games', status: 'rejected', followers: 80000, avg_views: 35000, final_amount: 0 },
];

export const DEMO_BIDS = [
    { creator_id: 'creator-001', proposed_amount: 15000, status: 'accepted' },
    { creator_id: 'creator-002', proposed_amount: 8000, status: 'accepted' },
    { creator_id: 'creator-003', proposed_amount: 40000, status: 'rejected' },
    { creator_id: 'creator-004', proposed_amount: 50000, status: 'pending' },
    { creator_id: 'creator-005', proposed_amount: 12000, status: 'accepted' },
    { creator_id: 'creator-006', proposed_amount: 5000, status: 'pending' },
    { creator_id: 'creator-007', proposed_amount: 20000, status: 'accepted' },
    { creator_id: 'creator-008', proposed_amount: 10000, status: 'accepted' },
    { creator_id: 'creator-009', proposed_amount: 85000, status: 'pending' },
    { creator_id: 'creator-010', proposed_amount: 15000, status: 'rejected' },
];

export const DEMO_SCRIPTS = [
    { id: 'script-001', creator_id: 'creator-001', creator_name: 'Glamour Grace', script_content: "Hey everyone! Today I'm trying out the new L'Oreal Serum. Look at that instant hydration! It absorbs in seconds. You can get yours from the link in my bio.", status: 'pending', script_feedback: '', ai_analysis: 'High match. The script naturally details the product benefits and has a strong CTA.' },
    { id: 'script-002', creator_id: 'creator-002', creator_name: 'Skincare Sam', script_content: 'This serum is pretty decent. It helps with dryness. Check it out.', status: 'revision_requested', script_feedback: 'Please make it more energetic and mention the specific 1.5% Hyaluronic Acid formula!', ai_analysis: 'Low energy. Missing key talking point: 1.5% formula and plumping effect.' },
    { id: 'script-003', creator_id: 'creator-005', creator_name: 'Fashion Fiona', script_content: "Style meets skincare! Using the L'Oreal serum as a primer today for that glowy base. #SkincareRoutine #Glow", status: 'approved', script_feedback: '', ai_analysis: 'Creative integration with fashion. Good usage of product benefits for makeup prep.' },
    { id: 'script-004', creator_id: 'creator-007', creator_name: 'Healthy Hanna', script_content: "Hydration is key for recovery. This L'Oreal serum is a lifesaver after my morning workouts. #HealthySkin", status: 'pending', script_feedback: '', ai_analysis: 'Strong wellness angle. Clear focus on hydration.' },
];

export const DEMO_CONTENT = [
    { id: 'content-001', creator_id: 'creator-001', creator_name: 'Glamour Grace', content_url: 'https://youtube.com/shorts/glamour-loreal', status: 'pending', content_feedback: '', ai_analysis: 'Lighting is great. Product texture is clearly shown. The CTA is visible on screen for 4 seconds.' },
    { id: 'content-002', creator_id: 'creator-002', creator_name: 'Skincare Sam', content_url: 'https://youtube.com/shorts/sam-skincare', status: 'approved', content_feedback: 'Awesome energy, clear skin texture shown. Cleared to post.', ai_analysis: 'Very engaging. High audience retention expected.' },
    { id: 'content-003', creator_id: 'creator-005', creator_name: 'Fashion Fiona', content_url: 'https://youtube.com/shorts/fiona-fashion-loreal', status: 'pending', content_feedback: '', ai_analysis: 'Elegant framing. The product packaging is presented prominently.' },
];

export const DEMO_CREATOR_CAMPAIGNS = [
    {
        id: DEMO_CAMPAIGN_ID,
        name: "L'Oreal Paris - Hyaluronic Acid Serum Launch",
        brand: "L'Oreal Paris",
        status: 'content_review',
        amount: 15000,
        deadline: '2026-04-01T00:00:00Z',
        go_live_date: '2026-04-01T00:00:00Z',
        creator_status: 'accepted',
        match_score: 95,
        description: 'Launching our new 1.5% Pure Hyaluronic Acid Serum. We are looking for beauty and skincare creators to showcase authentic, unfiltered results.',
        requirements: ["3 Instagram Reels", "2 Stories", "1 Post"],
        stage: 'content'
    },
    {
        id: 'demo-campaign-002',
        name: "L'Oreal Paris - Infallible Matte Lipstick",
        brand: "L'Oreal Paris",
        status: 'negotiation',
        amount: 8000,
        deadline: '2026-05-15T00:00:00Z',
        go_live_date: '2026-05-15T00:00:00Z',
        creator_status: 'negotiate',
        match_score: 88,
        description: 'Testing the 16HR wear and transfer-proof claim of our new liquid lipstick. Show the intense color payoff in one swipe.',
        requirements: ["1 Instagram Reel", "1 Story"],
        stage: 'negotiate'
    },
    {
        id: 'demo-campaign-003',
        name: "L'Oreal Paris - Elvive Dream Lengths",
        brand: "L'Oreal Paris",
        status: 'script_pending',
        amount: 12000,
        deadline: '2026-06-01T00:00:00Z',
        go_live_date: '2026-06-01T00:00:00Z',
        creator_status: 'amount_finalized',
        match_score: 91,
        description: 'Promoting our iconic Elvive Dream Lengths line. Highlight how it seals split ends and save your last 3cm!',
        requirements: ["2 Instagram Reels", "1 Story"],
        stage: 'script'
    }
];

export const DEMO_CREATOR_BID_STATUS = {
    campaign_id: DEMO_CAMPAIGN_ID,
    status: 'accepted',
    proposed_amount: 15000,
    counter_amount: 15000,
    brand_action: 'accept'
};
