export enum AccountingPackage {
    Dynamics365 = "Dynamics365",
    Example = "Example",
    FreeAgent = "FreeAgent",
    FreshBooks = "FreshBooks",
    NetSuite = "NetSuite",
    MYOBBusiness = "MYOBBusiness",
    QuickBooksDesktop = "QuickBooksDesktop",
    QuickBooksOnline = "QuickBooksOnline",
    SageIntacct = "SageIntacct",
    SageOne = "SageOne",
    Xero = "Xero",
    FileUpload="FileUpload",
}

export type AccountingPkgPresentation = {
    featureName: AccountingPackage;
    descriptor: string | undefined;
    isPublic: boolean;
    linkFunc?: () => void;
};

