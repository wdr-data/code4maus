import fetch from 'node-fetch';
import template from './template.ejs';

const baseUrl = process.env.ASSET_BASEURL;

export const handler = async (event, context, callback) => {
    const { id } = event.queryStringParameters;

    if (!id) {
        return null;
    }

    const imageUrl = `/data/sharing/${id}`;

    const response = await fetch(baseUrl + '/manifest.json');
    const manifest = await response.json();

    const scripts = [
        manifest['vendors~app~sharingpage.js'],
        manifest['vendors~sharingpage.js'],
        manifest['sharingpage.js'],
    ];

    const content = template({ scripts, baseUrl, imageUrl });

    return {
        statusCode: 200,
        headers: {
            'content-type': 'text/html',
        },
        body: content,
    };
};
