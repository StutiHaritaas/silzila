import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Menu, Autocomplete,TextField,Button, Dialog,
	DialogContent,
	DialogTitle, } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

import {fieldName} from '../../../CommonFunctions/CommonFunctions';
import {getGeoJSON} from '../GeoJSON/MapCommonFunctions';
import { Dispatch } from "redux";
import {changeGeoMapUnMatched} from '../../../../redux/ChartPoperties/ChartPropertiesActions';


const GoeMismatch = ({  
    propKey,
    open,
    handleClose,
    misMatchList,
    changeGeoMapUnMatched,

    //state
    chartControls, 
    chartProperties}:any)=>{

        let options:any = [];
        let dimensionName = chartProperties.properties[propKey].chartAxes[1].fields[0];
        dimensionName = fieldName(dimensionName)
        //changeGeoMapUnMatched(propKey, misMatchList);

        let tempArray = [];

        if(chartProperties.properties[propKey].Geo.unMatchedChartData && chartProperties.properties[propKey].Geo.unMatchedChartData.length > 0){
            tempArray = chartProperties.properties[propKey].Geo.unMatchedChartData;
        }
        else{
            tempArray = misMatchList;
        }

        const [unMatchedArray, setUnMatchedArray] = useState<any>(tempArray);

        useEffect(()=>{
            if(chartProperties.properties[propKey].Geo.unMatchedChartData && chartProperties.properties[propKey].Geo.unMatchedChartData.length > 0){
                setUnMatchedArray(chartProperties.properties[propKey].Geo.unMatchedChartData);
            }
            else{
                setUnMatchedArray(misMatchList);
            }
        },[misMatchList, chartProperties.properties[propKey].Geo.unMatchedChartData])

       
        let mapJSON = getGeoJSON(chartProperties.properties[propKey].Geo.geoLocation);

        options = mapJSON.features.map((item:any)=>{
            if(chartProperties.properties[propKey].Geo.geoMapKey === "name"){
                return  "".concat(item.properties["name"]);
            }
            else{
                return  "".concat(item.properties[chartProperties.properties[propKey].Geo.geoMapKey], "; ", item.properties["name"]);
            }
        })

        options.sort();

        //options.sort((a:any,b:any)=>{ return a.key - b.key;});


        const handleLocationOnChange =(e:any, name:string)=>{
          //  console.log(e.currentTarget.innerText, name);
            let list  = JSON.parse(JSON.stringify(unMatchedArray));
           // let list = chartProperties.properties[propKey].Geo.unMatchedChartData?.length > 0 ? chartProperties.properties[propKey].Geo.unMatchedChartData : misMatchList;

            let matchIndex = list.findIndex((item:any)=>{
                    return item[dimensionName] === name;
                })

                list[matchIndex].selectedKey = e.currentTarget.innerText;

            setUnMatchedArray(list);

           // changeGeoMapUnMatched(propKey, list[matchIndex], matchIndex);
        }

        const handleOkButtonClick = () =>{

            changeGeoMapUnMatched(propKey, unMatchedArray);
            handleClose();
        }

        const handleCloseButtonClick = ()=>{

            if(chartProperties.properties[propKey].Geo.unMatchedChartData && chartProperties.properties[propKey].Geo.unMatchedChartData.length > 0){
                setUnMatchedArray(chartProperties.properties[propKey].Geo.unMatchedChartData);
            }
            else{
                setUnMatchedArray(misMatchList);
            }

            handleClose();
        }

        const UnMatchedListComponent = ()=>{
            return (
                unMatchedArray.map((item:any, index:number)=>{
                    let defaultVal = unMatchedArray.find((selectedItem:any)=>{
                        return selectedItem[dimensionName] === item[dimensionName]
                    })?.selectedKey;

                    return(                   
                    <div key={index} style={{width:"100%", "display":"flex","flexDirection":"row", "columnGap":"4rem", "marginTop": "15px"}}>
                        <span style={{width:"12rem", wordWrap:"normal"}}>{item[dimensionName]}</span>

                        <Autocomplete
                            defaultValue={""}   
                            value={defaultVal}                        
                            disablePortal
                            id="combo-box-demo"
                            onChange={(e:any)=>handleLocationOnChange(e, item[dimensionName])}
                            options={options}
                            sx={{ width: "18rem" }}
                            renderInput={(params) => <TextField {...params} label="Location" />}
                            />
                    </div>  
                    )
                })
            )
        }

    return(
        <Dialog
        id="basic-menu"
        className="geoHelpTable"
        open={open}      
        PaperProps={{
            sx: {
                minHeight: "20%",
            },
        }}
        >      
            <DialogTitle sx={{
						display: "flex",
						flexDirection: "row",
						columnGap: "2rem",
						justifyContent: "space-between",
						fontSize: "16px",
					}}>
                <h3  style={{paddingLeft:"1rem"}} tabIndex={-1}>Unmatched Locations</h3>
                <CloseOutlined onClick={handleCloseButtonClick} style={{ float: "right" }} />
            </DialogTitle>
            <DialogContent sx={{"height":"25rem" ,"overflowY":"auto"}}>               
                <UnMatchedListComponent></UnMatchedListComponent>     
                      
            </DialogContent> 
            <div style={{
						display: "flex",
						flexDirection: "row-reverse",					
						fontSize: "16px",
					}}>
                <Button onClick={handleCloseButtonClick}>Cancel</Button>  
                <Button onClick={handleOkButtonClick}>Save</Button>          
            </div>                               
        </Dialog>        
    )
}

const mapStateToProps = (state:  any) => {
	return {	
        chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changeGeoMapUnMatched: (propKey: string, value: string) =>
			dispatch(changeGeoMapUnMatched(propKey, value)),
        }
    };

export default connect(mapStateToProps, mapDispatchToProps)(GoeMismatch);