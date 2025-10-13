import { Button } from '@/components/ui/shared/button'
import { XIcon } from 'lucide-react'
import React, { Suspense } from 'react'

const ButtonClient = () => {
  return (
    <Suspense fallback={null}>
      <Button
        variant="ghost"
        size="sm"
        // onClick={() => setShowDescription(false)}
        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </Suspense>
  )
}

export default ButtonClient