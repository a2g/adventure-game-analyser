import { Colors } from "./Colors";

export function ExtractBracketedPart(name: string | undefined): string {
    if (name) {
        const firstOpenBracket: number = name.indexOf("(");

        if (firstOpenBracket >= 0) {
            const lastIndexOf = name.lastIndexOf(")");

            if (lastIndexOf > firstOpenBracket) {
                return name.slice(firstOpenBracket, lastIndexOf - 1);
            }
        }
    }
    return "undefined";
}