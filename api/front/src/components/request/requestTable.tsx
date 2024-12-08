import { 
  ListTable, 
  TableRow,
  Text, 
  StatusIcon,
  Stack,
 } from "@freee_jp/vibes"
import { useState, useEffect } from "react"

interface RequestTableContainerPropsInterface{
  requests: Request[] | null
}

interface Request{
  id: number, 
  overall_status: string, 
  user: User, 
  purchase_category: string, 
  department: string, 
  current_stage: string, 
  approvals: Approval[]
}

interface User{
  department: string, 
  name: string,
}

interface Approval{
  reviewer : { name: string }
}

interface RequestTablePropsInterface{
  rows: TableRow[]
}

function RequestTable({rows} : RequestTablePropsInterface ){

  const headerArr = [
    {value: "Request No."}, 
    {value: "Status"}, 
    {value: "Requestor"}, 
    {value: "Category"},
    {value: "Department"}, 
    {value: "Current Approval Stage"}, 
    {value: "Participants"}
  ]

  return(
    <ListTable headers = {headerArr} rows={rows}/>
  )

}

function RequestTableContainer({requests} : RequestTableContainerPropsInterface ){
  const [rows, setRows] = useState<TableRow[]>([])

  const setStatus = (status: string) => {
    switch (status){
      case "pending": 
        return (
          <StatusIcon type="progress">{status}</StatusIcon>
        )
      case "accepted": 
        return (
          <StatusIcon type="success">{status}</StatusIcon>
        )
      case "rejected": 
        return (
          <StatusIcon type="error">{status}</StatusIcon>
        )
    }
  }

  useEffect(() => {
    if(requests){
      let rows = []; 
      for(let i = 0; i < requests.length; i++){
        const cRequest = requests[i]
          rows.push({cells: [
            { value: <Text>{cRequest.id}</Text>}, 
            { value: setStatus(cRequest.overall_status) }, 
            { value: <Text>{cRequest.user.name}</Text >}, 
            { value: <Text>{cRequest.purchase_category}</Text> },
            { value: <Text>{cRequest.user.department}</Text> }, 
            { value: <Text>{cRequest.current_stage}</Text> }, 
            { value: 
              <Stack>
                {cRequest.approvals.map((approval, key) => <Text key={key}>{approval.reviewer ? approval.reviewer.name : "TBA"}</Text>) }
              </Stack>
            }
          ]
      })
      setRows(rows)
    }
   
}}, [requests]) 

    
    return(
      <RequestTable rows = {rows}/>
    )
}

export default RequestTableContainer