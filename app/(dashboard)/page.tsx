import CreateCollection from '@/components/CreateCollection'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'
import { FaceIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Suspense } from 'react'

const Home = async () => {
    return (
        <>
            <Suspense fallback={<WelcomeMsgFallback />}>
                <WelcomeMsg />
            </Suspense>
            <Suspense fallback={<div>Loading collections...</div>}>
                <CollectionList />
            </Suspense>
        </>
    )
}

export default Home

async function WelcomeMsg() {
    const user = await currentUser()
    if (!user) return <div>Not logged in</div>

    return (
        <div className='flex w-full mb-12'>
            <h1 className='text-4xl font-bold'>
                Welcome, <br /> {user.firstName} {user.lastName}
            </h1>
        </div>
    )
}

function WelcomeMsgFallback() {
    return (
        <div className='flex w-full mb-12'>
            <h1 className='text-4xl font-bold'>
                <Skeleton className='w-[180px] h-[36px]' />
                <Skeleton className='w-[150px] h-[36px]' />
            </h1>
        </div>
    )
}

async function CollectionList() {
    const user = await currentUser()
    const collections = await prisma.collection.findMany({
        where: {
            userId: user?.id,
        },
    })

    if (collections.length === 0)
        return (
            <div className='flex flex-col gap-6'>
                <Alert className='p-6'>
                    <InfoCircledIcon className='h-8 w-8 text-neutral-500 dark:text-neutral-400 mr-4' />
                    <div className='ml-4'>
                        <AlertTitle className='text-lg bold '>
                            You have no collections
                        </AlertTitle>
                        <AlertDescription>
                            Create a collection to get started.
                        </AlertDescription>
                    </div>
                </Alert>
                <CreateCollection />
            </div>
        )
}
