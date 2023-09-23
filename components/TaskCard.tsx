"use client"

import { Task } from '@prisma/client'
import { Checkbox } from './ui/checkbox'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useTransition } from 'react'
import { setTaskDone } from '@/actions/tasks'
import { useRouter } from 'next/navigation'

export default function TaskCard({task}: {task: Task}) {

    const [isLoading, startTransition] = useTransition()
    const router = useRouter()
    const getExpirationColor = (expiresAt: Date) => {
        const days = Math.floor(expiresAt.getTime() - Date.now() / (1000 / 60 / 60))
        if(days < 0) return "text-gray-300 dark:text-gray-400"
        if(days <= 3 * 24) return "text-red-500 dark:text-red-400"
        
        if(days <= 7 * 24) return "text-orange-500 dark:text-red-400"
    }

    return (
    <div className='flex gap-2 items-start p-4 '>
        <Checkbox 
            className='w-5 h-5' 
            checked={task.done} 
            id={task.id.toString()}
            disabled={isLoading || task.done}
            onCheckedChange={() => {
                startTransition( async () => {
                    await setTaskDone(task.id)
                    router.refresh()
                })

        }} />
        <label
            htmlFor={task.id.toString()}
            className={cn("test-sm font-medium leading-none peer-diabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white", task.done && "line-through")}
        >
            {task.content}
            {task.expiresAt && (
                <p className={cn("text-xs text-neutral-500 dark:text-neutral-400",
                    getExpirationColor(task.expiresAt)
                )} >
                    {format(task.expiresAt, "dd/MMM/yyyy")}

                </p>
            )}
        </label>
    </div>
    )
}
