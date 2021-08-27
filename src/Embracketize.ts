

export function Embracketize(input: string, isParenthesisNeeded=true): string {
    if (isParenthesisNeeded)
        return "(" + input + ")";
    return input;
}