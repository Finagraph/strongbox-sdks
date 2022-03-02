export enum ControlState {
    button,
    borrower
}

export enum BorrowerSteps {
    acceptTerms,
    choosePackage,
    importingFinancials,
    configureAccounting,
    progress,
    congratulations,
}

export type BorrowerState = {
    state: ControlState;
    activeStep: BorrowerSteps;
}
