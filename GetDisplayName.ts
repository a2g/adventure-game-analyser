import { Colors } from "./Colors";

export function GetDisplayName(name: string) {
    if (name.startsWith("sol_prop_"))
        return Colors.Red + name.slice(9) + Colors.Reset;
    if (name.startsWith("sol_inv_"))
        return Colors.Red + name.slice(8) + Colors.Reset;
    if (name.startsWith("sol_reg_"))
        return Colors.Red + name.slice(8) + Colors.Reset;
    if (name.startsWith("inv_"))
        return Colors.Magenta + name.slice(4) + Colors.Reset;
    if (name.startsWith("prop_"))
        return Colors.Cyan + name.slice(5) + Colors.Reset;
    if (name.startsWith("reg_"))
        return Colors.Green + name.slice(5) + Colors.Reset;
    else if (name.startsWith("use") || name.startsWith("toggle") || name.startsWith("grab"))
        return Colors.Yellow + name + Colors.Reset;
    return name;
}