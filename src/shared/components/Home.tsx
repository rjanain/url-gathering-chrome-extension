import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { HomeCard } from "./home/HomeCard"
import { OptionCard } from "./options/OptionCard"
import { Button } from "../../components/ui/button"

export function Header() {
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
