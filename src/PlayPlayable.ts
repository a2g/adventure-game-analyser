import { GameReporter } from "./GameReporter";
import { Sleep } from "./Sleep";
import { ParseTokenizedCommandLineFromFromThreeStrings } from "./GetMixedObjectsAndVerbFromThreeStrings";
import { GetAnyErrorsFromObjectAvailability } from "./GetAnyErrorsFromObjectAvailability";
import { BookSession } from "./BookSession";
import { ProcessAutos } from "./ProcessAutos";
import { Playable} from "./Playable";

export function PlayPlayable(playable: Playable) {

    while (true) {
        // report current situation to cmd output
        const reporter = GameReporter.GetInstance();
        const flags = playable.GetHappener().GetCurrentlyTrueFlags();
        const invs = playable.GetHappener().GetCurrentVisibleInventory();
        const props = playable.GetHappener().GetCurrentVisibleProps();
        reporter.ReportFlags(flags);
        reporter.ReportInventory(invs);
        reporter.ReportScene(props);

        // Process all the autos
        ProcessAutos(playable.GetHappener(), playable.GetSolutionNodeMap());

        // check have we won?
        if (playable.GetHappener().GetFlagValue("flag_win")) {
            playable.SetCompleted();
            break;
        }

        Sleep(500);

        // take input & handle null and escape character
        let input: string[] = playable.GetPlayer().GetNextCommand();
        if (input.length <= 1) {
            if (input.length == 1 && input[0] == 'b')
                return; // GetNextCommand returns ['b'] if the user chooses 'b'

            // this next line is only here to easily debug
            input = playable.GetPlayer().GetNextCommand();
            break;
        }

        // parse & handle parsing errors
        const commandLine = ParseTokenizedCommandLineFromFromThreeStrings(input, playable.GetHappener());
        if (commandLine.error.length) {
            console.log(input + " <-- Couldn't tokenize input, specifically " + commandLine.error);
            continue;
        }

        // if all objects are available then execute
        const errors = GetAnyErrorsFromObjectAvailability(commandLine, playable.GetHappener().GetCurrentVisibleProps(), playable.GetHappener().GetCurrentVisibleInventory());
        if (errors.length == 0) {
            GameReporter.GetInstance().ReportCommand(input);
            playable.GetHappener().ExecuteCommand(commandLine);
        } else {
            console.log(errors);
        }
    } // end while (true) of playing game

    // a break in the above loop will get here, but a return will not.
    playable.SetCompleted();
    console.log("Success");
}
