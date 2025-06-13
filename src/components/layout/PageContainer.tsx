import React from 'react';
import { ScrollArea } from '@ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)]'>
          <div className='w-full max-w-none mx-auto p-4 md:px-8 lg:px-12 xl:px-16'>
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className='w-full max-w-none mx-auto p-4 md:px-8 lg:px-12 xl:px-16'>
          {children}
        </div>
      )}
    </>
  );
}