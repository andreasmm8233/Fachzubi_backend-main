export declare class Database {
    private readonly mongoURI;
    constructor(uri: string);
    connect(): void;
}
