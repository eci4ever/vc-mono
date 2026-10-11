import { useEffect } from 'react'

import { BRAND_NAME } from '@/lib/brand'

/** Set the document title per SPA route (WCAG 2.4.2 Page Titled). */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · ${BRAND_NAME}`
  }, [title])
}
