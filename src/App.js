import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Button,  message,List,Card ,Row, Col} from 'antd';
 
import * as XLSX from 'xlsx';
let styles = {
    'file-uploader':'height:30px',
    'upload-text':'height:30px',
    'upload-tip':'display:block'
}
export default class App extends Component {
 
  constructor(props){
super(props);
this.state = []
  }
    onImportExcel = file => {
      console.log(file)
        const { files } = file.target;
 
        // Read the file through the FileReader object
 
        const fileReader = new FileReader();
 
        fileReader.onload = event => {
 
            try {
 
                const { result } = event.target;
 
                                 // Read the entire excel table object in binary stream
 
                const workbook = XLSX.read(result, { type: 'binary' });
 
                                 // Store the obtained data
 
                let data = [];
 
                                 // traverse each worksheet to read (here by default only the first sheet is read)
 
                for (const sheet in workbook.Sheets) {
 
                    // esline-disable-next-line
 
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
 
                                                 // Use sheet_to_json method to convert excel to json data
                        //console.log(workbook.Sheets[sheet]);
                        data = workbook.Sheets[sheet]
                        
                        //data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));

 
                                                 // break; // If only the first table is taken, uncomment this line
 
                    }
 
                }
 
                                 // Finally obtained and formatted json data
 
                                 message.success('Successful upload!')
                let excelRowsObjArr = XLSX.utils.sheet_to_row_object_array(data)
                
                let vans = []
                for (let i = 13;i<excelRowsObjArr.length;i++){
                  if (!String((data[`A${i}`]?.v)).includes("Total")){
                    if (!vans.includes(String((data[`A${i}`]?.v)))){
                      vans.push(String((data[`A${i}`]?.v)));
                    }
                  }
                 
                }
                var out = []
                vans.forEach(van=>{
                  let totalVan = 0.0
                  for (let i = 13;i<excelRowsObjArr.length;i++){
                    if (String((data[`A${i}`]?.v)) === van){
                      if((data[`K${i}`]?.v) !== 0.0){
                        totalVan += (data[`R${i}`]?.v)
                      }
                    }
                    
                  }
                  out.push({van:van,total:Math.round(totalVan)})
                  
                });
                console.log(out)
                this.setState({out:out})
                /*console.log(data);
                data.forEach(element => {
                  console.log(element[0])
                });*/
 
            } catch (e) {
 
                                 // Relevant prompts for incorrect file type errors can be thrown here
                console.log(e, 'eeee')
 
                                 message.error('The file type is incorrect!');
 
            }
 
        };
 
                 // Open the file in binary mode
 
        fileReader.readAsBinaryString(files[0]);
 
    }
    render() {
     
    
        return (
 
            <div>
  
 <Row justify="space-around" align="middle" gutter={[32, 32]}>
   <Col >
                <Button >
 
                    
 
                    <input className={styles['file-uploader']} type='file' accept='.xlsx' onChange={this.onImportExcel} />
 
                                         <span className={styles['upload-text']}>Upload files</span>
 
                </Button>
                <p className={styles['upload-tip']}>Support que le format .xlsx </p>
                </Col>
                </Row>
                <Row justify="space-around" align="middle">
                <Col span={24}>
                 
 
                                 
                                 <List
    grid={{
      gutter: 16,
      xs: 1,
      sm: 2,
      md: 4,
      lg: 4,
      xl: 6,
      xxl: 3,
    }}
    dataSource={this.state.out}
    renderItem={item => (
      <List.Item>
        <Card title={item.van}>{item.total} DA</Card>
      </List.Item>
      
    )}
    />
     </Col>
                </Row>
 
            </div >
 
        );
 
    }
 
}
 
