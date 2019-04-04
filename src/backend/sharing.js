import fetch from 'node-fetch';
import landingTemplate from './landingTemplate.ejs';
import playerTamplate from './playerTemplate.ejs';

const baseUrl = process.env.ASSET_BASEURL;
const apiHost = process.env.API_HOST;

const imageUrl = (id) => `/data/sharing/${id}`;

class HttpError {
    constructor(code) {
        this.code = code;
    }

    get message() {
        switch (this.code) {
        case 400:
            return 'Bad request';
        case 404:
            return 'Not found';
        case 500:
            return 'Internal Server Error';
        }
        return 'unknown';
    }
}

const playerFrame = async (id) => {
    const type = await getImageType(id);

    const content = playerTamplate({
        baseUrl,
        apiHost,
        id,
        imageUrl: imageUrl(id),
        type,
    });

    return {
        statusCode: 200,
        headers: {
            'content-type': 'text/html',
        },
        body: content,
    };
};

const getImageType = async (id) => {
    const imageData = await fetch(`${baseUrl}/data/sharing/${id}`, {
        method: 'head',
    });

    if (imageData.status === 404) {
        throw new HttpError(404);
    } else if (imageData.status >= 400) {
        throw new Error(
            `Got unexpected status code ${imageData.status} from backend`
        );
    }

    return imageData.headers.get('content-type');
};

const landingPage = async (id) => {
    const response = await fetch(baseUrl + '/manifest.json');
    const manifest = await response.json();

    const scripts = [
        manifest['vendors~app~sharingpage.js'],
        manifest['vendors~sharingpage.js'],
        manifest['sharingpage.js'],
    ].filter((script) => script); // vendors-sharingpage might not be there

    const type = await getImageType(id);

    const content = landingTemplate({
        scripts,
        baseUrl,
        apiHost,
        id,
        type,
        imageUrl: imageUrl(id),
    });

    return {
        statusCode: 200,
        headers: {
            'content-type': 'text/html',
        },
        body: content,
    };
};

export const handler = async (event, context, callback) => {
    const { id, frame } = event.queryStringParameters;

    if (!id) {
        return {
            statusCode: 400,
            body: 'Parameter missing',
        };
    }

    // to prevent "../shadow"
    if (!id.match(/^[A-Za-z0-9_-]+$/)) {
        return {
            statusCode: 400,
            body: 'Parameter invalid',
        };
    }

    try {
        if (frame === 'yes') {
            return playerFrame(id);
        } else {
            return landingPage(id);
        }
    } catch (e) {
        if (e instanceof HttpError) {
            return {
                statusCode: e.code,
                body: e.message,
            };
        } else {
            console.error(e);
            return {
                statusCode: 500,
                body: 'Internal Server Error',
            };
        }
    }
};
