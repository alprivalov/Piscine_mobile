export async function createTokenWithCode(code: string, request:any) {
    const url =
        `https://github.com/login/oauth/access_token` +
        `?client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}` +
        `&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}` +
        `&code=${code}` +
        `&code_verifier=${request?.codeVerifier!}`


    const response = await fetch(url,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}