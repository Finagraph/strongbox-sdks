export enum AccountingPackage {
    AccountRightLive = "AccountRightLive",
    Dynamics365 = "Dynamics365",
    Example = "Example",
    FreeAgent = "FreeAgent",
    FreshBooks = "FreshBooks",
    Netsuite = "Netsuite",
    QuickBooksDesktop = "QuickBooksDesktop",
    QuickBooksOnline = "QuickBooksOnline",
    SageIntacct = "SageIntacct",
    SageOne = "SageOne",
    Xero = "Xero",
}

export type AccountingPkgPresentation = {
    featureName: AccountingPackage;
    descriptor: string | undefined;
    isPublic: boolean;
    linkFunc?: () => void;
};

