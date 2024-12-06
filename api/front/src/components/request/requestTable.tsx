import { ListTable, TableHeader, TableRow, TableCell } from "@freee_jp/vibes"

function RequestTable(){

    //fetch data

    const headerArr = [{value: "Request No."}, {value: "Status"}, 
        {value: "Requestor"}, {value: "Category"}, {value: "Department"}, 
        {value: "Current Approval Stage"}, {value: "Participants"}]

    // iterate through data, format in row 
    
    const cell = {value: <div>test</div>}

    const rows : TableRow[] = [{cells: [cell] }]


    
    return(
      <div>
        <ListTable headers = {headerArr} rows={rows}/>
      </div>
   
    )
}

export default RequestTable