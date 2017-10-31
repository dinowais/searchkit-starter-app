"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var React = require("react");
var pure_render_1 = require("./pure-render");
var FastClick = (function (_super) {
    __extends(FastClick, _super);
    function FastClick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.threshold = 20;
        return _this;
    }
    FastClick.prototype.handleMouseDown = function (event) {
        if (this.supportsTouch)
            return;
        if (event.button === 0) {
            this.props.handler();
        }
    };
    FastClick.prototype.cleanupTouch = function () {
        delete this.startPoint;
    };
    FastClick.prototype.getSinglePoint = function (event) {
        var touches = event.changedTouches;
        if (touches.length === 1) {
            return {
                x: touches[0].pageX,
                y: touches[0].pageY
            };
        }
        return null;
    };
    FastClick.prototype.handleTouchStart = function (event) {
        this.supportsTouch = true;
        this.startPoint = this.getSinglePoint(event);
    };
    FastClick.prototype.pointsWithinThreshold = function (p1, p2) {
        return (Math.abs(p1.x - p2.x) < this.threshold &&
            Math.abs(p1.y - p2.y) < this.threshold);
    };
    FastClick.prototype.handleTouchEnd = function (event) {
        if (this.startPoint) {
            var endPoint = this.getSinglePoint(event);
            if (this.pointsWithinThreshold(this.startPoint, endPoint)) {
                this.props.handler();
            }
            this.cleanupTouch();
        }
    };
    FastClick.prototype.handleClick = function (event) {
        event.preventDefault();
    };
    FastClick.prototype.render = function () {
        return React.cloneElement(this.props.children, {
            onMouseDown: this.handleMouseDown.bind(this),
            onTouchStart: this.handleTouchStart.bind(this),
            onTouchEnd: this.handleTouchEnd.bind(this),
            onClick: this.handleClick.bind(this)
        });
    };
    return FastClick;
}(React.Component));
FastClick = __decorate([
    pure_render_1.PureRender
], FastClick);
exports.FastClick = FastClick;
//# sourceMappingURL=FastClick.js.map