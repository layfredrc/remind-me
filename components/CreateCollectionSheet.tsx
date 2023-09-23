import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from './ui/sheet'
import { useForm } from 'react-hook-form'
import {
    createCollectionSchema,
    createCollectionSchemaType,
} from '@/schema/createCollection'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from './ui/form'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { CollectionColor, CollectionColors } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { createCollection } from '@/actions/collection'
import { toast } from './ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateCollectionSheet({ open, onOpenChange }: Props) {
    const form = useForm<createCollectionSchemaType>({
        defaultValues: {},
        resolver: zodResolver(createCollectionSchema),
    })

    const router = useRouter()

    const onSubmit = async (data: createCollectionSchemaType) => {
        try {
            await createCollection(data)

            onOpenChangeWrapper(false)
            router.refresh()

            toast({
                title: 'Success',
                description: 'Collection created successfully',
            })
        } catch (err) {
            toast({
                title: 'Error',
                description: "Couldn't create collection",
                variant: 'destructive',
            })
            console.log('Error while creating collection', err)
        }
    }

    const onOpenChangeWrapper = (open: boolean) => {
        form.reset()
        onOpenChange(open)
    }

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChangeWrapper}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add new collection</SheetTitle>
                    <SheetDescription>
                        Collections are a way to group your tasks
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 flex flex-col'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Task'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Collection name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='color'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(color) =>
                                                field.onChange(color)
                                            }
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    'w-full h-8 text-white',
                                                    CollectionColors[
                                                        field.value as CollectionColor
                                                    ]
                                                )}
                                            >
                                                <SelectValue
                                                    placeholder='Color'
                                                    className='w-full h-8'
                                                />
                                            </SelectTrigger>
                                            <SelectContent className='w-full'>
                                                {Object.keys(
                                                    CollectionColors
                                                ).map((color) => (
                                                    <SelectItem
                                                        value={color}
                                                        key={color}
                                                        className={cn(
                                                            `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-8`,
                                                            CollectionColors[
                                                                color as CollectionColor
                                                            ]
                                                        )}
                                                    >
                                                        {color}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Select a color for your collection
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <div className='flex flex-col gap-3 mt-4'>
                    <Separator />
                    <Button
                        disabled={form.formState.isSubmitting}
                        variant='outline'
                        onClick={form.handleSubmit(onSubmit)}
                        className={cn(
                            CollectionColors[
                                form.getValues('color') as CollectionColor
                            ]
                        )}
                    >
                        Confirm
                        {form.formState.isSubmitting && (
                            <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
