export enum LinkState {
    LinkingNotInitiated,
    LinkingInProgress,
    LinkingComplete,
    LinkingFailed,
    LinkingFailedRequiresAuth,
}

export class LinkerSession {
    public linkState: LinkState;
    public progress: number;
    public jobId: string | undefined;

    // @ts-ignore
    constructor(linkState: LinkState, progress: number, jobId: string = undefined) {
        this.linkState = linkState;
        this.progress = progress;
        this.jobId = jobId;
    }

    get isLinking() {
        return this.linkState === LinkState.LinkingInProgress;
    }
}
