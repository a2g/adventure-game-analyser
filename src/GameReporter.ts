import { Colors } from './Colors';
import { GetDisplayName } from './GetDisplayName';

export class GameReporter {
    constructor() {
        this.numberOfCommandsExecuted = 0;
    }
    Show(itemName: string) {
        if (itemName.startsWith("i")) {
            console.log("You now have a " + GetDisplayName(itemName) + " in your possession");
        }
        else if (itemName.startsWith("o")) {
            console.log("A " + GetDisplayName(itemName) + " reveals itself");
        }
    }

    Say(speech: string) {
        console.log("Main character says " + this.Speech(speech));
    }

    private Prettify(itemName: string): string {
        return GetDisplayName(itemName);
    }

    private Speech(speech: string): string {
        return "" + Colors.Blue + "\"" + speech + "\"" + Colors.Reset;
    }
    
    ReportCommand(command: string[]) {
        this.numberOfCommandsExecuted++;

        let prettifiedComand = "";
        if (command.length !== 3)
            prettifiedComand = Colors.Red  + "Command length is not 3!" + Colors.Reset;
        else if (command[2] !== "")
            prettifiedComand = this.Prettify(command[0]) + " " + this.Prettify(command[1]) + " with " + this.Prettify(command[2]);
        else if (command[1] !== "")
            prettifiedComand = this.Prettify(command[0]) + " " + this.Prettify(command[1]);
        else
            prettifiedComand = this.Prettify(command[0]);

        console.log("\n");
        console.log("> #" + this.numberOfCommandsExecuted + " " + prettifiedComand);
        console.log("\n");
    }

    ReportInventory(inventoryItems: string[]) {
        if (inventoryItems.length === 0)
            return console.log("You aren't carrying anything");

        let inventoryString: string = "You are carrying: " + GetDisplayName(inventoryItems[0]);
        for (let i = 1; i < inventoryItems.length; i++) {// classic forloop useful because starting at 1
            inventoryString += ", " + GetDisplayName(inventoryItems[i]);
        };

        console.log(inventoryString);
    }

    ReportScene(sceneItems: string[]) {
        if (sceneItems.length === 0)
            return console.log("There's nothing around you");

        let sceneString: string = "You can see: " + GetDisplayName(sceneItems[0]);
        for (let i = 1; i < sceneItems.length; i++) {// classic forloop useful because starting at 1
            sceneString += ", " + GetDisplayName(sceneItems[i]);
        };

        console.log(sceneString);
    }

    ReportFlags(flags: string[]) {
        if (flags.length === 0)
            return console.log("No flags have been set");

        let sceneString: string = "Non zero flags: " + GetDisplayName(flags[0]);
        for (let i = 1; i < flags.length; i++) {// classic forloop useful because starting at 1
            sceneString += ", " + GetDisplayName(flags[i]);
        };

        console.log(sceneString);
    }

    public static GetInstance(): GameReporter {
        if (!GameReporter.instance) {
            GameReporter.instance = new GameReporter();
        }
        return GameReporter.instance;
    }
    private static instance: GameReporter;

    private numberOfCommandsExecuted: number;
}
