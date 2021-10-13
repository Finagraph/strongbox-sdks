import { headerConstants } from './Constants';

/**
 * Gets the Authorization HTTP header
 */
function getAuthorizationHeaderValue(): string {
    /*
     * This is used in CashFlowTool to get the user who is logged in with Auth0. Not applicable here yet if ever.
     * 
     * import AuthService from '../Services/AuthService';
     * 
     * const loggedInUser = AuthService.GetLoggedInUser();
     *
     * const idToken =
     *   loggedInUser &&
     *   loggedInUser.auth &&
     *   loggedInUser.auth.idToken;
     *
     * if (!idToken) {
     *    console.warn(`User::GetAuthorizationHeaderValue > Failed to get ID token for logged in user.`);
     * }
     *
     * return `Bearer ${idToken}`;
    */
    return '';
}

export enum FetchMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT',
}

export class FetchError extends Error {
    public errorMessage: string | undefined;
    public status: number;
    public errors: Record<string, string[]> | undefined;

    constructor(message: string, errorMessage: string | undefined, status: number, errors?: Record<string, string[]>) {
        super(message);

        // Extending error breaks the prototype chain
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, FetchError.prototype);

        this.errorMessage = errorMessage;
        this.status = status;
        this.errors = errors;
    }
}

/** Global configuration for FetchWrapper */
export type FetchWrapperOptions = {
    /**
     * Error handler that will be invoked when a FetchError is thrown. If this promise does not reject,
     * FetchWrapper will not throw an error.
     */
    errorHandler?: (error: FetchError | Error) => Promise<void>,
};

export const fetchWrapperOptions: FetchWrapperOptions = {
    errorHandler: undefined,
};

/**
 * A wrapper around fetch, including error handling of bad status codes and inclusion
 * of common headers.
 * @param url Url to fetch.
 * @param init Request options.
 * @param jsonHeaders If set, json headers will be added to the request.
 * @param requireAuth If set, authorization headers will be added to the request.
 * @param noCache If set, no-cache headers are added to the request.
 */
export async function fetchWrapper(
    url: string,
    init?: Partial<RequestInit>,
    jsonHeaders: boolean = true,
    requireAuth: boolean = true,
    // @ts-ignore
    noCache: boolean = true): Promise<Response> {

    const headers = (init && init.headers) || {};

    if (requireAuth) {
    // @ts-ignore
        headers['Authorization'] = getAuthorizationHeaderValue();
    }

    if (jsonHeaders) {
    // @ts-ignore
        headers['Content-Type'] = 'application/json';
    // @ts-ignore
        headers['Accept'] = 'application/json';
    }

    if (noCache) {
    // @ts-ignore
        headers['cache-control'] = 'no-cache';
    // @ts-ignore
        headers['pragma'] = 'no-cache';
    }

    // Offset is returned as relative to current time
    const offset = new Date().getTimezoneOffset();
    // Change to negative so it is relative to Utc time.
    // @ts-ignore
    headers[headerConstants.timezoneOffsetHeaderKey] = -offset;

    const req: RequestInit = {
        credentials: 'same-origin',
        ...init,
        headers,
    } as RequestInit;

    const response = await fetch(url, req);

    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let errorText = '';
        let errorObj: any;

        // Pull message from bad request
        if (response.status === 400) {
            try {
                // bad request will either be empty, a BadRequest object, or Record<string, string, Array<string>>
                const badRequest: any = await response.json();
                errorText = badRequest.description;
                errorObj = badRequest;
            } catch (e) {
                console.warn('Error while deserializing BadRequest: ' + e.message);
                errorText = 'Bad request';
            }
        }

        const errorMsg = `Fetch request failed with code ${response.status}. ${response.statusText}`;

        const error = new FetchError(
            errorMsg,
            errorText,
            response.status,
            errorObj);

        if (fetchWrapperOptions.errorHandler) {
            await fetchWrapperOptions.errorHandler(error);
        } else {
            throw error;
        }
    }
}
