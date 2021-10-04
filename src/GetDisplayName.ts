import { Colors } from "./Colors";
import { Embracketize } from "./Embracketize";

export function GetDisplayName(input: string | Array<string>, isParenthesisNeeded = false): string {
    if (Array.isArray(input)) {
        // format arrays in to a lovely comma-separated list
        let toReturn = "";
        for (let i = 0; i < input.length; i++) {
            const nameToAdd = GetDisplayName(input[i]);//recurse
            toReturn += toReturn.length > 0 ? (", " + nameToAdd) : nameToAdd;
        }
        return toReturn;
    }

    const single = input.toString();
    if (single.startsWith("sol_prop_"))
        return Colors.Red + Embracketize(single.slice(9), isParenthesisNeeded) + Colors.Reset;
    if (single.startsWith("sol_flag_"))
        return Colors.Red + single.slice(9) + Colors.Reset;
    if (single.startsWith("sol_inv_"))
        return Colors.Red + single.slice(8) + Colors.Reset;
    if (single.startsWith("inv_"))
        return Colors.Magenta + single.slice(4) + Colors.Reset;
    if (single.startsWith("prop_"))
        return Colors.Cyan + single.slice(5) + Colors.Reset;
    if (single.startsWith("flag_"))
        return Colors.Green + single.slice(5) + Colors.Reset;
    if (single.startsWith("char_"))
        return Colors.Yellow + Embracketize(single.slice(5), isParenthesisNeeded) + Colors.Reset;
    else if (single.startsWith("use") || single.startsWith("toggle") || single.startsWith("grab"))
        return Colors.Yellow + single + Colors.Reset;

    return single;
}
