/*
 * This file contains the JavaScript code that the HybridWebView control uses to
 * communicate between the web view and the .NET host application.
 *
 * The JavaScript file is generated from TypeScript and should not be modified
 * directly. To make changes, modify the TypeScript file and then recompile it.
 */
(() => {
    /*
     * Initialize the HybridWebView messaging system.
     * This method is called once when the page is loaded.
     */
    function initHybridWebView() {
        function dispatchHybridWebViewMessage(message) {
            const event = new CustomEvent('HybridWebViewMessageReceived', { detail: { message: message } });
            window.dispatchEvent(event);
        }
        if (window.chrome?.webview?.addEventListener) {
            // Windows WebView2
            window.chrome.webview.addEventListener('message', (arg) => {
                dispatchHybridWebViewMessage(arg.data);
            });
        }
        else if (window.webkit?.messageHandlers?.webwindowinterop) {
            // iOS and MacCatalyst WKWebView
            // @ts-ignore - We are extending the global object here
            window.external = {
                receiveMessage: (message) => {
                    dispatchHybridWebViewMessage(message);
                },
            };
        }
        else {
            // Android WebView
            window.addEventListener('message', (arg) => {
                dispatchHybridWebViewMessage(arg.data);
            });
        }
    }
    /*
     * Send a message to the .NET host application.
     * The message is sent as a string with the following format: `<type>|<message>`.
     */
    function sendMessageToDotNet(type, message) {
        const messageToSend = type + '|' + message;
        if (window.chrome && window.chrome.webview) {
            // Windows WebView2
            window.chrome.webview.postMessage(messageToSend);
        }
        else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.webwindowinterop) {
            // iOS and MacCatalyst WKWebView
            window.webkit.messageHandlers.webwindowinterop.postMessage(messageToSend);
        }
        else if (window.hybridWebViewHost) {
            // Android WebView
            window.hybridWebViewHost.sendMessage(messageToSend);
        }
        else {
            console.error('Unable to send messages to .NET because the host environment for the HybridWebView was unknown.');
        }
    }
    /*
     * Send a message to the .NET host application indicating that a JavaScript method invocation completed.
     * The result is sent as a string with the following format: `<taskId>|<result-json>`.
     */
    function invokeJavaScriptCallbackInDotNet(taskId, result) {
        const json = JSON.stringify(result);
        sendMessageToDotNet('__InvokeJavaScriptCompleted', taskId + '|' + json);
    }
    const HybridWebView = {
        /*
         * Send a raw message to the .NET host application.
         * The message is sent directly and not processed or serialized.
         *
         * @param message The message to send to the .NET host application.
         */
        SendRawMessage: function (message) {
            sendMessageToDotNet('__RawMessage', message);
        },
        /*
         * Invoke a .NET method on the InvokeJavaScriptTarget instance.
         * The method name and parameters are serialized and sent to the .NET host application.
         *
         * @param methodName The name of the .NET method to invoke.
         * @param paramValues The parameters to pass to the .NET method. If the method takes no parameters, this can be omitted.
         *
         * @returns A promise that resolves with the result of the .NET method invocation.
         */
        InvokeDotNet: async function (methodName, paramValues) {
            const body = {
                MethodName: methodName
            };
            // if parameters were provided, serialize them first
            if (paramValues !== undefined) {
                if (!Array.isArray(paramValues)) {
                    paramValues = [paramValues];
                }
                for (let i = 0; i < paramValues.length; i++) {
                    paramValues[i] = JSON.stringify(paramValues[i]);
                }
                if (paramValues.length > 0) {
                    body.ParamValues = paramValues;
                }
            }
            const message = JSON.stringify(body);
            const requestUrl = `${window.location.origin}/__hwvInvokeDotNet?data=${encodeURIComponent(message)}`;
            const rawResponse = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const response = await rawResponse.json();
            if (!response) {
                return null;
            }
            if (response.IsJson) {
                return JSON.parse(response.Result);
            }
            return response.Result;
        },
        /*
         * Invoke a JavaScript method from the .NET host application.
         * This method is called from the HybridWebViewHandler and is not intended to be used by user applications.
         *
         * @param taskId The task ID that was provided by the .NET host application.
         * @param methodName The JavaScript method to invoke in the global scope.
         * @param args The arguments to pass to the JavaScript method.
         *
         * @returns A promise.
         */
        __InvokeJavaScript: async function (taskId, methodName, args) {
            try {
                let result = null;
                // @ts-ignore - We are checking the type of the function here
                if (methodName[Symbol.toStringTag] === 'AsyncFunction') {
                    result = await methodName(...args);
                }
                else {
                    result = methodName(...args);
                }
                invokeJavaScriptCallbackInDotNet(taskId, result);
            }
            catch (ex) {
                console.error(ex);
            }
        }
    };
    // Make the following APIs available in global scope for invocation from JS
    // @ts-ignore - We are extending the global object here
    window['HybridWebView'] = HybridWebView;
    // Initialize the HybridWebView
    initHybridWebView();
})();
