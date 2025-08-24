export type TreeItem = 
    string | [string, ...TreeItem[]]
;

export type Tree = TreeItem[];
