﻿"use strict";
var errors: Object = {};

module app.importers {
    "use strict";

    export class BaseImporter {

        importUsage(usageNode: HTMLElement, context: string): model.DojoFunction {
            var result: model.DojoFunction = new model.DojoFunction();

            var argumentNodes: JQuery = $("tr", usageNode);
            if (argumentNodes) {
                for (var i: number = 1; i < argumentNodes.length; i++) {
                    result.addParameter(this.importArgument(<HTMLTableRowElement>argumentNodes[i], context));
                }
            }

            return result;
        }

        private importArgument(data: HTMLTableRowElement, context: string): model.DojoVariable {

            var result: model.DojoVariable = new model.DojoVariable();
            var name: string = $(".jsdoc-param-name", data).text()
            result.setName(name);

            var typeNode: HTMLElement = $(".jsdoc-param-type", data)[0];
            if (typeNode) {
                var types: string[] = typeNode.innerText.split(/\||\sor\s/);
                types.forEach((type: string): void => {
                    result.addType(this.getTypeForConstructorType(type.trim(), context + ":" + name));
                });
            }

            result.setDescription($(".jsdoc-param-description", data).text());
            result.setIsOptional($(".jsdoc-param-description em", data).length > 0);

            return result;
        }

        private getTypeForConstructorType(constructorType: string, context: string): string {
            var result: string;

            constructorType = constructorType.replace(/"|\?/, "");

            if (constructorType.trim() == "int") {
                var i: number = 1;
            }

            if (constructorType.match(/^\s*(dijit|dojo)/)) {
                result = constructorType;
            } else {
                var regex: RegExp = /^\s*Array\[([dojo|dijit].*\])/;

                var matches: string[] = constructorType.match(regex);

                if (matches) {
                    result = matches[1] + "[]";
                    result = result.replace("]]", "]");
                } else {
                    switch (constructorType.trim()) {
                        case "treeNode":
                            result = "dijit/Tree/_TreeNode";
                            break;
                        case "function(row,colArg)":
                            result = "{(row:Object,colArg:Object):Object";
                            break;
                        case "function(row,colIdx)":
                            result = "{(row:Object,colIdx:number):Object";
                            break;
                        case "Image":
                            result = "Image";
                            break;
                        case "Color":
                            result = "dojo/_base/Color";
                            break;
                        case "CanvasRenderingContext2D":
                            result = "CanvasRenderingContext2D";
                            break;
                        case "(_ConditionExpr":
                            result = "dojox/grid/enhanced/plugins/filter/_ConditionExpr";
                            break;
                        case "DOMNode":
                        case "DomNode":
                        case "DOM node":
                        case "Node":
                        case "OomNode":
                        case "Element":
                        case "HTMLNode":
                        case "HtmlNode":
                        case "Dom":
                        case "Node;":
                            result = "HTMLElement";
                            break;
                        case "EnhancedGrid":
                            result = "dojox/grid/enhanced/EnhancedGrid";
                            break;
                        case "Feature":
                            result = "dojox/geo/openlayers/Feature";
                            break;
                        case "Feature[]":
                            result = "dojox/geo/openlayers/Feature[]";
                            break;
                        case "OpenLayers.Map":
                            result = "dojox/geo/openlayers/Map";
                            break;
                        case "Stencil":
                            result = "dojox/drawing/stencil/_Base";
                            break;
                        case "ViewBase":
                            result = "dojox/calendar/ViewBase";
                            break;
                        case "_Indicator":
                            result = "dojox/gauges/_Indicator";
                            break;
                        case "_Plugin":
                            result = "dojox/sketch/_Plugin";
                            break;
                        case "IndicatorBase":
                            result = "dojox/dgauges/IndicatorBase";
                            break;
                        case "Rectangle":
                            result = "dojox/gfx/shape.Rect";
                            break;
                        case "View":
                            result = "dojox/app/View";
                            break;
                        case "_StoreLayer":
                            result = "dojox/grid/enhanced/plugins/_StoreLayer._StoreLayer";
                            break;
                        case "__FormatOptions":
                            result = "dojo/currency.__FormatOptions";
                            break;
                        case "HTMLFormElement":
                        case "form node":
                        case "form Node":
                            result = "HTMLFormElement";
                            break;
                        case "manager.Anchor":
                            result = "dojox/drawing/manager/Anchors";
                            break;
                        case "Point":
                            result = "dojox/geo/openlayers/Point";
                            break;
                        case "DOMNode[]":
                        case "DomNode[]":
                        case "Node[]":
                            result = "HTMLElement[]";
                            break;
                        case "Object":
                        case "Object.":
                        case "object":
                        case "Container.__ContainerArgs":
                        case "CriteriaBox":
                        case "Handle":
                        case "OpenLayers.Projection":
                        case "StencilData":
                        case "__printArgs":
                        case "areaObj":
                        case "request":
                        case "storeObject":
                        case "Moveable.__MoveableArgs":
                        case "DataSource":
                        case "Pointer":
                        case "attributes[]":
                        case "handle":
                        case "point":
                        case "(in":
                        case "out)keywordArgs":
                        case "Animation":
                        case "Arguments":
                        case "data item":
                            result = "Object";
                            break;
                        case "Object...":
                        case "StencilPoints":
                        case "Points[]":
                            result = "Object[]";
                            break;
                        case "Anything":
                        case "anything":
                        case "any":
                        case "return the plain value since it was found;":
                            result = "any";
                            break;
                        case "Object":
                        case "SWF":
                        case "CustomEventMethod":
                        case "Error object":
                            result = "Object";
                            break;
                        case "Object[]":
                            result = "Object[]";
                            break;
                        case "Boolean":
                        case "Bookean":
                        case "boolean":
                        case "bool":
                        case "boolean*":
                            result = "boolean";
                            break;
                        case "String":
                        case "string":
                        case "attribute-name-string":
                        case "String hebrew":
                        case "String hebrew year":
                        case "String[2]":
                        case "property":
                        case "query":
                        case "word":
                        case "(in)string":
                        case "name:":
                        case "summary:":
                            result = "String";
                            break;
                        case "String[]":
                        case "String...":
                        case "word[]":
                        case "Return an array of property names":
                            result = "String[]";
                            break;
                        case "Number":
                        case "Number, optional":
                        case "NUmber":
                        case "Decimal":
                        case "int":
                        case "Float":
                        case "float":
                        case "Integer":
                        case "integer":
                        case "Int":
                        case "id":
                        case "number":
                        case "sha32.outputTypes":
                        case "sha64.outputTypes":
                        case "Angle":
                        case "CircularScale":
                        case "Integer, optional":
                            result = "number";
                            break;
                        case "Integer[]":
                        case "int[]":
                        case "Number[]":
                        case "byte[]":
                        case "Integer...":
                            result = "number[]";
                            break;
                        case "Array":
                        case "array":
                            result = "any[]";
                            break;
                        case "Event":
                            result = "Event";
                            break;
                        case "Document":
                        case "DocumentElement":
                        case "DocumentNode":
                        case "MDocumentElement":
                            result = "HTMLDocument";
                            break;
                        case "Window":
                            result = "Window";
                            break;
                        case "attribute":
                            result = "Attr";
                            break;
                        case "function":
                        case "Function":
                        case "Class":
                            result = "Function";
                            break;
                        case "void":
                            result = "void";
                            break;
                        case "function[]":
                        case "Function[]":
                            result = "Function[]";
                            break;
                        case "Date":
                            result = "Date";
                            break;
                        case "Date[]":
                        case "array of dates":
                        case "array of ISO dates":
                            result = "Date[]";
                            break;
                        case "Uri":
                        case "url":
                            result = "URL";
                            break;
                        case "Nodelist":
                        case "NodeList":
                            result = "NodeList";
                            break;
                        case "TreeNode":
                        case "_tree.Node":
                            result = "dijit/Tree._TreeNode";
                            break;
                        case "Widget":
                        case "_Widget":
                            result = "dijit/_WidgetBase";
                            break;
                        case "Widget[]":
                            result = "dijit/_WidgetBase[]";
                            break;
                        case "Deferred":
                        case "deferred":
                            result = "dojo/Deferred";
                            break;
                        case "MenuItem":
                            result = "dijit/MenuItem";
                            break;
                        case "ListItem":
                            result = "dojox/mobile/ListItem";
                            break;
                        case "__SelectOption":
                            result = "dijit/form/_FormSelectWidget.__SelectOption";
                            break;
                        case "__SelectOption[]":
                            result = "dijit/form/_FormSelectWidget.__SelectOption[]";
                            break;
                        case "Error":
                            result = "Error";
                            break;
                        case "function(items)":
                            result = "{(items:any[])}";
                            break;
                        case "function(Integer, item)":
                            result = "{(index:number,item:Object)}";
                            break;
                        case "function(items, size)":
                            result = "{(items:Object[], size:number)}";
                            break;
                        case "Item":
                        case "item":
                        case "Anything":
                        case "almost anything":
                        case "Container.Item":
                        case "value":
                        case "undefined":
                        case "null":
                        case "Null":
                        case "null)":
                        case "mixed...":
                        case "Nothing":
                        case "Mixed":
                        case "instance":
                        case "jsx3.xml.Entity":
                            result = "any";
                            break;
                        case "Anything[]":
                        case "__SelectItem[]":
                        case "item[]":
                            result = "any[]";
                            break;
                        case "RegExp":
                        case "RegEx":
                            result = "RegExp";
                            break;
                        case "DOMEvent":
                        case "EventObject":
                        case "HTMLEvent":
                            result = "Event";
                            break;
                        case "MouseEvent":
                        case "Mouse Event":
                        case "MouseEvemt":
                            result = "MouseEvent";
                            break;
                        case "KeyboardEvent":
                        case "Key Event":
                            result = "KeyboardEvent";
                            break;
                        case "Promise":
                            result = "dojo/promise/Promise";
                            break;
                        case "[object Value(type: function, value: undefined)]":
                            result = "{type:Function;value:any}";
                            break;
                        case "__Item[]":
                            result = "dijit/tree/dndSource.__Item[]";
                            break;
                        case "data-store":
                            result = "dojo/data/api/Read";
                            break;
                        default:
                            console.error("Cannot convert constructor type \"" + constructorType + "\" to Typescript type. Check 'errors' object for details.");
                            errors[constructorType.trim()] = errors[constructorType.trim()] || [];
                            errors[constructorType.trim()].push(context);
                            break;
                    }
                }
            }

            return result;
        }

        importProperties(content: HTMLElement, className: string): model.DojoVariable[] {
            var result: model.DojoVariable[] = [];

            var memberHeaders: JQuery = $(".jsdoc-fields h2", content);
            for (var i: number = 0; i < memberHeaders.length; i++) {
                if (memberHeaders[i].textContent.match("Properties")) {
                    var fieldContainer: HTMLElement = <HTMLElement>memberHeaders[i].nextElementSibling;
                    var publicFieldData: NodeList = <NodeList>fieldContainer.querySelectorAll(".public");
                    for (var j: number = 0; j < publicFieldData.length; j++) {
                        var titleNode: HTMLSpanElement = <HTMLSpanElement>$(".jsdoc-title span", publicFieldData[j])[0];
                        var title: string = titleNode.textContent;
                        var type: string = this.getTypeForClassName(titleNode.className);
                        var definingClass: string = $(".jsdoc-inheritance a", publicFieldData[j]).text();
                        var description: string = $(".jsdoc-summary", publicFieldData[j]).text();

                        var dojoVariable: model.DojoVariable = new model.DojoVariable();
                        dojoVariable.setDescription(description);
                        dojoVariable.setName(title);
                        dojoVariable.addType(type);

                        result.push(dojoVariable);
                    }
                }
            }

            return result;
        }

        importMethods(content: HTMLElement, className: string, headerLabel: string): model.DojoFunction[] {
            var result: model.DojoFunction[] = [];

            var memberHeaders: JQuery = $(".jsdoc-fields h2", content);
            for (var i: number = 0; i < memberHeaders.length; i++) {
                if (memberHeaders[i].textContent.match(headerLabel)) {
                    var methodContainer: HTMLElement = <HTMLElement>memberHeaders[i].nextElementSibling;
                    var publicMethodData: NodeList = <NodeList>methodContainer.querySelectorAll(".jsdoc-field:not(.private)");
                    for (var j: number = 0; j < publicMethodData.length; j++) {
                        var inheritenceNode: HTMLElement =
                            <HTMLElement>(<HTMLElement>publicMethodData[j]).querySelector(".jsdoc-inheritance");

                        var dojoFunction: model.DojoFunction = new model.DojoFunction();

                        var titleNode: HTMLSpanElement = <HTMLSpanElement>$(".jsdoc-title span[class*=Icon]", publicMethodData[j])[0];
                        var title: string = titleNode.textContent;
                        var description: string = $(".jsdoc-full-summary", publicMethodData[j]).text();
                        var parameters: model.DojoVariable[] = this.createParameters(<HTMLElement>publicMethodData[j], className);
                        var returnTypes: model.DojoVariable[] = this.createReturnTypes(<HTMLElement>publicMethodData[j], className);

                        dojoFunction.setName(title);
                        dojoFunction.setDescription(description);
                        parameters.forEach((parameter: model.DojoVariable): void => {
                            dojoFunction.addParameter(parameter);
                        });
                        returnTypes.forEach((returnType: model.DojoVariable): void => {
                            dojoFunction.addReturnType(returnType);
                        });

                        result.push(dojoFunction);
                    }
                }
            }

            return result;
        }



        private createParameters(content: HTMLElement, context: string): model.DojoVariable[] {
            var result: model.DojoVariable[] = [];

            var rows: NodeList = content.querySelectorAll(".jsdoc-parameters tr");

            if (rows) {
                for (var i: number = 1; i < rows.length; i++) {
                    var dojoVariable: model.DojoVariable = new model.DojoVariable();

                    var name: string = $(".jsdoc-param-name", rows[i]).text();
                    var types: string[] = $(".jsdoc-param-type", rows[i]).text().split(/\||\sor\s/);
                    var description: string = $(".jsdoc-param-description", rows[i]).text();

                    dojoVariable.setName(name);
                    dojoVariable.setDescription(description);
                    types.forEach((type: string): void => {
                        dojoVariable.addType(this.getTypeForConstructorType(type, context + " : " + name));
                    });
                    result.push(dojoVariable);

                }
            }

            return result;
        }

        private createReturnTypes(content: HTMLElement, context: string): model.DojoVariable[] {
            var result: model.DojoVariable[] = [];

            var element: HTMLElement = <HTMLElement>content.querySelector(".jsdoc-return-type");

            if (element) {
                var dojoVariable: model.DojoVariable = new model.DojoVariable();

                var types: string[] = element.innerText.split(/\||\sor\s/);
                var description: string = "";

                var descriptionElement: HTMLElement = <HTMLElement>content.querySelector(".jsdoc-return-description");
                if (descriptionElement) {
                    description = descriptionElement.innerText;
                }

                dojoVariable.setDescription(description);

                types.forEach((type: string): void => {
                    dojoVariable.addType(this.getTypeForConstructorType(type, context));
                });

                result.push(dojoVariable);

            }

            return result;
        }

        private getTypeForClassName(className: string): string {
            var result: string;
            switch (className) {
                case "objectIcon":
                    result = "Object";
                    break;
                case "booleanIcon":
                    result = "boolean";
                    break;
                case "stringIcon":
                    result = "string";
                    break;
                case "domnodeIcon":
                    result = "HTMLElement";
                    break;
                case "numberIcon":
                    result = "number";
                    break;
                case "functionIcon":
                    result = "Function";
                    break;
                case "arrayIcon":
                    result = "any[]";
                    break;
                case "constructorIcon":
                    result = "Function";
                    break;
                case "dateIcon":
                    result = "Date";
                    break;
                case "regexpIcon":
                    result = "RegExp";
                    break;
                default:
                    console.error("Unknown className: " + className + ". Can't convert to type");

            }

            return result;
        }
    }
} 