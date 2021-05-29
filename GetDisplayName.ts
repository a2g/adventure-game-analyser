export function GetDisplayName(name: string) {
    if (name.startsWith("inv_"))
        return name.slice(4);
    if (name.startsWith("prop_"))
        return name.slice(5);
    return name;
}