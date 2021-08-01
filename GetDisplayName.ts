import { Colors } from "./Colors";

function Parenthesize(input: string, isParenthesisNeeded: boolean): string {
    if (isParenthesisNeeded)
        return "(" + input + ")";
    return input;
}

export function GetDisplayName(input: string | Array<string>, isParenthesisNeeded=false): string {
    if (Array.isArray(input)) {
        let toReturn = "Colors.Yellow";
        for (let i = 0; i < input.length; i++) {
            toReturn += input[i];
        }
        toReturn += Colors.Reset;
        return toReturn;
    }

    const single = input.toString();
    if (single.startsWith("sol_prop_"))
        return Colors.Red + Parenthesize(single.slice(9), isParenthesisNeeded)  + Colors.Reset;
    if (single.startsWith("sol_inv_"))
        return Colors.Red + single.slice(8) + Colors.Reset;
    if (single.startsWith("sol_reg_"))
        return Colors.Red + single.slice(8) + Colors.Reset;
    if (single.startsWith("inv_"))
        return Colors.Magenta + single.slice(4) + Colors.Reset;
    if (single.startsWith("prop_"))
        return Colors.Cyan + single.slice(5) + Colors.Reset;
    if (single.startsWith("reg_"))
        return Colors.Green + single.slice(4) + Colors.Reset;
    if (single.startsWith("char_"))
        return Colors.Yellow + Parenthesize(single.slice(5), isParenthesisNeeded) + Colors.Reset;
    else if (single.startsWith("use") || single.startsWith("toggle") || single.startsWith("grab"))
        return Colors.Yellow + single + Colors.Reset;

    return single;
}
