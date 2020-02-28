export class TestService {
    private _text: string
    
    constructor() {}

    writeText(text: string) {
        this._text = text;
        console.log(this._text);
    }

    getText() : string {
        return this._text;
    }
}