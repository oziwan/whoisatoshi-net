
import { createHash } from 'node:crypto';

const candidates = [
    'Hal Finney',
    'Nick Szabo',
    'Adam Back',
    'Len Sassaman',
    'A Group (Collective)',
    'Still Unknown'
];

function emptyState() {
    return {
        version: 1,
        counts: Object.fromEntries(candidates.map(name => [name, 0])),
        voters: {},
        updatedAt: null
    };
}

function reply(body, status = 200) {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
        }
    });
}

function validateState(state) {
    if (
        state?.version !== 1 ||
        !state.voters ||
        !state.counts ||
        candidates.some(name =>
            !Number.isSafeInteger(state.counts[name]) ||
            state.counts[name] < 0
        )
    ) {
        throw new Error('Invalid poll state');
    }

    const total = Object.values(state.counts)
        .reduce((sum, count) => sum + count, 0);

    if (total !== Object.keys(state.voters).length) {
        throw new Error('Inconsistent poll state');
    }

    return state;
}

function results(state) {
    return {
        success: true,
        counts: state.counts,
        total_votes: Object.values(state.counts)
            .reduce((sum, count) => sum + count, 0),
        last_updated: state.updatedAt
    };
}

export async function handlePoll(request, store) {
    const url = new URL(request.url);

    if (url.pathname === '/api/poll/results') {
        if (request.method !== 'GET') {
            return reply({ success: false, message: 'Method not allowed.' }, 405);
        }

        try {
            const snapshot = await store.getWithMetadata('state-v1', {
                type: 'json',
                consistency: 'strong'
            });

            const state = snapshot
                ? validateState(snapshot.data)
                : emptyState();

            return reply(results(state));
        } catch {
            return reply({
                success: false,
                message: 'Results are temporarily unavailable. Please try again.'
            }, 503);
        }
    }

    if (url.pathname !== '/api/poll/vote') {
        return reply({ success: false, message: 'Not found.' }, 404);
    }

    if (request.method !== 'POST') {
        return reply({ success: false, message: 'Method not allowed.' }, 405);
    }

    if (request.headers.get('origin') !== url.origin) {
        return reply({
            success: false,
            message: 'Please vote from this website.'
        }, 403);
    }

    if (!request.headers.get('content-type')?.startsWith('application/json')) {
        return reply({ success: false, message: 'JSON required.' }, 415);
    }

    let input;

    try {
        const body = await request.text();

        if (body.length > 1024) {
            return reply({ success: false, message: 'Request too large.' }, 413);
        }

        input = JSON.parse(body);
    } catch {
        return reply({ success: false, message: 'Invalid request.' }, 400);
    }

    const validId =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (
        !input ||
        !candidates.includes(input.candidate) ||
        typeof input.voterId !== 'string' ||
        !validId.test(input.voterId)
    ) {
        return reply({
            success: false,
            message: 'Please select a valid candidate.'
        }, 400);
    }

    const voterKey = createHash('sha256')
        .update(input.voterId)
        .digest('hex');

    try {
        for (let attempt = 0; attempt < 12; attempt++) {
            const snapshot = await store.getWithMetadata('state-v1', {
                type: 'json',
                consistency: 'strong'
            });

            const state = snapshot
                ? validateState(snapshot.data)
                : emptyState();

            if (Object.hasOwn(state.voters, voterKey)) {
                return reply({
                    success: false,
                    code: 'ALREADY_VOTED',
                    message: 'This browser has already voted.'
                }, 409);
            }

            if (Object.keys(state.voters).length >= 50000) {
                return reply({
                    success: false,
                    message: 'Voting is temporarily paused. Please try later.'
                }, 503);
            }

            state.counts[input.candidate]++;
            state.voters[voterKey] = input.candidate;
            state.updatedAt = new Date().toISOString();

            const condition = snapshot
                ? { onlyIfMatch: snapshot.etag }
                : { onlyIfNew: true };

            const { modified } = await store.setJSON(
                'state-v1',
                state,
                condition
            );

            if (modified) {
                return reply(results(state), 201);
            }

            await new Promise(resolve =>
                setTimeout(resolve, 10 + Math.random() * 30)
            );
        }

        return reply({
            success: false,
            message: 'Voting is busy. Please try again.'
        }, 503);
    } catch {
        return reply({
            success: false,
            message: 'Your vote could not be confirmed. Please retry; it will not be counted twice.'
        }, 503);
    }
}
