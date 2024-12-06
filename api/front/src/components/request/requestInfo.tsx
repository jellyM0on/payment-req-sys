import { CardBase,
    ColumnBase,
    SectionTitle,
    ButtonGroup,
    Button,
    BackwardButton,
    Stack, 
    DescriptionList,
    GridWrapper,
    GridBlock
} from "@freee_jp/vibes"
  
import { useEffect, useState } from "react"

  function RequestForm(){

      return(
       <ColumnBase>
            <CardBase>
                <div className="flex flex-col">
                    {/* vendor info */}
                    <div>
                        <Stack direction="horizontal" alignItems="center" justifyContent="space-between" mb={1}> 
                            <SectionTitle>Vendor Information</SectionTitle>
                            <ButtonGroup>
                                <BackwardButton>Back to Home</BackwardButton>
                                <Button appearance="primary">Accept</Button>
                                <Button appearance="primary" danger>Reject</Button>
                            </ButtonGroup>
                        </Stack>
                        <DescriptionList listContents={[
                                {
                                    title: <DescriptionList listContents={[{title: "Name", value: "value"}]}/>, 
                                    value: <DescriptionList listContents={[{title: "Vendor Name", value: "value"}]}/>, 
                                },
                                {
                                    title: "Address", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Contact No.", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Attachment", 
                                    value: "testvalue"
                                },
                        ]} />



                        {/* <GridWrapper ma={0.5}>
                            <GridBlock size={"half"}>
                                <DescriptionList listContents={[
                                {
                                    title: "Vendor Name", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Address", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Contact No.", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Attachment", 
                                    value: "testvalue"
                                },
                                ]} />
                            </GridBlock>
                            <GridBlock size={"half"}>
                                <DescriptionList listContents={[
                                {
                                    title: "Tax Identification Number (TIN)", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Email Address", 
                                    value: "testvalue"
                                },
                                {
                                    title: "Certificate of Registration", 
                                    value: "testvalue"
                                },
                                ]} />
                            </GridBlock>
                        </GridWrapper> */}
                      

                
                    </div>



                    <div></div>
                    <div></div>
                    </div>
                            
            </CardBase>
       
       </ColumnBase>
    
      )
  }
  
  export default RequestForm;