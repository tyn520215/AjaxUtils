/***************************************************************************************
 * Ajax接口工具类，供UI层调用Server层业务处理Action调用功能，
 * 调用方法:
 *          AjaxUtils.doRequest({
 *              url : "../xxxPath/xxx.action",          //action路径
 *              loadingShowZone :
 *              showZone :
 *              type : "post",                          //post/get，默认为post
 *              formData : {.....},                         //表单数据，如果无此参数，则不需要传入
 *              async : false,                          //是否异步，默认为false，如果不修改此参数，则不需要传入
 *              dataType : "text",                      //数据类型text/html...,默认为text，如果不修改此参数，则不需要传入
 *              contentType : "application/x-www-form-urlencoded; charset=utf-8",       //上下文类型，默认为application/x-www-form-urlencoded; charset=utf-8,如果不修改此参数，则不需要传入
 *              customCallBack : xxxCustomResponseCallBackFunction,             //自定义Ajax响应处理方法，如果有自定义响应方法则传入此参数
 *              error : xxxErrorFunction
 *          })；
 ***************************************************************************************/
AjaxUtils = function(){}
AjaxUtils.service = function(config){
    new AjaxObject().executeAjax(config);
}


/***************************************************************************************
 * Ajax接口类，统一处理UI层与Server层的交互，接收UI请求参数，处理Server返回结果，此类不需要开发人员去手动创建，而是当AjaxUtils工具类中每次被UI层调用时自动创建。
 * @constructor
 ***************************************************************************************/
AjaxObject = function(){}

AjaxObject_Constant_Type = "post";          //post/get，默认为post
AjaxObject_Constant_DataType = "text";      //数据类型text/html...,默认为text
AjaxObject_Constant_ContentType = "application/x-www-form-urlencoded; charset=utf-8";   //上下文类型
AjaxObject_Constant_ShowZone = "main";//默认返回结果显示的DIV容器id

/**
 * Ajax接口工具类请求接口，统一处理UI层与Server层的交互，接收UI请求参数，处理Server返回结果
 * @param config
 */
AjaxObject.prototype.executeAjax = function(request){

    //初始化Ajax参数，没有传入的Ajax参数使用系统默认值
    request.async = (request.async == false ? false : true);
    request.showZone = (request.showZone == undefined ? AjaxObject_Constant_ShowZone : request.showZone);
    request.formData = (request.formData == undefined ? undefined : request.formData);
    request.type = (request.type == undefined ? AjaxObject_Constant_Type : request.type);
    request.dataType = (request.dataType == undefined ? AjaxObject_Constant_DataType : request.dataType);
    request.contentType = (request.contentType == undefined ? AjaxObject_Constant_ContentType : request.contentType);

    //Ajax正式请求Server服务，并处理返回结果
    $.ajax({
        url          : request.url,
        data         : request.formData,
        async        : request.async,
        type         : request.type,
        dataType    : request.dataType,
        contentType : request.contentType,
        beforeSend : function(){
            //系统级Ajax预处理方法，如在调用服务端请求URL之前，进行用户是否登录、以及Ajax请求参数的初始化、loading动画显示等功能
        },
        success : function(response,textStatus){
            var response = JSON.parse(response);
            /**
             * code : 后台返回的处理结果
             *
             *  0：成功；调自定义回调函数进行后续处理
             *  1：失败；说明后台程序异常了，只提示错误信息，不做其它任何处理
             * -1：验证失败 提示错误信息，并调用自定义函数进行后续处理
             * -2：前台未登录， 提示错误信息，并跳转到交易平台的统一登录页面
             * -3：后台未登录   提示错误信息，并跳转到论坛后台的登录页面
             */
            var code = response.code;

            //如果不成功，调用你自己的统一方法写你的逻辑
            if(code != 0){

            }
            //如果是成功，或后台验证失败，则调用自定义回调函数，对正确和错误结果做相应处理
            if(code == 0){
                //处理自定义的响应方法
                if(request.customCallBack != undefined){
                    //如关闭弹出窗口、刷新列表数据等，放在这里执行
                    request.customCallBack(response,request);
                }
            }
            //处理系统级的Ajax响应方法，如关闭loading动画等
            systemCallBack(response,request);
        },
        error : function(response){
            if(request.error != undefined){
                request.error(response);
            }
            //处理系统级的异常，如显示错误信息、关闭loading动画等
            systemError(response,request);
        }
    });
}

/**
 * //系统级的Ajax响应方法，如关闭loading动画等
 */
function systemCallBack(response , request){
}

/**
 * //处理系统级的Ajax响应异常方法，如关闭loading动画、显示系统错误提示等
 */
function systemError(response , request){
}