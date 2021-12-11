import { Happener } from "./Happener";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();
import { books } from './20210415JsonPrivate/All.json'
import { ReadOnlyJsonMultipleCombined } from "./ReadOnlyJsonMultipleCombined";
import { PlayPlayable } from "./PlayPlayable";
import { Playable } from "./Playable";
import { PlayerAI } from "./PlayerAI";
import { definitions } from './20210415JsonPrivate/Gate/GateCampaignFramework.json';
import { SolutionNodeMap } from "./SolutionNodeMap";

/*
* This class isn't used anywhere else
*/
export class BookSession {

    constructor(happener: Happener, startingThings: Map<string, Set<string>>, solutionNodeMap: SolutionNodeMap) {
        const numberOfAutopilotTurns = 0;
        const player = new PlayerAI(happener, numberOfAutopilotTurns);
        this.playable = new Playable(player, happener, solutionNodeMap);
        this.prerequisiteFlags = [];
        this.prerequisiteType = "";
        this.sunsetFlags = [];
        this.sunsetType = "";
        this.flagSetUponCompletion = "";
        this.bookTitle = "";
        this.startingThings = startingThings;
    }

    GetTitle(): string {
        return this.bookTitle;
    }

    prerequisiteFlags: string[];
    prerequisiteType: string;
    sunsetFlags: string[];
    sunsetType: string;
    flagSetUponCompletion: string;
    bookTitle: string;
    startingThings: Map<string, Set<string>>;
    playable: Playable;
}

export class BookSessionCollection {

    constructor() {
        this.books = new Array<BookSession>();
    }

    IsActive(index: number): boolean {
        const gflags = new Set<string>();
        if (index < 0 || index >= this.books.length)
            return false;
        for (let section of this.books) {
            if (section.playable.IsCompleted())
                gflags.add(section.flagSetUponCompletion);
        }
        let prerequisitesCompleted = 0;
        for (let prerequisite of this.books[index].prerequisiteFlags) {
            if (gflags.has(prerequisite))
                prerequisitesCompleted++;
        }

        let sunsetsCompleted = 0;
        for (let sunset of this.books[index].sunsetFlags) {
            if (gflags.has(sunset))
                sunsetsCompleted++;
        }

        let isPrerequisiteSatisfied = false;
        switch (this.books[index].prerequisiteType) {
            case definitions.condition_type.oneOrMore:
                isPrerequisiteSatisfied = prerequisitesCompleted >= 1;
                break;
            case definitions.condition_type.twoOrMore:
                isPrerequisiteSatisfied = prerequisitesCompleted >= 2;
                break;
            case definitions.condition_type.threeOrMore:
                isPrerequisiteSatisfied = prerequisitesCompleted >= 3;
                break;
            default:
                isPrerequisiteSatisfied = prerequisitesCompleted >= this.books[index].prerequisiteFlags.length;
        }

        let isSunsetSatisfied = false;
        switch (this.books[index].sunsetType) {
            case definitions.condition_type.oneOrMore:
                isSunsetSatisfied = sunsetsCompleted >= 1;
                break;
            case definitions.condition_type.twoOrMore:
                isSunsetSatisfied = sunsetsCompleted >= 2;
                break;
            case definitions.condition_type.threeOrMore:
                isSunsetSatisfied = sunsetsCompleted >= 3;
                break;
            default:
                isSunsetSatisfied = sunsetsCompleted >= this.books[index].sunsetFlags.length;
        }

        //default to must have completed all
        const isActive = isPrerequisiteSatisfied && !isSunsetSatisfied;
        return isActive;
    }

    Push(session: BookSession) {
        this.books.push(session);
    }

    Get(i: number): BookSession {
        return this.books[i];
    }

    Length(): number {
        return this.books.length;
    }

    private books: Array<BookSession>;
}

export function ChooseToPlayCampaign(): void {
    const sessions = new BookSessionCollection();
    for (let book of books) {
        let fileset = new Array<string>();
        fileset.push(book.mainFile)
        for (let extra of book.extraFiles) {
            fileset.push(extra);
        }
        let json = new ReadOnlyJsonMultipleCombined(fileset);
        let happener = new Happener(json);
        let s = new BookSession(happener, json.GetMapOfAllStartingThings(), json.GenerateSolutionNodesMappedByInput());
        s.prerequisiteFlags = book.prerequisiteFlags;
        s.prerequisiteType = book.prerequisiteType;
        s.flagSetUponCompletion = book.flagSetUponCompletion;
        s.bookTitle = book.bookName;
        s.sunsetFlags = book.sunsetFlags;
        s.sunsetType = book.sunsetType;
        sessions.Push(s);
    }

    while (true) {
        // list the sections to choose from
        for (let i = 0; i < sessions.Length(); i++) {
            let book = sessions.Get(i);
            console.log("" + i + ". " + book.GetTitle() + (sessions.IsActive(i) ? "  active" : "  locked") + (book.playable.IsCompleted() ? "  COMPLETE!" : "  incomplete"));
        }

        // ask which section they want to play?
        const choice = prompt("Choose an option or (b)ail: ").toLowerCase();
        if (choice == 'b')
            break;// break the while(true);
        const number = Number(choice);
        if (number < 0 || number >= sessions.Length()) {
            console.log("out-of-range");
            break;
        }

        // now play the book
        const session = sessions.Get(number);
        PlayPlayable(session.playable);

    }// end while true of selecting a section

}// end fn


