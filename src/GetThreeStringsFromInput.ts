export function GetThreeStringsFromInput(input: string) {
    const parts: string[] = input.split(" ");
    const len = parts.length;
    if (len < 2)
        return [];
    const action: string = parts[0].trim();
    const obj1: string = parts[1].trim();
    const obj2: string = len > 2 ? parts[2].trim() : "";
    return [action, obj1, obj2];
}