/** Defines what a delegated access token is to be used for. */
export type DelegatedAccessTokenPurpose = "ConnectAccountingSystem" | "ConnectionManagement";

/** A Delegated Access Token response. */
export interface IDelegatedAccessToken {
    /** A JWT access token. */
    accessToken: string;
    /** An identifier for the entity to which access is being delegated. */
    actorId: string;
    /** The UTC time after which the access token is no longer valid. */
    expiration: string;
    /** Specifies what the delegated access token is to be used for. */
    purpose: DelegatedAccessTokenPurpose[];
    /** The Authorization header scheme to use when presenting the token. Only "Bearer" is supported at this time. */
    tokenType: string;
}

/**
 * Base class for Api Clients, handling Auth and transformation of requests.
 */
export abstract class ClientBase {
    /**
     * If the currently Access Token in use expires, this will be called in an attempt to get a new one.
     * @returns Promise which resolves to a new Access Token.
     */
    public onTokenExpired: (() => Promise<IDelegatedAccessToken>) | undefined;

    private _token: IDelegatedAccessToken;

    /**
     * Create an ClientBase base class.
     * @param accessToken An access token to use to authenticate/authorize requests.
     * @param onTokenExpired Function to call when currently registered token is expired to attempt to 
     * retrieve a new one.
     */
    constructor(accessToken: IDelegatedAccessToken) {
        if (!accessToken || !accessToken.accessToken) {
            throw new Error('An access token is required for interacting with the Strongbox Api.');
        }

        this._token = accessToken;
    }

    /**
     * Validate and transform RequestInit for making requests to Strongbox.
     * @param options Fetch RequestInit to transform.
     */
    public async transformOptions(options: RequestInit): Promise<RequestInit> {
        if (new Date() >= new Date(this._token.expiration)) {
            if (this.onTokenExpired) {
                this._token = await this.onTokenExpired();
            } else {
                throw new Error('The access token for the Strongbox Api has expired.');
            }
        }

        options.headers = new Headers(options.headers);
        options.headers.append('Authorization', `${this._token.tokenType} ${this._token.accessToken}`);

        return options;
    }
}
