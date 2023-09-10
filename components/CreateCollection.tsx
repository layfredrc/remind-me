'use client'

import { Button } from './ui/button'
import CreateCollectionSheet from './CreateCollectionSheet'
import { useState } from 'react'

export default function CreateCollection() {
    const [open, setOpen] = useState(false)
    const handleOpenChange = (open: boolean) => setOpen(open)
    return (
        <div
            className='
        w-full rounded-md bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 p-[1px]'
        >
            <Button
                variant={'outline'}
                className='dark:text-white w-full dark:bg-neutral-950 bg-white'
                onClick={() => setOpen(true)}
            >
                <span className='bg-gradient-to-r from-red-500 to-orange-500 hover:to-orange-800 bg-clip-text text-transparent'>
                    Create collection
                </span>
            </Button>
            <CreateCollectionSheet
                open={open}
                onOpenChange={handleOpenChange}
            />
        </div>
    )
}
