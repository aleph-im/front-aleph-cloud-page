import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import CompositeTitle from "@/components/CompositeTitle";
import useConnected from "@/helpers/hooks/useConnected";

export default function Home( ) { 
  useConnected()

  return (
    <>
      <section>
        <AutoBreadcrumb />
      </section>

      <CenteredSection>
        <CompositeTitle number="1" title="Code to execute" type="h4" color="main1" />
      </CenteredSection>

      <CenteredSection>
        <CompositeTitle number="2" title="Choose runtime" type="h4" color="main1" />
      </CenteredSection>

      <CenteredSection>
        <CompositeTitle number="3" title="Type of scheduling" type="h4" color="main1" />
      </CenteredSection>

      <CenteredSection>
        <CompositeTitle number="4" title="Name and tags" type="h4" color="main1" />
      </CenteredSection>

      <CenteredSection className="unavailable-content">
        <CompositeTitle number="5" title="Custom domain" type="h4" color="main1" label="(SOON)" />
      </CenteredSection>

      <CenteredSection>
        <CompositeTitle number="6" title="Add volumes" type="h4" color="main1" />
      </CenteredSection>
    </>
  )
}