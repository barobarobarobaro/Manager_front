import { Suspense } from 'react'
import PaymentCompletePage from './completepage'
export default function complete() {

  return (
        <Suspense>
        	<PaymentCompletePage />
        </Suspense>
  )
}