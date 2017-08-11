/**
 * Created by Administrator on 2017/3/24.
 */
import React, {Component} from 'react';
import { Select,Button} from 'antd';
import {getHeader,converErrorCodeToMsg} from './../../common/common.js';
import configJson from 'configJson' ;
import axios from 'axios';
import uuidv4 from 'uuid/v4';
const Option = Select.Option;

class FetchSegments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentsJson: '{}',
        };
    }
    onChangeSegment=(id)=>{
        const that = this;
        axios({
            url: `${configJson.prefix}/flow_diagrams/${id}`,
            method: 'get',
            headers: getHeader()
        })
            .then(function (response) {
                console.log(response);
                that.setState({
                    segmentsJson: response.data.content,
                })
            }).catch(function (error) {
            console.log('获取出错',error);
            converErrorCodeToMsg(error)
        })
    }
    addGraphical = ()=> {
        let myDiagram=this.props.ScriptIndex.callbackDiagram()
        let scrollAndBounds=this.props.ScriptIndex.callbackScrollAndBounds();
        let originHadJson = JSON.parse(this.state.segmentsJson);
        if(!originHadJson.nodeDataArray){
            return false
        }else{
            console.log('originHadJson',originHadJson);
            let keyUuidArr = [];
            for (let k = 0, len3 = originHadJson.nodeDataArray.length; k < len3; k++) {
                let uuid2 = uuidv4();
                keyUuidArr.push({key: originHadJson.nodeDataArray[k].key, uuid: uuid2});

            }
            for (let i = 0, len1 = keyUuidArr.length; i < len1; i++) {
                if(i===0){
                    const parseLoc = originHadJson.nodeDataArray[0].loc.split(' ');
                    const externalX=scrollAndBounds.left+(scrollAndBounds.scrollLeft||0)+200;
                    const externalY=scrollAndBounds.top+(scrollAndBounds.scrollTop||0)+180;
                    originHadJson.nodeDataArray[0].loc = `${externalX} ${externalY}`;
                    const distanceX=parseInt(parseLoc[0])-externalX;
                    const distanceY=parseInt(parseLoc[1])-externalY;
                    for (let m = 0, len5 = keyUuidArr.length; m < len5; m++) {
                        if(m!==0){
                            const parseLeftOverLoc = originHadJson.nodeDataArray[m].loc.split(' ');
                            originHadJson.nodeDataArray[m].loc = `${parseInt(parseLeftOverLoc[0])-distanceX} ${parseInt(parseLeftOverLoc[1])-distanceY}`;
                        }

                    }
                }


                if (originHadJson.nodeDataArray[i].group) {
                    for (let n = 0, len4 = keyUuidArr.length; n < len4; n++) {
                        if (originHadJson.nodeDataArray[i].group === keyUuidArr[n].key) {
                            originHadJson.nodeDataArray[i].group = keyUuidArr[n].uuid
                        }
                    }
                }

                if (originHadJson.nodeDataArray[i].isGroup) {
                    originHadJson.nodeDataArray[i].key = keyUuidArr[i].uuid;
                }


                for (let j = 0, len2 = originHadJson.linkDataArray.length; j < len2; j++) {
                    if (originHadJson.linkDataArray[j].from === keyUuidArr[i].key) {
                        originHadJson.nodeDataArray[i].key = keyUuidArr[i].uuid;
                        originHadJson.linkDataArray[j].from = keyUuidArr[i].uuid;
                    }
                    if (originHadJson.linkDataArray[j].to === keyUuidArr[i].key) {
                        originHadJson.nodeDataArray[i].key = keyUuidArr[i].uuid;
                        originHadJson.linkDataArray[j].to = keyUuidArr[i].uuid;
                    }
                }
            }

            for (let h = 0, len = originHadJson.nodeDataArray.length; h < len; h++) {
                myDiagram.model.addNodeData(originHadJson.nodeDataArray[h]);
            }
            for (let g = 0, len = originHadJson.linkDataArray.length; g < len; g++) {
                myDiagram.model.addLinkData(originHadJson.linkDataArray[g]);
            }
        }


    }
    render() {
        return (
            <div className="inline-block">
                <span>选择脚本 : </span>
                <Select   className="search-select"
                          showSearch
                          onChange={this.onChangeSegment}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    { this.props.fetchTestConf.segments.map((item, key) => {
                        return (
                            <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                        )
                    }) }
                </Select>
                <Button type='primary' onClick={this.addGraphical} style={{marginLeft:'10px'}}>添加</Button>
            </div>

        );
    }
}
export default FetchSegments;