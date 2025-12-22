import Head from 'next/head'
import { useNewDomainPage } from './hook'
import BackButtonSection from '@/components/common/BackButtonSection'
import { NewDomainForm } from '@/components/common/NewDomainForm'

export default function NewDomain() {
  const { onSuccess, handleBack } = useNewDomainPage()

  return (
    <>
      <Head>
        <title>Console | New Domain | Aleph Cloud</title>
        <meta
          name="description"
          content="Register a custom domain for your Aleph Cloud resources"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <NewDomainForm centered showResourceSelection onSuccess={onSuccess} />
    </>
  )
}
