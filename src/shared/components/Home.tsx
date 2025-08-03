import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { HomeCard } from "./home/HomeCard"
import { OptionCard } from "./options/OptionCard"
import { Button } from "../../components/ui/button"

You can remove the duplication by extracting a generic Tabs component (with built-in header + pane logic), and a small TabPane for the card wrapper. Then your Home.tsx becomes just a single call with your two panes.

1) Create a reusable Tabs and TabPane:

```tsx
// src/components/Tabs.tsx
import React, { useState } from "react";
import { Button } from "./ui/button";

export type TabItem<Key extends string> = {
  key: Key;
  label: React.ReactNode;
  content: React.ReactNode;
};

export function Tabs<Key extends string>({ items }: { items: TabItem<Key>[] }) {
  const [active, setActive] = useState<Key>(items[0].key);
  return (
    <>
      <div className="flex space-x-1 border-b">
        {items.map(({ key, label }) => (
          <Button
            key={key}
            variant={active === key ? "default" : "ghost"}
            className="flex-1 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
            data-active={active === key}
            onClick={() => setActive(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      {items.map(
        ({ key, content }) => key === active && <div key={key}>{content}</div>
      )}
    </>
  );
}

export function TabPane({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
    const [activeTab, setActiveTab] = useState<'home' | 'option'>('home');

    return (
        <div className="flex space-x-1 border-b">
            <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                className="flex-1 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
            >
                App
            </Button>
            <Button
                variant={activeTab === 'option' ? 'default' : 'ghost'}
                className="flex-1 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={activeTab === 'option'}
                onClick={() => setActiveTab('option')}
            >
                Settings
            </Button>
        </div>
    )
}

export function HomeTab() {
    return (
        <div>
            <Card className="w-full max-w-sm">
                <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold">LinkPilot</h3>
                </CardHeader>
                <CardContent>
                    <HomeCard />
                </CardContent>
            </Card>
        </div>
    )
}

export function OptionTab() {
    return (
        <div>
            <Card className="w-full max-w-sm">
                <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold">Settings</h3>
                </CardHeader>
                <CardContent>
                    <OptionCard />
                </CardContent>
            </Card>
        </div>
    )
}
