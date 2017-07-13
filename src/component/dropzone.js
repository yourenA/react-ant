/**
 * Created by Administrator on 2016/11/22.
 */
import React from 'react';
import {message} from 'antd';
import DropzoneComponent from 'react-dropzone-component';
import './../common/css/dropzone.min.css';
import './../common/css/filepicker.css';
import {getHeader,converErrorCodeToMsg} from './../common/common';
class Dropzone extends React.Component {
    constructor(props) {
        super(props);
        this.dropzone = null;
    }
    handleFileAdded=(file)=> {
        console.log(file);
    }
    callbackFile=()=>{
        this.dropzone.processQueue();
    }
    success=(file)=>{
        console.log(file);
        if(file.xhr.status===200){
            const that=this
            message.success('导入成功');
            that.props.setImportModalFalse()
            setTimeout(function () {
                that.props.onTempChangeSearch(1);

            },500)
        }
    }
    error=(file,errorMessage )=>{
        console.log("errorMessage",errorMessage)
        if(typeof errorMessage === 'object'){
            message.error(errorMessage.message);
        }else{
            message.error(errorMessage);
        }
    }
    render() {
        const iconFiletypes = ['csv','txt'];
        const maxFiles = 1;
        const componentConfig = {
            iconFiletypes: iconFiletypes,
            showFiletypeIcon: true,
            postUrl: this.props.postUrl
        };
        const djsConfig = {
            paramName:'file',//paramName相当于input的name
            maxFiles: maxFiles,
            acceptedFiles:'.csv,.txt',
            dictDefaultMessage: '拖拽文件或点击上传(csv,txt)，最大同时上传文件数量:1',
            dictFallbackMessage: '您的浏览器不支持拖放文件上传',
            dictInvalidFileType:  '上传必须是csv或txt',
            dictMaxFilesExceeded: '上传文件数量超过限定',
            autoProcessQueue: false,
            addRemoveLinks:true,
            dictRemoveFile:'删除文件',
            headers: getHeader(),
            params:{
                batch_id:this.props.batchId
            }
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            addedfile: this.handleFileAdded,
            error:this.error,
            success: this.success,
        };
        return (
            <DropzoneComponent
                config={componentConfig}
                djsConfig={djsConfig}
                eventHandlers={eventHandlers}
            >
            </DropzoneComponent>
        );
    }
}

export default Dropzone;
