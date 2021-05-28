
export interface GameRuleEnforcerCallbacksInterface {
    OnPropVisbilityChange(numberOfObjectWhoseVisibilityChanged: number, newValue: boolean, nameForDebugging: string): void;
    OnInvVisbilityChange(numberOfObjectWhoseVisibilityChanged: number, newValue: boolean, nameForDebugging: string): void;
};