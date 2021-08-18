import { RowOfSheet } from "./RowOfSheet";
import { GetThreeStringsFromInput } from "./GetThreeStringsFromInput";
import { IsOk } from './IsOk';
import { LogAndReturnError } from './LogAndReturnError'

export function SolveCyclicEtc(rows: Array<RowOfSheet>, actionArray:Array<string>, isVerbose = false ) {
    const names: Set<string> = new Set<string>();
    rows.forEach((row: RowOfSheet) => {
        names.add(row.name);
    });

    const actions: Set<string> = new Set<string>();
    actionArray.forEach((action: string) => {
        actions.add(action.toLowerCase());
    });

    actions.add("use");// this one is always there.
    actions.add("init");// this means they are like that from the start

    // use jar blah
    for (let row of rows) { 
        // 1. test ** howToMakeVisible **
        const rowObject: string = row.name.trim();
        const command: string = row.commandToMakeVisible.trim();
        if (command.toLowerCase() !== "init") {

            const parts: string[] = GetThreeStringsFromInput(command);
            const len = parts.length;
            if (len < 2)
                return LogAndReturnError(false, "'" + command + "' not having atleast two parts", isVerbose);
            const Action: string = parts[0];
            const obj1: string = parts[1];
            const obj2: string = len > 2 ? parts[2] : "";

            let result = LogAndReturnError(actions.has(Action), `the Actionss containment test with: '${Action}' in ${command})`, isVerbose);
            if (IsOk(result)) {
                result = LogAndReturnError(names.has(obj1), `the Object containment test with: '${obj1}' ${command})`, isVerbose);
                if (obj1 === rowObject)
                    result = LogAndReturnError(false, `due to cyclical-dependency with: '${obj1}' ${command})`, isVerbose);
                if (IsOk(result) && obj2 !== "") {
                    result = LogAndReturnError(names.has(obj2), `the Objects containment test with: '${obj2}' ${command})`, isVerbose);
                    if (Action !== "use")
                        return LogAndReturnError(false, `due to 'use' not being the Action on a two object command: ${command})`, isVerbose);
                    if (obj2 === rowObject)
                        result = LogAndReturnError(false, `due to cyclical-dependency with: '${obj2}' ${command})`, isVerbose);
                }
            }
            if (!IsOk(result))
                return result;
        }


        // 2. test ** scriptForExamine ** <-- its just text;

        // 3. now lets validate some javascript
        const scriptToRunWhenMadeVisible: string = row.scriptToRunWhenMadeVisible;
        if (command !== "none") {
            const parts: string[] = command.split(";");
            for (const part in parts) {
                const trimmed: string = part.trim();
            }
        }
    };

    return "ok";
}

