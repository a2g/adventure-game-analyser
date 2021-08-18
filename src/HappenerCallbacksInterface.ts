
export interface HappenerCallbacksInterface {
    OnPropVisbilityChange(numberOfObjectWhoseVisibilityChanged: number, newValue: boolean, nameForDebugging: string): void;
    OnInvVisbilityChange(numberOfObjectWhoseVisibilityChanged: number, newValue: boolean, nameForDebugging: string): void;
};