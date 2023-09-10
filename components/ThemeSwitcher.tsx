'use client'
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { TabsTrigger, Tabs, TabsList } from '@radix-ui/react-tabs'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // useEffect only runs on the client, so we can safely show the UI without hydration issues

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <Tabs defaultValue={theme}>
            <TabsList className='justify-between flex gap-4 items-center'>
                <TabsTrigger
                    className='border dark:border-neutral-800 dark:bg-[#030303] p-2 rounded-full transition-all'
                    value='light'
                    onClick={(e) => setTheme('light')}
                >
                    <SunIcon className='h-[1.2rem] w-[1.2rem]' />
                </TabsTrigger>
                <TabsTrigger
                    className='border dark:border-neutral-800 dark:bg-[#030303] p-2 rounded-full transition-all'
                    value='dark'
                    onClick={(e) => setTheme('dark')}
                >
                    <MoonIcon className='h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0' />
                </TabsTrigger>
                <TabsTrigger
                    className='border dark:border-neutral-800 dark:bg-[#030303] p-2 rounded-full transition-all'
                    value='system'
                    onClick={(e) => setTheme('system')}
                >
                    <DesktopIcon className='h-[1.2rem] w-[1.2rem]' />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default ThemeSwitcher
