
import { ChooseTheGoalToFindLeavesFor } from './ChooseTheGoalToFindLeavesFor';
import { ChooseToPlaySingleSection } from './ChooseToPlaySingle';
import { ChooseToFindUnused } from './ChooseToFindUnused';
import { ChooseTheGoalToConcoctSolutionFor } from './ChooseTheGoalToConcoctSolutionFor';
import { ChooseToPlayCampaign } from './ChooseToPlayCampaign';
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { ReadOnlyJsonMultipleCombined } from './ReadOnlyJsonMultipleCombined';
import { ReadOnlyJsonInterface } from './ReadOnlyJsonInterface';
import { ReadOnlyJsonSingle } from './ReadOnlyJsonSingle';
import { books } from './20210415JsonPrivate/LostBoys/LostBoysCampaign.json'
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


        const arrayOfMultiLevels = new Array<Array<string>>();
        let arrayOfSingles = new Array<string>();
        for (let book of books) {
            let newArray = new Array<string>(); 

            // push mainFile first, in case we want the
            // ReadOnlyJsonMultipleCombined implementation
            // to know which file is the main
            newArray.push(book.mainFile);
            console.log("" + i++ + ". " + GetLastSeg(book.mainFile)+ " (full multi)");
            for(let file of book.extraFiles){
                newArray.push(file);
            }

            arrayOfMultiLevels.push(newArray); 
            // if there are some extras then we add all to singles
            // ...but if there is none we don't add any because 
            // you can just choose full to experience it in isolation
            if(book.extraFiles.length>0)
            {
                arrayOfSingles = arrayOfSingles.concat(newArray);
            }
        }

        for(let isolated of arrayOfSingles){
            console.log("" + i++ + ". " + GetLastSeg(isolated) + " (only)");
        }

        const choice = prompt("Choose an option (b)ail): ").toLowerCase();
        switch (choice) {
            case 'b':
                return;
            case '0':
                ChooseToPlayCampaign();
                break;
            default:
                let index = Number(choice) - 1;
                const total = arrayOfMultiLevels.length + arrayOfSingles.length;
                if (index >= 0 && index < total) {
                    let isMulti = (index<arrayOfMultiLevels.length);
                    // adjust index so it picks out its intended type (multi or single) 
                    index = isMulti? index : index-arrayOfMultiLevels.length;
                    const json:ReadOnlyJsonInterface = isMulti? new ReadOnlyJsonMultipleCombined(arrayOfMultiLevels[index]) : new ReadOnlyJsonSingle(arrayOfSingles[index]); 
                    while (true) {
                        console.log("\nSubMenu of " + arrayOfSingles[index]);
                        console.log("---------------------------------------");
                        console.log("1. Play Single");
                        console.log("2. Solve to Leaf Nodes <--leafs unresolved? add gates and validate schema");
                        console.log("3. Check for unused props and invs <-- delete these");
                        console.log("4. Try Concocting solutions <-- solutions missing? add props to starting props, or things");
                        console.log("5. Choose a character <-- this will give you which characters each solution is restricted to");
                   
                        const choice = prompt("Choose an option (b)ack: ").toLowerCase();
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
