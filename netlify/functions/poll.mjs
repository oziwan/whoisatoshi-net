import { getStore } from '@netlify/blobs';
import { handlePoll } from '../../poll/core.mjs';

export default async request => {
    try {
        const store = getStore({
            name: 'satoshi-community-poll-v1',
            consistency: 'strong'
        });

        return await handlePoll(request, store);
    } catch {
        return Response.json(
            {
                success: false,
                message: 'Voting is temporarily unavailable. Please try again.'
            },
            {
                status: 503,
                headers: { 'Cache-Control': 'no-store' }
            }
        );
    }
};

export const config = {
    path: ['/api/poll/results', '/api/poll/vote']
};
