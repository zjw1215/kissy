function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/combobox/render.js']) {
  _$jscoverage['/combobox/render.js'] = {};
  _$jscoverage['/combobox/render.js'].lineData = [];
  _$jscoverage['/combobox/render.js'].lineData[6] = 0;
  _$jscoverage['/combobox/render.js'].lineData[8] = 0;
  _$jscoverage['/combobox/render.js'].lineData[11] = 0;
  _$jscoverage['/combobox/render.js'].lineData[20] = 0;
  _$jscoverage['/combobox/render.js'].lineData[24] = 0;
  _$jscoverage['/combobox/render.js'].lineData[28] = 0;
  _$jscoverage['/combobox/render.js'].lineData[29] = 0;
  _$jscoverage['/combobox/render.js'].lineData[40] = 0;
  _$jscoverage['/combobox/render.js'].lineData[43] = 0;
  _$jscoverage['/combobox/render.js'].lineData[46] = 0;
  _$jscoverage['/combobox/render.js'].lineData[49] = 0;
  _$jscoverage['/combobox/render.js'].lineData[52] = 0;
  _$jscoverage['/combobox/render.js'].lineData[57] = 0;
}
if (! _$jscoverage['/combobox/render.js'].functionData) {
  _$jscoverage['/combobox/render.js'].functionData = [];
  _$jscoverage['/combobox/render.js'].functionData[0] = 0;
  _$jscoverage['/combobox/render.js'].functionData[1] = 0;
  _$jscoverage['/combobox/render.js'].functionData[2] = 0;
  _$jscoverage['/combobox/render.js'].functionData[3] = 0;
  _$jscoverage['/combobox/render.js'].functionData[4] = 0;
  _$jscoverage['/combobox/render.js'].functionData[5] = 0;
  _$jscoverage['/combobox/render.js'].functionData[6] = 0;
  _$jscoverage['/combobox/render.js'].functionData[7] = 0;
  _$jscoverage['/combobox/render.js'].functionData[8] = 0;
  _$jscoverage['/combobox/render.js'].functionData[9] = 0;
}
if (! _$jscoverage['/combobox/render.js'].branchData) {
  _$jscoverage['/combobox/render.js'].branchData = {};
}
_$jscoverage['/combobox/render.js'].lineData[6]++;
KISSY.add("combobox/render", function(S, Control, ComboboxTpl) {
  _$jscoverage['/combobox/render.js'].functionData[0]++;
  _$jscoverage['/combobox/render.js'].lineData[8]++;
  var ComboboxRender = Control.getDefaultRender().extend({
  beforeCreateDom: function(renderData, childrenElSelectors) {
  _$jscoverage['/combobox/render.js'].functionData[1]++;
  _$jscoverage['/combobox/render.js'].lineData[11]++;
  S.mix(childrenElSelectors, {
  input: '#ks-combobox-input-{id}', 
  trigger: '#ks-combobox-trigger-{id}', 
  invalidEl: '#ks-combobox-invalid-el-{id}', 
  placeholderEl: '#ks-combobox-placeholder-{id}'});
}, 
  getKeyEventTarget: function() {
  _$jscoverage['/combobox/render.js'].functionData[2]++;
  _$jscoverage['/combobox/render.js'].lineData[20]++;
  return this.control.get("input");
}, 
  _onSetCollapsed: function(v) {
  _$jscoverage['/combobox/render.js'].functionData[3]++;
  _$jscoverage['/combobox/render.js'].lineData[24]++;
  this.control.get("input").attr("aria-expanded", !v);
}, 
  _onSetDisabled: function(v, e) {
  _$jscoverage['/combobox/render.js'].functionData[4]++;
  _$jscoverage['/combobox/render.js'].lineData[28]++;
  this.callSuper(v, e);
  _$jscoverage['/combobox/render.js'].lineData[29]++;
  this.control.get("input").attr("disabled", v);
}}, {
  ATTRS: {
  contentTpl: {
  value: ComboboxTpl}}, 
  HTML_PARSER: {
  value: function(el) {
  _$jscoverage['/combobox/render.js'].functionData[5]++;
  _$jscoverage['/combobox/render.js'].lineData[40]++;
  return el.one("." + this.getBaseCssClass('input')).val();
}, 
  input: function(el) {
  _$jscoverage['/combobox/render.js'].functionData[6]++;
  _$jscoverage['/combobox/render.js'].lineData[43]++;
  return el.one("." + this.getBaseCssClass('input'));
}, 
  trigger: function(el) {
  _$jscoverage['/combobox/render.js'].functionData[7]++;
  _$jscoverage['/combobox/render.js'].lineData[46]++;
  return el.one("." + this.getBaseCssClass('trigger'));
}, 
  invalidEl: function(el) {
  _$jscoverage['/combobox/render.js'].functionData[8]++;
  _$jscoverage['/combobox/render.js'].lineData[49]++;
  return el.one("." + this.getBaseCssClass('invalid-el'));
}, 
  placeholderEl: function(el) {
  _$jscoverage['/combobox/render.js'].functionData[9]++;
  _$jscoverage['/combobox/render.js'].lineData[52]++;
  return el.one("." + this.getBaseCssClass('placeholder'));
}}});
  _$jscoverage['/combobox/render.js'].lineData[57]++;
  return ComboboxRender;
}, {
  requires: ['component/control', './combobox-xtpl']});
