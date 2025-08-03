// Type declarations for utils
export interface Tab {
  id: number;
  windowId: number;
  favIconUrl?: string;
  title: string;
  url: string;
  highlighted: boolean;
  active: boolean;
}

export declare function getTabs(): Promise<Tab[]>;
export declare function getLink(id: string, tabs: Tab[]): Promise<string>;
export declare function saveToChromeStorage(key: string, value: any): Promise<void>;

export declare const Browser: {
  quirks: {
    copyToClipboard(text: string): Promise<boolean>;
  };
  api: any;
};
