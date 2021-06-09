import { Colors } from "./Colors";

export function GetDisplayName(name: string) {
    if (name.startsWith("inv_"))
        return Colors.Magenta + name.slice(4) + Colors.Reset;
    if (name.startsWith("prop_"))
        return Colors.Cyan + name.slice(5) + Colors.Reset;
    if (name.startsWith("reg_"))
        return Colors.Green + name.slice(5) + Colors.Reset;
    return name;
}