import { Cloud, PlusIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'
import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'

interface IAppProps {
  title: string
  description: string
  buttonText: string
  href: string
}

export const EmptyState = ({
  title,
  description,
  buttonText,
  href,
}: IAppProps) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10">
          <Cloud className="size-5 text-primary" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={href} className={buttonVariants()}>
          <PlusIcon />
          {buttonText}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
