'use client'

import { Collection, Task } from '@prisma/client'
import React, { useMemo, useState, useTransition } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from './ui/collapsible'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import {
    CaretDownIcon,
    CaretUpIcon,
    PlusCircledIcon,
    TrashIcon,
} from '@radix-ui/react-icons'
import { CollectionColor, CollectionColors } from '@/lib/constants'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog'
import { deleteCollection } from '@/actions/collection'
import { toast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import CreateTaskDialog from './CreateTaskDialog'
import TaskCard from './TaskCard'

interface Props {
    collection: Collection & {
        tasks: Task[];
    }
}



export default function CollectionCard({ collection }: Props) {
    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter()
    const tasks = collection.tasks
    const [isLoading,startTransition] = useTransition()
    const [createModal, setShowCreateModal] = useState(false)


    const removeCollection = async () => {
        try {
            await deleteCollection(collection.id)
            toast({
                title:"Success",
                description:"Collection deleted successfully",
            })
            router.refresh()
        }catch(err){
            toast({
                title:"Error",
                description:"Something went wrong",
                variant:"destructive"
            })
        }
    }

    const tasksDone = useMemo(() => {
        return collection.tasks.filter((task) => task.done).length;
    }, [collection.tasks]);
    
    const totalTasks = collection.tasks.length;
    
    const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;
    


    return (
        <>
        <CreateTaskDialog 
            open={createModal}
            setOpen={setShowCreateModal}
            collection={collection}
        />
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant={'ghost'}
                    className={cn(
                        'flex w-full justify-between p-6',
                        isOpen && 'rounded-b-none',
                        CollectionColors[collection.color as CollectionColor]
                    )}
                >
                    <span className='text-white font-bold text-lg'>
                        {collection.name}
                    </span>
                    {!isOpen && <CaretDownIcon className='w-6 h-6' />}
                    {isOpen && <CaretUpIcon className='w-6 h-6 ' />}
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className='flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg'>
                {tasks.length === 0 && 
                    <Button
                        variant="ghost"
                        className='flex items-center justify-center gap-1 p-8 py-12 rounded-none'
                        onClick={() => setShowCreateModal(true)}
                    >

                            <p>There are no tasks yet : </p>
                            <span className={cn("text-sm bg-clip-text text-transparent", CollectionColors[collection.color as CollectionColor])} >Create one</span>
                    </Button>
                }
                {tasks.length > 0 && (
                    <>
                        <Progress
                            className='rounded-none'
                            value={progress} 
                        />
                        <div className=''>
                            {tasks.map((task : Task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </>
                )}
                <Separator />
                <footer className='h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center  '>
                    <p>Created at {collection.createAt.toDateString()}</p>
                    {isLoading && <div>Deleting ...</div>}
                    
                    { !isLoading && <div className=''>
                        <Button
                            size='icon'
                            variant='ghost'
                            onClick={() => setShowCreateModal(true)}
                        >
                            <PlusCircledIcon className='w-6 h-6 ' />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                >
                                    <TrashIcon className='w-6 h-6 ' />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogTitle>
                                Are you absolutely sure ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently be deleted
                                
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        startTransition(removeCollection)
                                    }} >
                                        Proceed
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>}
                </footer>
            </CollapsibleContent>
        </Collapsible>
        </>
    )
}
