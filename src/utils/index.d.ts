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

// Chrome API functions
export declare function getTabs(): Promise<Tab[]>;

// Copy API functions  
export declare function getLink(id: string, tabs: Tab[]): Promise<string>;

// Storage functions
export declare function saveToChromeStorage(key: string, value: any): Promise<void>;

// Browser abstraction
export declare const Browser: {
  info: {
    getCurrent(): string;
    getVersion(): string;
    isChrome(): boolean;
    isFirefox(): boolean;
    isSafari(): boolean;
    isEdge(): boolean;
  };
  api: any;
  quirks: {
    copyToClipboard(text: string): Promise<boolean>;
  };
  utils: any;
};
