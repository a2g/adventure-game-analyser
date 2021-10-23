
import { ChooseTheGoalToFindLeavesFor } from './ChooseTheGoalToFindLeavesFor';
import { ChooseToPlaySingleSection } from './ChooseToPlaySingle';
import { ChooseToFindUnused } from './ChooseToFindUnused';
import { ChooseTheGoalToConcoctSolutionFor } from './ChooseTheGoalToConcoctSolutionFor';
import { books } from './20210415JsonPrivate/All.json'
import { ChooseToPlayCampaign } from './ChooseToPlayCampaign';
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { ReadOnlyJsonMultipleCombined } from './ReadOnlyJsonMultipleCombined';
const prompt = promptSync();

function GetLastSeg(path:string) : string{
    let lastSeg = path;
    if(path.includes("/"))
        return path.substring(path.lastIndexOf("/")+1);
    return lastSeg;
}

function main(): void {
   
    while (true) {
        let i = 1;
        console.log(" ");
        console.log(" Master Menu")
        console.log("==================");
        console.log("0. Play Campaign");

        const arrayOfFiles = new Array<string>();
        for (let book of books) {
            arrayOfFiles.push(book.mainFile);
            console.log("" + i++ + ". " + GetLastSeg(book.mainFile));
            for(let file of book.extraFiles){
                arrayOfFiles.push(file);
                console.log("" + i++ + ". " + GetLastSeg(file));
            }
        }

        const choice = prompt("Choose an option (b)ail): ").toLowerCase();
        switch (choice) {
            case 'b':
                return;
            case '0':
                ChooseToPlayCampaign();
                break;
            default:
                const index = Number(choice) - 1;
                if (index >= 0 && index < arrayOfFiles.length) {
                    const json = new ReadOnlyJsonMultipleCombined([arrayOfFiles[index]]);
                    while (true) {
                        console.log("\nSubMenu of " + arrayOfFiles[index]);
                        console.log("---------------------------------------");
                        console.log("1. Play Single");
                        console.log("2. Solve to Leaf Nodes <--leafs unresolved? add gates and validate schema");
                        console.log("3. Check for unused props and invs <-- delete these");
                        console.log("4. Try Concocting solutions <-- solutions missing? add props to starting props, or things");
                        console.log("5. Choose a character <-- this will give you which characters each solution is restricted to");
                   
                        const choice = prompt("Choose an option (b)ail: ").toLowerCase();
                        if(choice=='b')
                            break;
                        switch (choice) {
                            case '1':
                                ChooseToPlaySingleSection(json, 0);
                                break;
                            case '2':
                                ChooseTheGoalToFindLeavesFor.prototype.DoStuff(json);
                                break;
                            case '3':
                                ChooseToFindUnused.prototype.DoStuff(json);
                                break;
                            case '4':
                                ChooseTheGoalToConcoctSolutionFor.prototype.DoStuff(json);
                                break;
                            case '5':
                                //ChooseTwoCharacters.prototype.DoStuff();
                                break;
                          
                        }
                    }
                }
        }
    }
}

main();
