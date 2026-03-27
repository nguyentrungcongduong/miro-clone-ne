import { getUserData, setUserData } from "../../../helper/auth";
import { makeHttpReq, makeHttpReq2 } from "../../../helper/makeHttpReq";
import { showError } from "../../../helper/toastnotification";
import {
    OauthTokenInputType,
    OauthTokenResponseType,
    userResponseType,
} from "./tokenTypes";

export async function getAccessTokenAndRefreshToken(
    codeVerifier: string,
    userId: string
): Promise<boolean> {
    console.log('Starting token exchange...');
    const userData = getUserData();
    console.log('User data from storage:', userData);

    if (!userData?.authorizationCode) {
        const errorMsg = 'Authorization code not found in user data';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const clientId = import.meta.env.VITE_PASSPORT_CLIENT_ID || "01979f1d-c8b3-7291-a186-72fbed328c91";
        const redirectUri = import.meta.env.VITE_APP_URL ?
            `${import.meta.env.VITE_APP_URL}/app/callback` :
            "http://127.0.0.1:8000/app/callback";

        const input: OauthTokenInputType = {
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
            code: userData.authorizationCode,
        };

        console.log('Making token request with:', {
            client_id: clientId,
            redirect_uri: redirectUri,
            has_code_verifier: !!codeVerifier,
            has_auth_code: !!userData.authorizationCode,
            code_length: userData.authorizationCode?.length
        });

        // Request access and refresh token
        console.log('Sending token request to oauth/token');
        // Convert to FormData to ensure proper content type
        const formData = new FormData();
        formData.append('grant_type', 'authorization_code');
        formData.append('client_id', clientId);
        formData.append('client_secret', 't0ZLXqa6eyxSC9g31fe0xfkYmaQgXxJZD1gNwXv9'); // Use the client secret from the newly created client
        formData.append('redirect_uri', redirectUri);
        formData.append('code_verifier', codeVerifier);
        formData.append('code', userData.authorizationCode);

        // Use fetch directly to ensure proper form data handling
        const response = await fetch(`${import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000'}/oauth/token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
            credentials: 'include', // Include cookies for session
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Token request failed:', response.status, errorData);
            throw new Error(errorData.message || 'Failed to obtain access token');
        }

        const token = await response.json();

        console.log('Token response:', token);

        if (!token?.access_token) {
            const errorMsg = `Failed to obtain access token. Response: ${JSON.stringify(token)}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        const tokenProps = {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiresIn: token.expires_in,
        };

        // Request user data
        const { user } = await makeHttpReq2<
            { client_id: string; user_id: string },
            { user: userResponseType }
        >("user_data", "POST", {
            client_id: input.client_id,
            user_id: userId,
        });

        if (!user) {
            throw new Error('Failed to fetch user data');
        }

        // Update user data with tokens and user info
        setUserData({
            user: {
                name: user.name,
                email: user.email,
                userId: user.id,
            },
            token: tokenProps,
        });

        return true;
    } catch (error) {
        console.error('Error during token exchange:', error);
        showError('Authentication failed. Please try again.');
        // Clear any partial data
        localStorage.removeItem('user_data');
        throw error; // Re-throw to be handled by the caller
    }
}
