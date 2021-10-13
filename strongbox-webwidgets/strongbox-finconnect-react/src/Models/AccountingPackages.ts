export enum AccountingPackage {
    QuickBooksOnline = "QuickBooksOnline",
    SageOne = "SageOne",
    SageIntacct = "SageIntacct",
    QuickBooksDesktop = "QuickBooksDesktop",
    AccountRightLive = "AccountRightLive",
    FreshBooks = "FreshBooks",
    Dynamics365 = "Dynamics365",
    Xero = "Xero",
    Example = "Example",
}

export type AccountingPkgPresentation = {
    featureName: AccountingPackage;
    descriptor: string | undefined;
    isPublic: boolean;
    linkFunc?: () => void;
};

